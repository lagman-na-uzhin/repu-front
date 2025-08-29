<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTES } from '@/plugins/router/routes'
import { API } from '@/shared/api'
import type { IEmployeeCreateFormData } from '@/shared/api/employee/dto/create-employee-form-data'
import type { IRole } from '@/shared/contracts/role/role'
import EmployeeCreateHeader from '@/views/pages/employee-create/EmployeeCreateHeader.vue'
import EmployeeMultiStepForm from '@/views/pages/employee-create/EmployeeMultiStepForm.vue'

const router = useRouter()

const isLoading = ref(null)
const roles = ref<IRole[]>([])

const handleFormSubmission = async (formData: IEmployeeCreateFormData) => {
  console.log('Final form data received in parent:', formData)

  const { success } = await API.EMPLOYEE.create(formData)
  if (success)
    router.push(ROUTES.EMPLOYEE_LIST)
}

const fetchRoles = async () => {
  console.log('fetch roles')
  isLoading.value = true

  const { success, data } = await API.ROLE.getRoles()
  if (success)
    roles.value = data

  isLoading.value = false
}

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <EmployeeCreateHeader />
  <EmployeeMultiStepForm
    v-if="!isLoading"
    :roles="roles"
    @submit="handleFormSubmission"
  />
  <VProgressCircular
    v-else
    indeterminate
    color="primary"
    class="d-flex justify-center mt-16"
  />
</template>
