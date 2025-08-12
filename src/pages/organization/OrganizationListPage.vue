<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import OrganizationListFilters from '@/views/pages/organizationList/OrganizationListFilters.vue'

import OrganizationListHeader from '@/views/pages/organizationList/OrganizationListHeader.vue'
import OrganizationSummary from '@/views/pages/organizationList/OrganizationListSummary.vue'
import OrganizationList from '@/views/pages/organizationList/OrganizationList.vue'
import AddOrganizationDialog from '@/views/add-organization/AddOrganizationDialog.vue'

import { API } from '@/shared/api'
import { useAuthStore } from '@/stores/auth.store'
import { MODULE_CONTENT, getTableParams } from '@/utils/table-params'

// --- Local State ---
const showAddModal = ref(false)
const organizations = ref([])
const isPreloader = ref(true)
const totalRows = ref(0)
const totalPages = ref(1)

// --- Auth Store & Table Params ---
const user = useAuthStore().user
const moduleName = MODULE_CONTENT.ORGANIZATION_LIST

const initialFilter = { companyId: user?.companyId, isActive: null }
const tableParams = reactive(getTableParams(moduleName, initialFilter))

const fetchOrganizations = async () => {
  isPreloader.value = true
  try {
    console.log(tableParams, 'tableParams')

    const { success, data } = await API.ORGANIZATION.getListByCompany(tableParams)

    if (success) {
      organizations.value = data.list
      totalRows.value = data.total
      totalPages.value = data?.totalPages
    }
    else {
      console.error('Failed to fetch organizations:', data)
      organizations.value = []
      totalRows.value = 0
      totalPages.value = 1
    }
  }
  catch (error) {
    console.error('An error occurred during organization fetch:', error)
    organizations.value = []
    totalRows.value = 0
    totalPages.value = 1
  }
  finally {
    isPreloader.value = false
  }
}

const totalOrganizations = ref(0)
const totalActiveOrganizations = ref(0)

const fetchOrganizationsSummary = async () => {
  isPreloader.value = true
  try {
    console.log(tableParams, 'tableParams')

    const { success, data } = await API.ORGANIZATION.getSummary({ companyId: user?.companyId })

    if (success && data) {
      totalOrganizations.value = data.total
      totalActiveOrganizations.value = data.active
    }
    else {
      console.error('Failed to fetch organizations summary:', data)
    }
  }
  catch (error) {
    console.error('An error occurred during organization fetch:', error)
  }
  finally {
    isPreloader.value = false
  }
}

// --- Watcher ---
// watchEffect теперь является единственным "источником правды" для запуска запроса
watchEffect(() => {
  fetchOrganizations()
  fetchOrganizationsSummary()
})

// --- Handlers for Child Component Emits ---
const handleUpdateCurrentPage = (newPage: number) => {
  // Просто обновляем реактивный объект, watchEffect сделает всё остальное
  tableParams.pagination.currentPage = newPage
}

const handleUpdateItemsPerPage = (newItemsPerPage: number) => {
  // Просто обновляем реактивный объект, watchEffect сделает всё остальное
  tableParams.pagination.perPage = newItemsPerPage
  tableParams.pagination.currentPage = 1
}

const handleFetchOrganizations = () => {
  // Этот метод теперь не нужен, если вы используете watchEffect,
  // или его можно использовать для принудительного обновления,
  // если вы решите не использовать watchEffect
  fetchOrganizations()
}

async function handleAdd(newOrgData: { name: string; category: string }) {
  showAddModal.value = false

  try {
    const { success, data } = await API.ORGANIZATION.add(newOrgData)

    if (success) {
      // После успешного добавления вызываем fetchOrganizations()
      // watchEffect этого не увидит, так как tableParams не изменились
      await fetchOrganizations()
      console.log('Organization added successfully:', data)
    }
    else {
      console.error('Failed to add organization:', data)
    }
  }
  catch (error) {
    console.error('An error occurred during add operation:', error)
  }
}

const handleFilterUpdate = (newFilters: { [key: string]: any }) => {
  // Обновляем фильтры, watchEffect автоматически вызовет fetchOrganizations()
  tableParams.filter = { ...tableParams.filter, ...newFilters }
  tableParams.pagination.page = 1
}

const handleFilterReset = () => {
  // Сбрасываем фильтры, watchEffect автоматически вызовет fetchOrganizations()
  tableParams.filter = { ...initialFilter }
  tableParams.pagination.page = 1
}
</script>

<template>
  <OrganizationListHeader @add-organization="showAddModal = true" />

  <OrganizationSummary
    :total="totalOrganizations"
    :active="totalActiveOrganizations"
  />
  <VRow>
    <VCol
      cols="12"
      sm="12"
      md="5"
      xl="4"
      order-md="2"
      order-xl="2"
    >
      <OrganizationListFilters
        @update:filters="handleFilterUpdate"
        @reset:filters="handleFilterReset"
      />
    </VCol>

    <VCol
      cols="12"
      sm="12"
      md="7"
      xl="8"
      order-md="1"
      order-xl="1"
    >
      <OrganizationList
        :organizations="organizations"
        :total-rows="totalRows"
        :total-pages="totalPages"
        :is-preloader="isPreloader"
        :current-page="tableParams.pagination.currentPage"
        :items-per-page="tableParams.pagination.perPage"
        @update:current-page="handleUpdateCurrentPage"
        @update:items-per-page="handleUpdateItemsPerPage"
        @fetch-organizations="handleFetchOrganizations"
      />
    </VCol>
  </VRow>

  <AddOrganizationDialog
    v-if="showAddModal"
    @close="showAddModal = false"
    @save="handleAdd"
  />
</template>
