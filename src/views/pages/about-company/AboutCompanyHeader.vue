<script setup lang="ts">
defineProps<{
  companyName: string
  organizationsCount: number
  hasChanges: boolean
}>()

const emit = defineEmits<{
  (e: 'save'): void
}>()

function save() {
  emit('save')
}
</script>


<template>
  <VCard class="d-flex justify-space-between align-center pa-4 flex-wrap">
    <h1 class="text-h5 font-weight-medium">
      {{ companyName }}, <span class="font-italic text-secondary">{{ organizationsCount || 0 }} организаций</span>
    </h1>

    <div class="d-flex gap-2">
      <VBtn
        :disabled="!hasChanges"
        color="primary"
        @click="save"
      >
        Сохранить изменения
      </VBtn>
      <VBtn variant="outlined">
        Отменить
      </VBtn>
    </div>
  </VCard>
</template>

