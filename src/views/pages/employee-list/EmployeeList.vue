<script setup lang="ts">
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import type { IEmployee } from '@/shared/contracts/employee'

const props = defineProps<{
  employees: IEmployee[]
  isPreloader: boolean
  totalRows: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:itemsPerPage', items: number): void
  (e: 'fetchEmployees'): void
}>()

const currentLocalPage = ref(props.currentPage)
const localItemsPerPage = ref(props.itemsPerPage)

watchEffect(() => {
  currentLocalPage.value = props.currentPage
  localItemsPerPage.value = props.itemsPerPage
})

const updateCurrentPage = (val: number) => {
  currentLocalPage.value = val
  emit('update:currentPage', val)
  emit('fetchEmployees')
}

const updateItemsPerPage = (val: number) => {
  localItemsPerPage.value = val
  emit('update:itemsPerPage', val)
  emit('fetchEmployees')
}
</script>

<template>
  <VCol
    v-for="employee in employees"
    :key="employee.id"
    cols="12"
    class="pa-0"
  >
    <EmployeeCard
      :employee="employee"
      @edit="() => {}"
    />
  </VCol>

  <BasePreloader v-if="isLoading" />
  <NotFoundMessage
    v-else-if="employees.length === 0"
    class="ma-10"
    message="Организации не найдены."
  />
  <PaginationControl
    v-model="currentLocalPage"
    :page-count="totalPages"
    :items-per-page="localItemsPerPage"
    class="pt-4"
    @update:model-value="updateCurrentPage"
    @update:items-per-page="updateItemsPerPage"
  />
</template>
