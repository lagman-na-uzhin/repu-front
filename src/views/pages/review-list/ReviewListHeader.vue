<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

import { getCityName } from '@/utils/city-alias-map'

const props = defineProps({
  compactOrganizations: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:filters'])

const selectedGroup = ref(null)
const selectedCity = ref(null)
const selectedOrganization = ref(null)

const filteredGroups = computed(() => {
  if (!props.compactOrganizations || props.compactOrganizations.length === 0)
    return []

  const uniqueGroupIds = new Set(
    props.compactOrganizations
      .map(org => org.groupId)
      .filter(id => !!id),
  )

  const filtered = Array.from(uniqueGroupIds).map(id => ({ id, name: id }))

  filtered.push({ id: null, name: 'Все' })

  return filtered
})

const filteredOrganizations = computed(() => {
  if (!props.compactOrganizations || props.compactOrganizations.length === 0)
    return []

  let organizationsToFilter = props.compactOrganizations
  if (selectedGroup.value)
    organizationsToFilter = organizationsToFilter.filter(org => org.groupId === selectedGroup.value)

  if (selectedCity.value)
    organizationsToFilter = organizationsToFilter.filter(org => org.address.city === selectedCity.value)

  if (!organizationsToFilter.find(i => i.id === null)) {
    organizationsToFilter.push({ id: null, name: 'Все' })
  }

  console.log(organizationsToFilter, "organizationsToFilter")
  return organizationsToFilter
})

const filteredCities = computed(() => {
  if (!props.compactOrganizations || !Array.isArray(props.compactOrganizations) || props.compactOrganizations.length === 0)
    return []

  const citiesSet = new Set(
    props.compactOrganizations
      .filter(org => org.address)
      .map(org => org.address.city)
  );

  const citiesMap = new Map()

  citiesSet.forEach(alias => {
    if (alias) {
      citiesMap.set(alias, {
        value: alias,
        name: getCityName(alias),
      })
    }
  })

  const citiesArray = Array.from(citiesMap.values())

  citiesArray.unshift({ value: null, name: 'Все' })

  console.log(citiesArray, "citiesArray")
  return citiesArray
})

watch([selectedGroup, selectedCity, selectedOrganization], () => {
  emit('update:filters', {
    selectedGroup: selectedGroup.value,
    selectedCity: selectedCity.value,
    selectedOrganization: selectedOrganization.value,
  })
}, { deep: true })
</script>

<template>
  <div>
    <VRow align="center">
      <VCol
        xl="4"
        md="4"
        sm="12"
        class="text-h5 font-weight-bold"
      >
        Отзывы
      </VCol>

      <VCol
        xl="8"
        md="8"
        sm="12"
        class="d-flex flex-wrap justify-end align-center"
      >
        <VCol
          cols="12"
          sm="4"
          md="4"
          lg="4"
          class="pa-1"
        >
          <VSelect
            v-model="selectedGroup"
            :items="filteredGroups"
            item-value="id"
            item-title="name"
            variant="outlined"
            hide-details
            clearable
            density="comfortable"
          />
        </VCol>

        <VCol
          cols="12"
          sm="4"
          md="4"
          lg="4"
          class="pa-1"
        >
          <VSelect
            v-model="selectedCity"
            :items="filteredCities"
            variant="outlined"
            item-value="value"
            item-title="name"
            hide-details
            clearable
            density="comfortable"
          />
        </VCol>

        <VCol
          cols="12"
          sm="4"
          md="4"
          lg="4"
          class="pa-1"
        >
          <VSelect
            v-model="selectedOrganization"
            :items="filteredOrganizations"
            item-value="id"
            item-title="name"
            variant="outlined"
            hide-details
            clearable
            density="comfortable"
          />
        </VCol>
      </VCol>
    </VRow>
  </div>
</template>
