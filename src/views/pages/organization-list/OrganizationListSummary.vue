<template>
  <VRow>
    <VCol cols="12" md="6">
      <VCard
        class="pa-2 d-flex flex-column align-center justify-center text-center total-card text-white"
        elevation="2"
      >
        <VCardTitle class="text-h3 font-weight-bold">{{ total }}</VCardTitle>
        <VCardSubtitle class="font-weight-bold">Всего</VCardSubtitle>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard
        class="pa-2 d-flex flex-column align-center justify-center text-center active-card"
        elevation="2"
      >
        <VCardTitle class="text-h3 font-weight-bold">{{ active }}</VCardTitle>
        <VCardSubtitle class="font-weight-bold">Активные</VCardSubtitle>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
defineProps<{
  total: number
  active: number
}>()
</script>

<style scoped lang="scss">
</style>
