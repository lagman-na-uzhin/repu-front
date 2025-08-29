<script setup lang="ts">
import { ROUTES } from '@/plugins/router/routes'
import { DEFAULT_PERMISSIONS_MODULES } from '@core/model/default/policy'

const router = useRouter()

const handleOpenCreateEmployeeForm = () => {
  router.push(ROUTES.EMPLOYEE_CREATE)
}
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-4 flex-wrap">
    <div class="text-h5 font-weight-bold">
      Сотрудники
    </div>
    <PermissionButton
      :permission="DEFAULT_PERMISSIONS_MODULES.EMPLOYEE.CAN_CREATE_EMPLOYEE"
      size="small"
      variant="outlined"
      @click="handleOpenCreateEmployeeForm"
    >
      Добавить сотрудника
    </PermissionButton>
  </div>
</template>
