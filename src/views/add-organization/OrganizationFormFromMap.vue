<script setup lang="ts">
defineProps<{ name: string | null }>()
defineEmits<{ (e: 'update:name', val: string): void }>()

const organizationOptions = [
  'Пример организации 1',
  'Пример организации 2',
  'Пример организации 3',
]
</script>

<template>
  <VCol cols="12">
    <VAutocomplete
      :model-value="name"
      @update:model-value="$emit('update:name', $event)"
      :items="organizationOptions"
      label="Поиск по названию организации"
      placeholder="Введите название для поиска"
      persistent-placeholder
    />
  </VCol>
</template>
