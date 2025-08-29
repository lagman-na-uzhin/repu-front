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

// 💡 Переменные для v-model теперь инициализируются массивами
const groupIds = ref([])
const cities = ref([])
const organizationIds = ref([])

const filteredGroups = computed(() => {
  if (!props.compactOrganizations || props.compactOrganizations.length === 0)
    return []

  const uniqueGroupIds = new Set(
    props.compactOrganizations
      .map(org => org.groupId)
      .filter(id => !!id),
  )

  const filtered = Array.from(uniqueGroupIds).map(id => ({ id, name: id }))
  filtered.unshift({ id: null, name: 'Все' })
  return filtered
})

const filteredOrganizations = computed(() => {
  if (!props.compactOrganizations || props.compactOrganizations.length === 0)
    return []

  let organizationsToFilter = props.compactOrganizations
  if (groupIds.value && groupIds.value.length > 0)
    organizationsToFilter = organizationsToFilter.filter(org => groupIds.value.includes(org.groupId))

  if (cities.value && cities.value.length > 0)
    organizationsToFilter = organizationsToFilter.filter(org => cities.value.includes(org.address.city))

  const finalOrganizations = organizationsToFilter.map(org => ({ id: org.id, name: org.name }))
  finalOrganizations.unshift({ id: null, name: 'Все' })
  return finalOrganizations
})

const filteredCities = computed(() => {
  if (!props.compactOrganizations || !Array.isArray(props.compactOrganizations) || props.compactOrganizations.length === 0)
    return []

  let organizationsToFilter = props.compactOrganizations
  if (groupIds.value && groupIds.value.length > 0)
    organizationsToFilter = organizationsToFilter.filter(org => groupIds.value.includes(org.groupId))

  const citiesSet = new Set(organizationsToFilter.map(org => org.address.city).filter(c => !!c))
  const citiesArray = Array.from(citiesSet).map(c => ({ value: c, name: getCityName(c) }))
  citiesArray.unshift({ value: null, name: 'Все' })
  return citiesArray
})

// 💡 Важно: в watch теперь сравниваем массивы
watch([groupIds, cities, organizationIds], () => {
  // Мы можем передать пустые массивы в API, чтобы сбросить фильтры
  emit('update:filters', {
    groupIds: groupIds.value,
    cities: cities.value,
    organizationIds: organizationIds.value,
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
            v-model="groupIds"
            :items="filteredGroups"
            label="Группа"
            item-value="id"
            item-title="name"
            variant="outlined"
            hide-details
            clearable
            multiple
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
            v-model="cities"
            :items="filteredCities"
            variant="outlined"
            label="Город"
            item-value="value"
            item-title="name"
            hide-details
            clearable
            multiple
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
            v-model="organizationIds"
            :items="filteredOrganizations"
            item-value="id"
            item-title="name"
            label="Организация"
            variant="outlined"
            hide-details
            clearable
            multiple
            density="comfortable"
          />
        </VCol>
      </VCol>
    </VRow>
  </div>
</template>
