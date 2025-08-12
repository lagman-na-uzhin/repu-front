<script setup lang="ts">
import { ref } from 'vue'
import AddOrganizationDialog from '@/views/add-organization/AddOrganizationDialog.vue'


const props = defineProps<{
  variant: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"
}>()

const showAddModal = ref(false)

const handleAdd = () => {
  showAddModal.value = false
}
</script>

<template>
  <VBtn
    color="primary"
    class="mt-2 mt-md-0"
    @click="showAddModal = true"
    :variant="variant"
  >
    <VIcon
      start
      icon="bx-plus"
      color="secondary"
    />
    Добавить организацию
  </VBtn>

  <AddOrganizationDialog
    v-model:modelValue="showAddModal"
    @save="handleAdd"
  />
</template>

