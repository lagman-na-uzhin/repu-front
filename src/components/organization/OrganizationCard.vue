<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  organization: {
    id: string
    name: string
    address: string
    isTemporarilyClosed: boolean
    placements: { rating: number }[]
  }
}>()

const overallRating = computed(() => {
  if (!props.organization.placements || props.organization.placements.length === 0)
    return 0

  const sum = props.organization.placements.reduce((acc, placement) => acc + placement.rating, 0)

  return (sum / props.organization.placements.length).toFixed(1)
})
</script>

<template>
  <VCard class="organization-card">
    <VCardText>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-2">
          <span class="text-h6 font-weight-bold">{{ organization.name }}</span>
          <span class="text-body-1 text-medium-emphasis">( {{ organization.address.address }} )</span>
          <VSpacer />
          <VBtn
            icon="bx-edit"
            variant="text"
            size="small"
            color="secondary"
            @click.stop="$emit('edit-organization', organization)"
          />
          <VBtn
            icon="bx-line-chart"
            variant="text"
            size="small"
            color="secondary"
            @click.stop="$emit('analytycs-organization', organization.id)"
          />
        </div>
        <div class="d-flex align-center">
          <div class="d-flex align-center ga-1">
            <span class="text-body-1 font-weight-bold">{{ overallRating }}</span>
            <VRating
              v-model="overallRating"
              density="compact"
              half-increments
              readonly
              size="small"
            />
          </div>
        </div>
        <VChip
          v-if="organization.isTemporarilyClosed"
          class="mt-1"
          color="red"
          size="small"
        >
          Временно закрыта
        </VChip>
        <VDivider class="mt-2" />
      </div>
    </VCardText>
  </VCard>
</template>
