<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import type {
  QSEmployeeRolePermissions,
} from '@/shared/contracts/employee/employee'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const localShow = ref(props.modelValue)

watch(() => props.modelValue, newVal => {
  localShow.value = newVal
})

watch(localShow, newVal => {
  if (!newVal) {
    emit('update:modelValue', false)
  }
})

const newRoleData = ref({
  name: '',
  permissions: [] as QSEmployeeRolePermissions[],
})

const modules = [
  'COMPANIES',
  'REVIEWS',
  'ORGANIZATIONS',
  'EMPLOYEES',
]

const permissions = [
  { value: 'full_access', name: 'Полный доступ' },
  { value: 'read', name: 'Просмотр' },
  { value: 'create', name: 'Создание' },
  { value: 'update', name: 'Редактирование' },
  { value: 'delete', name: 'Удаление' },
]

const selectedPermissions = ref<{ [key: string]: string[] }>({})

onMounted(() => {
  modules.forEach(module => {
    selectedPermissions.value[module] = []
  })
})

watch(selectedPermissions, newPerms => {
  newRoleData.value.permissions = Object.entries(newPerms).flatMap(([module, perms]) =>
    Array.isArray(perms) ? perms.map(p => ({
      id: '',
      module: module as 'COMPANIES' | 'REVIEWS' | 'ORGANIZATIONS' | 'EMPLOYEES',
      permission: p,
    })) : [],
  )
}, { deep: true })

function handleSave() {
  emit('save', newRoleData.value)
  // Сбрасываем форму диалога после сохранения
  newRoleData.value = { name: '', permissions: [] }
  Object.keys(selectedPermissions.value).forEach(key => selectedPermissions.value[key] = [])
}
</script>

<template>
  <VDialog
    v-model="localShow"
    max-width="800"
  >
    <VCard class="pa-6">
      <VCardTitle class="text-h5 font-weight-bold mb-4">
        Создать новую роль
      </VCardTitle>

      <VCardText>
        <VTextField
          v-model="newRoleData.name"
          label="Название роли (Опционально)"
          variant="filled"
          class="mb-4"
        />

        <VDivider class="my-4" />

        <div class="font-weight-medium text-subtitle-1 mb-2">
          Настройка прав доступа
        </div>
        <VExpansionPanels variant="accordion">
          <VExpansionPanel
            v-for="module in modules"
            :key="module"
          >
            <VExpansionPanelTitle class="font-weight-medium text-capitalize">
              Модуль: {{ module.toLowerCase() }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VCheckbox
                v-for="permission in permissions"
                :key="permission.value"
                v-model="selectedPermissions[module]"
                :label="permission.name"
                :value="permission.value"
                class="mb-2"
              />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>

      <VCardActions class="mt-4">
        <VSpacer />
        <VBtn
          color="secondary"
          variant="outlined"
          @click="localShow = false"
        >
          Отмена
        </VBtn>
        <VBtn
          color="primary"
          variant="flat"
          @click="handleSave"
        >
          Сохранить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
