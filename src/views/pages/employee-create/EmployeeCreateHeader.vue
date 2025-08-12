<script setup lang="ts">

const router = useRouter()

const prevStep = () => {
  router.back()
}
</script>

<template>
  <VBtn
    color="secondary"
    variant="text"
    @click="prevStep"
  >
    <VIcon
      start
      icon="bx-arrow-back"
    />
      Сотрудники
  </VBtn>
</template>
