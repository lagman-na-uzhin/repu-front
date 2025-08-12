<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { format } from 'date-fns' // Для форматирования даты, установите: npm install date-fns
import { useAuthStore } from '@/stores/auth.store'
import type { Lead } from '@/stores/lead.store'
import { useLeadStore } from '@/stores/lead.store'

const props = defineProps<{
  lead: Lead
}>()

const emit = defineEmits<{
  (e: 'assign-manager', payload: { leadId: string; managerId: string | null; managerName: string | null }): void
  (e: 'process-lead', lead: Lead): void
}>()

const leadStore = useLeadStore()
const authStore = useAuthStore()

const selectedManagerId = ref<string | null>(props.lead.assignedManagerId)

// Форматирование даты создания
const formattedCreatedAt = computed(() => {
  return format(new Date(props.lead.createdAt), 'dd.MM.yyyy HH:mm')
})

// Опции для выпадающего списка менеджеров
const managerOptions = computed(() => {
  const options: any[] = [...leadStore.managers] // Копируем доступных менеджеров

  // Добавляем опцию "Назначить себя" только если текущий пользователь является менеджером/владельцем
  const currentUser = authStore.user
  if (currentUser && (currentUser.type === 'MANAGER' || currentUser.type === 'OWNER')) {
    // Проверяем, что текущий пользователь уже не в списке менеджеров (если он сам менеджер)
    const isCurrentUserAlreadyInList = options.some(m => m.id === currentUser.id)
    if (!isCurrentUserAlreadyInList) {
      options.unshift({ id: currentUser.id, name: `${currentUser.name} (Я)` })
    }
    else {
      // Если он уже в списке, обновляем его имя, чтобы добавить "(Я)"
      const selfOption = options.find(m => m.id === currentUser.id)
      if (selfOption)
        selfOption.name = `${currentUser.name} (Я)`
    }
  }

  return options
})

// Обработчик изменения выбора менеджера
const onManagerSelect = (newManagerId: string | null) => {
  let managerName: string | null = null
  if (newManagerId) {
    const manager = managerOptions.value.find(m => m.id === newManagerId)

    managerName = manager ? manager.name.replace(' (Я)', '') : null // Удаляем "(Я)" если есть
  }
  emit('assign-manager', { leadId: props.lead.id, managerId: newManagerId, managerName })
}

// Синхронизируем внутреннее состояние выбранного менеджера с props.lead.assignedManagerId
watch(() => props.lead.assignedManagerId, newValue => {
  selectedManagerId.value = newValue
}, { immediate: true })
</script>

<template>
  <VCard class="mb-4">
    <VCardTitle>{{ lead.name }}</VCardTitle>
    <VCardSubtitle>Компания: {{ lead.companyName }}</VCardSubtitle>
    <VCardText>
      <div><strong>Email:</strong> {{ lead.email }}</div>
      <div><strong>Телефон:</strong> {{ lead.phone }}</div>
      <div><strong>Создан:</strong> {{ formattedCreatedAt }}</div>
      <div class="mt-2">
        <strong>Менеджер:</strong>
        <span
          v-if="!lead.assignedManagerId"
          class="text-error"
        >Не назначен</span>
        <span v-else>{{ lead.assignedManagerName }}</span>
      </div>

      <VSelect
        v-if="!selectedManagerId"
        v-model="selectedManagerId"
        :items="managerOptions"
        item-title="name"
        item-value="id"
        label="Назначить менеджера"
        clearable
        density="compact"
        hide-details
        class="mt-3"
        @update:model-value="onManagerSelect"
      />
    </VCardText>
    <VCardActions>
      <VBtn
        v-if="lead.assignedManagerId"
        color="primary"
        variant="flat"
        @click="emit('process-lead', lead)"
      >
        Обработать
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<style scoped>
</style>
