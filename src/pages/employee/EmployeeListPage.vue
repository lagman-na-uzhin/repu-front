<script setup lang="ts">
import EmployeeListFilters from "@/views/pages/employee-list/EmployeeListFilters.vue"
import { ref, watchEffect } from 'vue'
import EmployeeListHeader from '@/views/pages/employee-list/EmployeeListHeader.vue'
import type { IEmployee } from '@/shared/contracts/employee'
import { useAuthStore } from '@/stores/auth.store'
import { API } from '@/shared/api'
import EmployeeList from '@/views/pages/employee-list/EmployeeList.vue'

import { MODULE_CONTENT, getTableParams } from '@/utils/table-params'

const authStore = useAuthStore()
const companyId = ref(authStore.user?.companyId)
const isPreloader = ref(true)
const totalRows = ref(0)
const totalPages = ref(1)

const initialFilters = {
  companyId: companyId.value,
}

const currentTableParams = ref(getTableParams(MODULE_CONTENT.EMPLOYEE_LIST, initialFilters))

const employees = ref<IEmployee[]>([])

const fetchEmployees = async () => {
  isPreloader.value = true

  try {
    const { success, data } = await API.EMPLOYEE.getList(currentTableParams.value)

    if (success)
      employees.value = data.list
    totalRows.value = data.total
    totalPages.value = data?.totalPages
  }
  catch (error) {
    console.error('An error occurred during fetch:', error)
    employees.value = []
    totalRows.value = 0
    totalPages.value = 1
  }
  finally {
    isPreloader.value = false
  }
}

const handleUpdateCurrentPage = (newPage: number) => {
  tableParams.pagination.currentPage = newPage
}

const handleUpdateItemsPerPage = (newItemsPerPage: number) => {
  tableParams.pagination.perPage = newItemsPerPage
  tableParams.pagination.currentPage = 1
}

const handleFetchEmployees = () => {
  fetchEmployees()
}

watchEffect(() => {
  fetchEmployees()
})

onMounted(() => {
  fetchEmployees()
})
</script>

<template>
  <EmployeeListHeader/>
  <VRow>
    <VCol
      cols="12"
      sm="12"
      md="5"
      xl="3"
      order-md="2"
      order-xl="2"
    >
      <EmployeeListFilters/>
    </VCol>

    <VCol
      cols="12"
      sm="12"
      md="7"
      xl="9"
      order-md="1"
      order-xl="1"
    >
      <EmployeeList
        :employees="employees"
        :total-rows="totalRows"
        :total-pages="totalPages"
        :is-preloader="isPreloader"
        :current-page="currentTableParams.pagination.currentPage"
        :items-per-page="currentTableParams.pagination.perPage"
        @update:current-page="handleUpdateCurrentPage"
        @update:items-per-page="handleUpdateItemsPerPage"
        @fetch-employees="handleFetchEmployees"
      />
    </VCol>
  </VRow>
</template>
