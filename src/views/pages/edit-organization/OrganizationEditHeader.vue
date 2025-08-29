<script setup lang="ts">

import { useOrganizationStore } from "@/stores/organization.store"

const router = useRouter()

const prevStep = () => {
  router.back()
  useOrganizationStore().organizationForEdit = null
}
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <VBtn
      color="secondary"
      variant="text"
      @click="prevStep"
      class="pa-0"
    >
      <VIcon
        start
        icon="bx-arrow-back"
      />
      Организации
    </VBtn>


    <VBtn
      color="primary"
      @click="saveChanges"
      variant="outlined"
      size="small"
    >
      Применить для группы
    </VBtn>
  </div>
</template>
