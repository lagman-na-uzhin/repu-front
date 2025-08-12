<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  placements: {
    type: Array,
    required: true
  },
  selectedPlacements: {
    type: Array,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'update:selectedPlacements', value: string[]): void
}>()

function togglePlacement(value: string | null) {
  const strValue = value === null ? 'none' : value
  let selected = [...props.selectedPlacements]

  if (strValue === 'none') {
    // Нажали на "не размещена нигде" — сбрасываем всё, выбираем только её
    emit('update:selectedPlacements', ['none'])
  } else {
    // Удаляем 'none' если он есть
    selected = selected.filter(v => v !== 'none')

    const index = selected.indexOf(strValue)
    if (index !== -1) {
      // Убираем выбранное размещение
      selected.splice(index, 1)
    } else {
      // Добавляем новое размещение
      selected.push(strValue)
    }

    emit('update:selectedPlacements', selected)
  }
}


</script>

<template>
  <div>
    <VCol
      v-for="placement in placements"
      :key="placement.label"
      cols="12"
      class="d-flex flex-column align-center justify-center"
    >
      <VCard
        class="pa-4 d-flex align-center cursor-pointer"
        :elevation="selectedPlacements.includes(placement.value === null ? 'none' : placement.value) ? 4 : 1"
        :class="{
          'bg-light-primary text-white': selectedPlacements.includes(placement.value === null ? 'none' : placement.value),
          'bg-grey-lighten-4': !selectedPlacements.includes(placement.value === null ? 'none' : placement.value),
        }"
        style="width: 100%; justify-content: center"
        @click="togglePlacement(placement.value)"
      >
        <VAvatar
          v-if="placement.icon"
          size="36"
          class="me-4 bg-white"
        >
          <img
            :src="placement.icon"
            alt="icon"
            class="w-100 h-100"
            style="object-fit: contain"
          />
        </VAvatar>
        <span class="text-subtitle-1 font-weight-medium">{{ placement.label }}</span>
      </VCard>
    </VCol>
  </div>
</template>
