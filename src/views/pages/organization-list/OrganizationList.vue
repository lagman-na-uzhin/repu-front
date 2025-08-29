<script setup lang="ts">
import { ROUTES } from "@/plugins/router/routes"
import { useOrganizationStore } from "@/stores/organization.store"
import { defineEmits, defineProps, ref, watchEffect } from 'vue' // Добавлены defineProps и defineEmits
import OrganizationEditForm from '@/views/pages/edit-organization/OrganizationEditForm.vue'

// --- Props ---
const props = defineProps({
  organizations: {
    type: Array,
    required: true,
  },
  totalRows: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  isPreloader: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(
  [
    'update:currentPage',
    'update:itemsPerPage',
    'fetchOrganizations',
    'editOrganization',
  ])

const router = useRouter()

const currentLocalPage = ref(props.currentPage)
const localItemsPerPage = ref(props.itemsPerPage)

watchEffect(() => {
  currentLocalPage.value = props.currentPage
  localItemsPerPage.value = props.itemsPerPage
})

const updateCurrentPage = (val: number) => {
  currentLocalPage.value = val
  emit('update:currentPage', val)
  emit('fetchOrganizations')
}

const updateItemsPerPage = (val: number) => {
  localItemsPerPage.value = val
  emit('update:itemsPerPage', val)
  emit('fetchOrganizations')
}

const handleEditOrganization = (organization: any) => {
  useOrganizationStore().organizationForEdit = organization

  router.push(ROUTES.ORGANIZATION_EDIT(organization.id))
}
const handleAnalyticsOrganization = (organizationId: string) => {
  router.push(ROUTES.ORGANIZATION_ANALYTICS(organizationId))
}
const handleEditDialogClose = () => {
  editOrganizationId.value = null
}
</script>

<template>
  <VCol
    v-for="org in props.organizations"
    :key="org.id"
    cols="12"
    class="pa-0 pb-2"
  >
    <OrganizationCard
      :organization="org"
      @edit-organization="handleEditOrganization"
      @analytycs-organization="handleAnalyticsOrganization"
    />
    <OrganizationEditForm
      v-if="editOrganizationId === org.id"
      :organization="org"
      @close="handleEditDialogClose"
    />
  </VCol>

  <BasePreloader v-if="props.isPreloader" />
  <NotFoundMessage
    v-else-if="props.organizations.length === 0"
    class="ma-10"
    message="Организации не найдены."
  />
  <PaginationControl
    v-model="currentLocalPage"
    :page-count="props.totalPages"
    :items-per-page="localItemsPerPage"
    class="pb-2 pt-2"
    @update:model-value="updateCurrentPage"
    @update:items-per-page="updateItemsPerPage"
  />
</template>
