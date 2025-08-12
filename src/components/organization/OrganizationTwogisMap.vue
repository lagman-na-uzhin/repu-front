<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { load } from '@2gis/mapgl'

const props = defineProps<{
  latitude: number
  longitude: number
  apiKey: string
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let mapInstance = null
let markerInstance = null

const initMap = async () => {
  if (!mapContainer.value || !props.apiKey) {
    console.error('Контейнер карты или API-ключ не определены.')

    return
  }

  if (mapInstance) {
    mapInstance.destroy()
    markerInstance = null
  }

  const coordinates: [number, number] = [props.longitude, props.latitude]

  const mapglAPI = await load()

  mapInstance = new mapglAPI.Map(mapContainer.value, {
    center: coordinates,
    zoom: 15,
    key: props.apiKey,
  })

  markerInstance = new mapglAPI.Marker(mapInstance, {
    coordinates,
  })
}

onMounted(() => {
  initMap()
})

watch(() => [props.latitude, props.longitude], () => {
  initMap()
}, { deep: true })
</script>

<template>
  <div
    ref="mapContainer"
    class="map-container"
  />
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}
</style>
