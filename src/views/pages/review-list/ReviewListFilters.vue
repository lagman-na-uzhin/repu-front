<script setup>
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['update:filters', 'apply:filters', 'reset:filters'])

const platforms = ref([
  { label: '2GIS', value: 'TWOGIS' },
  { label: 'Яндекс Карты', value: 'YANDEX' },
])

const tones = ref([
  { label: 'Все', value: null },
  { label: 'Позитивные', value: 'positive' },
  { label: 'Отрицательные', value: 'negative' },
])

const selectedPlatform = ref(null)
const selectedTone = ref(tones.value[0])
const dateFrom = ref(null)
const dateTo = ref(null)

watch([selectedPlatform, selectedTone, dateFrom, dateTo], () => {
  emit('update:filters', {
    platform: selectedPlatform.value,
    tone: selectedTone.value?.value || null,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
  })
}, { deep: true })

// Функция для сброса фильтров
const resetFilters = () => {
  selectedPlatform.value = null
  selectedTone.value = null
  dateFrom.value = null
  dateTo.value = null
  emit('reset:filters')
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
        <VCol
          cols="12"
          class="pa-0 pb-5"
        >
          <VSelect
            v-model="selectedPlatform"
            :items="platforms"
            item-title="label"
            item-value="value"
            label="Размещение"
            variant="outlined"
            density="comfortable"
            clearable
            closable-chips
            hide-details
            hide-selected
            persistent-placeholder
          />
        </VCol>
      </VRow>

      <VRow class="mt-2">
        <VCol
          cols="12"
          class="pa-0  pb-5"
        >
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
        <VCol
          cols="12"
          class="pa-0  pb-5"
        >
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
