<script setup lang="ts">
import { DEFAULT_PERMISSIONS_MODULES } from "@core/model/default/policy"
import { ref } from 'vue'
import AddOrganizationDialog from '@/views/add-organization/AddOrganizationDialog.vue'


const props = defineProps<{
  variant: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"
  size: 'small' | 'medium' | 'large'
}>()

const showAddModal = ref(false)

const handleAdd = () => {
  showAddModal.value = false
}
</script>

<template>
  <PermissionButton
    :permission="DEFAULT_PERMISSIONS_MODULES.COMPANY.CAN_ADD_ORGANIZATION"
    color="primary"
    class="mt-2 mt-md-0"
    @click="showAddModal = true"
    :variant="variant"
    :size="size"
  >
    <VIcon
      start
      icon="bx-plus"
      color="secondary"
    />
    Добавить организацию
  </PermissionButton>

  <AddOrganizationDialog
    v-model:modelValue="showAddModal"
    @save="handleAdd"
  />
</template>

