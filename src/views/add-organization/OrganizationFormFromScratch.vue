<script setup lang="ts">
defineProps<{
  name: string | null
  city: string | null
  address: string | null
  cities: string[]
  addressOptions: string[]
}>()

defineEmits<{
  (e: 'update:name', val: string): void
  (e: 'update:city', val: string): void
  (e: 'update:address', val: string): void
}>()
</script>

<template>
  <VCol cols="12">
    <VTextField
      :model-value="name"
      @update:model-value="$emit('update:name', $event)"
      label="Название организации"
      placeholder="Введите название организации"
      persistent-placeholder
    />
  </VCol>

  <VCol cols="12">
    <VAutocomplete
      :model-value="city"
      @update:model-value="$emit('update:city', $event)"
      :items="cities"
      label="Город"
      placeholder="Выберите город"
      persistent-placeholder
      clearable
    />
  </VCol>

  <VCol cols="12" v-if="city">
    <VAutocomplete
      :model-value="address"
      @update:model-value="$emit('update:address', $event)"
      :items="addressOptions"
      label="Адрес"
      placeholder="Выберите адрес"
      persistent-placeholder
      clearable
    />
  </VCol>
</template>
