<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { API } from '@/shared/api'

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
  if (!newVal)
    emit('update:modelValue', false)
})

const newRoleData = ref({
  name: '',
  permissions: [] as QSEmployeeRolePermissions[],
})

const organizations = ref([])
const organizationPermissions = ref<{ [key: string]: { [key: string]: string[] } }>({})
const activeOrgTab = ref('')
const organizationSearchQuery = ref('')

async function fetchOrganizationForPermissions() {
  const { success, data } = await API.ORGANIZATION.getCompactOrganizations()
  if (data && success) {
    organizations.value = data
    // ✅ Инициализация organizationPermissions и activeOrgTab после загрузки данных
    organizations.value.forEach(org => {
      organizationPermissions.value[org.id] = {}
      modules.forEach(module => {
        organizationPermissions.value[org.id][module] = []
      })
    })
    if (organizations.value.length > 0) {
      activeOrgTab.value = organizations.value[0].id
    }
  }
}

const modulePermissions = {
  COMPANY: [
    { value: 'full_access', name: 'Полный доступ' },
    { value: 'update', name: 'Редактирование' },
  ],
  REVIEW: [
    { value: 'full_access', name: 'Полный доступ' },
    { value: 'read', name: 'Просмотр' },
    { value: 'update', name: 'Редактирование' },
    { value: 'delete', name: 'Удаление' },
  ],
  ORGANIZATION: [
    { value: 'full_access', name: 'Полный доступ' },
    { value: 'can_edit_organization', name: 'Редактирование' },
    { value: 'can_create_organization', name: 'Создание' },
  ],
  EMPLOYEE: [
    { value: 'full_access', name: 'Полный доступ' },
    { value: 'can_create_employee', name: 'Создание сотрудника' },
    { value: 'can_delete_employee', name: 'Удаление сотрудника' },
  ],
  ROLE: [
    { value: 'full_access', name: 'Полный доступ' },
    { value: 'can_create_role', name: 'Создание роли' },
  ],
}

const modules = Object.keys(modulePermissions)

const selectedPermissions = ref<{ [key: string]: string[] }>({})
const fullAccessFlags = ref<{ [key: string]: boolean }>({})

onMounted(() => {
  // ✅ Инициализация non-async переменных
  modules.forEach(module => {
    selectedPermissions.value[module] = []
    fullAccessFlags.value[module] = false
  })
  fetchOrganizationForPermissions()
})

const isAllSelected = computed(() => (module: string) => {
  const allPerms = modulePermissions[module]
    .filter(p => p.value !== 'full_access')
    .map(p => p.value)

  return organizations.value.every(org => {
    const orgPerms = organizationPermissions.value[org.id]?.[module] || []

    return allPerms.length === orgPerms.length && allPerms.every(p => orgPerms.includes(p))
  })
})

const isSaveDisabled = computed(() => !newRoleData.value.name)

const filteredOrganizations = computed(() => {
  if (!organizationSearchQuery.value)
    return organizations.value

  const query = organizationSearchQuery.value.toLowerCase()

  return organizations.value.filter(org =>
    org.name.toLowerCase().includes(query),
  )
})

const handleSave = () => {
  const newSchedules: QSEmployeeRolePermissions[] = []

  Object.keys(modulePermissions).forEach(module => {
    if (fullAccessFlags.value[module]) {
      newSchedules.push({
        id: '',
        module: module as 'COMPANY' | 'REVIEW' | 'ORGANIZATION' | 'EMPLOYEE' | 'ROLE',
        fullAccess: true,
      })
    }
    else if (['ORGANIZATIONS', 'REVIEW'].includes(module)) {
      Object.entries(organizationPermissions.value).forEach(([orgId, permsByModule]) => {
        permsByModule[module]?.forEach(perm => {
          newSchedules.push({
            id: '',
            module: module as 'COMPANY' | 'REVIEW' | 'ORGANIZATION' | 'EMPLOYEE' | 'ROLE',
            permission: perm,
            organizationId: orgId,
          })
        })
      })
    }
    else {
      if (selectedPermissions.value[module]) {
        selectedPermissions.value[module].forEach(permission => {
          if (permission !== 'full_access') {
            newSchedules.push({
              id: '',
              module: module as 'COMPANY' | 'REVIEW' | 'ORGANIZATION' | 'EMPLOYEE' | 'ROLE',
              permission,
            })
          }
        })
      }
    }
  })

  emit('save', {
    name: newRoleData.value.name,
    permissions: newSchedules,
  })

  newRoleData.value = { name: '', permissions: [] }
  Object.keys(selectedPermissions.value).forEach(key => selectedPermissions.value[key] = [])
  Object.keys(fullAccessFlags.value).forEach(key => fullAccessFlags.value[key] = false)
  organizations.value.forEach(org => {
    modules.forEach(module => {
      organizationPermissions.value[org.id][module] = []
    })
  })
}

