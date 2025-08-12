<script setup lang="ts">
import { ref, computed } from 'vue'


const props = defineProps<{
  modelValue: boolean
}>()


const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', value: { name: string; category: string; city: string; address: string }): void
}>()

const currentStep = ref<1 | 2>(1)

const name = ref<string | null>(null)
const city = ref<string | null>(null)
const address = ref<string | null>(null)

const selectedPlacements = ref<string[]>([])

const placements = [
  { label: 'Яндекс Карты', value: 'yandex', icon: 'https://static.tildacdn.biz/tild3537-6162-4762-b431-306432353830/ya_map.png' },
  { label: 'Google Maps', value: 'google', icon: 'https://static.tildacdn.biz/tild3561-3162-4566-a565-333935346565/1.png' },
  { label: '2ГИС', value: '2gis', icon: 'https://static.tildacdn.biz/tild6264-3565-4132-b465-643935663933/2_1.png' },
  { label: 'Не размещена нигде', value: null, icon: null },
]


const addressesByCity: Record<string, string[]> = {
  'Москва': ['ул. Ленина, 1', 'пр-т Мира, 5'],
  'Санкт-Петербург': ['Невский пр., 10', 'ул. Садовая, 20'],
  'Казань': ['ул. Баумана, 3', 'ул. Кремлёвская, 15'],
}

const addressOptions = computed(() => {
  return city.value ? addressesByCity[city.value] || [] : []
})

function onSubmit() {
  emit('save', {
    name: name.value || '',
    category: 'Без категории',
    city: city.value || '',
    address: address.value || '',
  })
}
</script>

<template>
  <VDialog
    max-width="1600"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <PlacementSearchForm/>
  </VDialog>
</template>
