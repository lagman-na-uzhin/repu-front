<script setup>
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['update:filters', 'apply:filters', 'reset:filters'])

const platforms = ref([
  {label: '2GIS', value: 'TWOGIS'},
  {label: 'Яндекс Карты', value: 'YANDEX'},
])

const tones = ref([
  {label: 'Все', value: null},
  {label: 'Позитивные', value: 'positive'},
  {label: 'Отрицательные', value: 'negative'},
])

const selectedPlatforms = ref(null)
const selectedTone = ref(tones[0])
const dateFrom = ref(null)
const dateTo = ref(null)

watch([selectedPlatforms, selectedTone, dateFrom, dateTo], () => {
  emit('update:filters', {
    platforms: selectedPlatforms.value,
    tone: selectedTone.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  })
}, { deep: true })

// Функция для сброса фильтров
const resetFilters = () => {
  selectedPlatforms.value = []
  selectedTone.value = 'all'
  dateFrom.value = null
  dateTo.value = null
  emit('reset:filters') // Эмитим 'reset:filters'
}
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
      <VRow>
        <VCol cols="12" class="pa-0 pb-5">
          <VSelect
            v-model="selectedPlatforms"
            :items="platforms"
            item-title="label"
            item-value="value"
            label="Все площадки"
            variant="outlined"
            density="comfortable"
            no-data-text=""
            multiple
            clearable
            chips
            closable-chips
            hide-details
            hide-selected
            persistent-placeholder
          />
        </VCol>
      </VRow>

      <VRow class="mt-2">
        <VCol cols="12" class="pa-0  pb-5">
          <VSelect
            v-model="selectedTone"
            :items="tones"
            item-title="label"
            item-value="value"
            label="Все тональности"
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

      <VRow class="mt-2">
        <VCol cols="12" class="pa-0  pb-5">
          <VTextField
            v-model="dateFrom"
            label="Дата от"
            type="date"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            class="mb-2"
          />
          <VTextField
            v-model="dateTo"
            label="Дата до"
            type="date"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
