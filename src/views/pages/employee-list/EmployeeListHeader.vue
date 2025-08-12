<script setup lang="ts">
import { ROUTES } from "@/plugins/router/routes"

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
    <VBtn @click="handleOpenCreateEmployeeForm" size="small" variant="outlined">Добавить сотрудника</VBtn>
  </div>
</template>
<script setup lang="ts">
</script>