function hasFullAccess(module: string): boolean {
  return fullAccessFlags.value[module]
}

function toggleFullAccess(module: string) {
  if (fullAccessFlags.value[module])
    selectedPermissions.value[module] = ['full_access']
  else
    selectedPermissions.value[module] = []
}

function selectAllOrganizationsFullAccess(module: string) {
  const allPerms = modulePermissions[module]
    .filter(p => p.value !== 'full_access')
    .map(p => p.value)

  const isSelected = isAllSelected.value(module)

  organizations.value.forEach(org => {
    organizationPermissions.value[org.id][module] = isSelected ? [] : allPerms
  })
}

watch(fullAccessFlags, (newVal, oldVal) => {
  for (const module in newVal) {
    if (newVal[module] !== oldVal[module])
      toggleFullAccess(module)
  }
}, { deep: true })
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
          label="Название роли"
          variant="filled"
          class="mb-4"
        />

        <VDivider class="my-4" />

        <div class="font-weight-medium text-subtitle-1 mb-2">
          Настройка прав доступа
        </div>
        <VExpansionPanels variant="tonal">
          <VExpansionPanel
            v-for="module in modules"
            :key="module"
            rounded="lg"
          >
            <VExpansionPanelTitle class="font-weight-medium text-capitalize py-4">
              Модуль: {{ module.toLowerCase() }}
            </VExpansionPanelTitle>
            <VExpansionPanelText class="pa-4">
              <VCheckbox
                v-model="fullAccessFlags[module]"
                label="Полный доступ"
                :true-value="true"
                :false-value="false"
                class="mb-2"
                density="compact"
                color="primary"
              />
              <template v-if="!hasFullAccess(module)">
                <template v-if="['ORGANIZATION', 'REVIEW'].includes(module)">
                  <div class="mb-4 d-flex align-center">
                    <span class="text-subtitle-2 mr-4">Доступ по организациям:</span>
                    <VBtn
                      color="primary"
                      variant="tonal"
                      size="small"
                      @click="selectAllOrganizationsFullAccess(module)"
                    >
                      <VIcon
                        start
                        icon="bx-check-double"
                      />
                      {{ isAllSelected(module) ? 'Отменить все' : 'Выбрать все' }}
                    </VBtn>
                  </div>
                  <VTextField
                    v-model="organizationSearchQuery"
                    label="Поиск по организациям"
                    variant="outlined"
                    density="compact"
                    class="my-4"
                  />
                  <VTabs
                    v-model="activeOrgTab"
                    fixed-tabs
                  >
                    <VTab
                      v-for="org in filteredOrganizations"
                      :key="org.id"
                      :value="org.id"
                      class="text-caption"
                    >
                      {{ org.name }}
                    </VTab>
                  </VTabs>
                  <VWindow v-model="activeOrgTab">
                    <VWindowItem
                      v-for="org in filteredOrganizations"
                      :key="org.id"
                      :value="org.id"
                    >
                      <VCard class="pa-4 my-2">
                        <VCardTitle class="text-subtitle-1 font-weight-bold mb-2">
                          Права доступа для "{{ org.name }}"
                        </VCardTitle>
                        <VCardText>
                          <VCheckbox
                            v-for="permission in modulePermissions[module].filter(p => p.value !== 'full_access')"
                            :key="permission.value"
                            v-model="organizationPermissions[org.id][module]"
                            :label="permission.name"
                            :value="permission.value"
                            class="ml-2"
                            density="compact"
                            color="primary"
                          />
                        </VCardText>
                      </VCard>
                    </VWindowItem>
                  </VWindow>
                </template>
                <template v-else>
                  <VCheckbox
                    v-for="permission in modulePermissions[module].filter(p => p.value !== 'full_access')"
                    :key="permission.value"
                    v-model="selectedPermissions[module]"
                    :label="permission.name"
                    :value="permission.value"
                    class="mb-2"
                    density="compact"
                    color="primary"
                  />
                </template>
              </template>
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
          :disabled="isSaveDisabled"
          @click="handleSave"
        >
          Сохранить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
