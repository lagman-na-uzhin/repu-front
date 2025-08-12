<script setup lang="ts">

import { useOrganizationStore } from "@/stores/organization.store"

const router = useRouter()

const prevStep = () => {
  router.back()
  useOrganizationStore().organizationForEdit = null
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
    Организации
  </VBtn>
</template>
