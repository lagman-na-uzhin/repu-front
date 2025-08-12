<script  setup lang="ts">
import { computed } from 'vue'
import { useOrganizationStore } from "@/stores/organization.store.js"
import OrganizationEditHeader from "@/views/pages/edit-organization/OrganizationEditHeader.vue"
import OrganizationEditForm from "@/views/pages/edit-organization/OrganizationEditForm.vue"

const organizationStore = useOrganizationStore()
const organization = computed(() => organizationStore?.organizationForEdit)
</script>

<template>
  <OrganizationEditHeader />

  <VContainer>
    <OrganizationEditForm
      v-if="organization"
      :organization="organization"
      @add-placement="() => {}"
      @deactivate="() => {}"
      @edit-schedule="() => {}"
    />

    <NotFoundMessage
      v-else
      message="Не нашли организацию"
    />
  </VContainer>
</template>
