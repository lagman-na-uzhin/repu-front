<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue'
import type { IEmployee } from '@/shared/contracts/employee/employee'

const props = defineProps({
  employee: {
    type: Object as () => IEmployee,
    required: true,
  },
})

const emit = defineEmits(['edit'])

const handleEdit = () => {
  emit('edit')
}

// Корректный URL для заглушки
const avatarPlaceholderUrl = 'https://picsum.photos/40' // Пример заглушки

const avatarUrl = computed(() => props.employee?.avatarUrl || avatarPlaceholderUrl)

</script>

<template>
  <VCard class="member-card">
    <VListItem>
      <template #prepend>
        <VAvatar
          color="primary"
          size="40"
          rounded="lg"
        >
          <VImg
            v-if="employee?.avatarUrl"
            :src="employee.avatarUrl"
          />
          <span
            v-else
            class="text-h6"
          >
            {{  }}
          </span>
        </VAvatar>
      </template>

      <VListItemTitle class="font-weight-medium text-lg">
        {{ employee.name }}
      </VListItemTitle>
      <VListItemSubtitle class="text-sm">
        {{ employee.email }}
      </VListItemSubtitle>
      <VListItemSubtitle class="text-sm text-capitalize">
        {{ employee.role.name }}
      </VListItemSubtitle>

      <template #append>
        <VBtn
          icon="bx-edit"
          variant="text"
          size="small"
          color="secondary"
        />
      </template>
    </VListItem>
  </VCard>
</template>
