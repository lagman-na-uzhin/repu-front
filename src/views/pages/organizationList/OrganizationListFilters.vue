<script setup>
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['update:filters', 'apply:filters', 'reset:filters'])

const states = ref([
  {label: 'Все', value: null},
  {label: 'Активные', value: true},
  {label: 'Неактивные', value: false},
])

const selectedState = ref(states[0])

const resetFilters = () => {
  selectedState.value = null
  emit('reset:filters')
}

watch([selectedState], () => {
  emit('update:filters', {
    isActive: selectedState.value,
  })
}, { deep: true })
</script>

<template>
  <VCard class="mb-4 review-filters-card">
    <VCardTitle class="d-flex align-center justify-space-between pb-10">
      <h6 class="secondary text-h6">
        Фильтры
      </h6>

      <VBtn
        class="ml-2 text-h6"
        variant="text"
        @click="resetFilters"
      >
        Очистить
      </VBtn>
    </VCardTitle>
    <VCardText>
      <VRow class="mt-2">
        <VCol cols="12" class="pa-0  pb-5">
          <VSelect
            v-model="selectedState"
            :items="states"
            item-title="label"
            item-value="value"
            label="Активность"
            variant="outlined"
            density="comfortable"
            no-data-text=""
            clearable
            hide-details
            hide-selected
            persistent-placeholder
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
