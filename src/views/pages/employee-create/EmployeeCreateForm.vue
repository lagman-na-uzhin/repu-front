<script setup lang="ts">
import { formatPhoneWithoutPrefix } from "@core/utils/formatters"
import { nextTick, onMounted, ref, watch, computed } from 'vue'

import type {
  QSEmployeeRoleDto,
  QSEmployeeRolePermissions,
} from '@/shared/contracts/employee/employee'

const currentStep = ref(1)

const step1Data = ref({
  name: '',
  email: '',
  phone: '',
})

const step2Data = ref({
  role: null,
  isNewRole: false,
})

const newRoleData = ref({
  name: '',
  permissions: [] as QSEmployeeRolePermissions[],
})

const showNewRoleDialog = ref(false)
const step1Form = ref<any>(null)

const availableRoles = ref<QSEmployeeRoleDto[]>([
  { id: '1', name: 'Менеджер', type: 'EMPLOYEE', permissions: [] },
  { id: '2', name: 'Администратор', type: 'OWNER', permissions: [] },
])

const allRoles = ref([
  ...availableRoles.value.map(r => ({ title: r.name, value: r.id })),
  {
    title: 'Добавить новую роль',
    value: 'new-role',
    props: {
      prependIcon: 'bx-plus',
      class: 'add-new-role-item',
    },
  },
])

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

// 💡 Изменение: Теперь это ref, который хранит массив строк для каждого модуля.
const selectedPermissions = ref<{ [key: string]: string[] }>({})

// 💡 Инициализация: Создаём пустые массивы для каждого модуля
onMounted(() => {
  modules.forEach(module => {
    selectedPermissions.value[module] = [];
  });
});

async function nextStep() {
  if (currentStep.value === 1) {
    const { valid } = await step1Form.value.validate()
    if (valid)
      currentStep.value++
  }
  else if (currentStep.value === 2) {
    if (!step2Data.value.role && !step2Data.value.isNewRole) {
      alert('Пожалуйста, выберите или создайте роль.')

      return
    }
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1)
    currentStep.value--
}

function handleSubmit() {
  console.log('Данные формы:', {
    ...step1Data.value,
    role: step2Data.value.isNewRole ? newRoleData.value : step2Data.value.role,
  })
  alert('Форма успешно отправлена!')
}

function saveNewRole() {
  step2Data.value.isNewRole = true
  showNewRoleDialog.value = false
  // Сохраняем имя новой роли в данных
  step2Data.value.role = newRoleData.value.name
}


const formattedPhone = computed({
  get() {
    return formatPhoneWithoutPrefix(step1Data.value.phone)
  },
  set(value: string) {
    step1Data.value.phone = value
  }
})

watch(() => step2Data.value.role, newVal => {
  if (newVal === 'new-role') {
    showNewRoleDialog.value = true
    nextTick(() => {
      step2Data.value.role = null
    })
  }
})

// 💡 Изменение: Обновленная логика для обработки массивов
watch(selectedPermissions, newPerms => {
  newRoleData.value.permissions = Object.entries(newPerms).flatMap(([module, perms]) =>
    // 💡 Проверяем, что perms является массивом перед вызовом .map()
    Array.isArray(perms) ? perms.map(p => ({
      id: '',
      module: module as 'COMPANIES' | 'REVIEWS' | 'ORGANIZATIONS' | 'EMPLOYEES',
      permission: p,
    })) : [],
  )
}, { deep: true })
</script>

<template>
  <VContainer>
      <VCard class="mb-4">
        <VStepper
          style="background-color: transparent"
          v-model="currentStep"
          class="elevation-0"
        >
          <VStepperHeader>
            <VStepperItem
              :value="1"
              title="Личные данные"
              color="primary"
              complete
            />
            <VDivider />
            <VStepperItem
              :value="2"
              title="Роль и права"
              color="primary"
              :complete="currentStep > 2"
            />
            <VDivider />
            <VStepperItem
              :value="3"
              title="Подтверждение"
              color="primary"
              :complete="currentStep > 3"
            />
          </VStepperHeader>
        </VStepper>
      </VCard>

        <VCard class="pa-4" v-show="currentStep === 1">
          <VForm ref="step1Form">
              <VTextField
                v-model="step1Data.name"
                :rules="[(v: string) => !!v || 'Имя обязательно']"
                label="Имя"
                variant="filled"
                class="mb-4"
              />
            <VTextField
              v-model="step1Data.email"
              :rules="[
                (v: string) => !!v || 'Email обязателен',
                (v: string) => /.+@.+\..+/.test(v) || 'Введите корректный email'
              ]"
              label="Email"
              variant="filled"
              class="mb-4"
            />
            <VTextField
              v-model="formattedPhone"
              :rules="[
                  (v: string) => !!v || 'Телефон обязателен',
                ]"
              label="Телефон"
              variant="filled"
              class="mb-4"
              prefix="+7"
              maxlength="14"
            />
          </VForm>
        </VCard>

    <VCard class="pa-4" v-show="currentStep === 2">
          <VSelect
            v-model="step2Data.role"
            :rules="[(v: string) => !!v || 'Выберите роль']"
            :items="allRoles"
            label="Выберите роль"
            variant="outlined"
            class="mb-4"
          />
    </VCard>

    <VCard class="pa-4" v-show="currentStep === 3">
          <VList lines="one">
            <VListItem :title="`Имя: ${step1Data.name}`" />
            <VListItem :title="`Email: ${step1Data.email}`" />
            <VListItem :title="`Телефон: ${step1Data.phone}`" />
            <VListItem :title="`Роль: ${step2Data.isNewRole ? newRoleData.name : step2Data.role}`" />
          </VList>
        </VCard>

      <VCardActions class="mt-4">
        <VBtn
          v-if="currentStep > 1"
          color="secondary"
          variant="outlined"
          @click="prevStep"
        >
          Назад
        </VBtn>
        <VSpacer />
        <VBtn
          v-if="currentStep < 3"
          color="primary"
          variant="flat"
          @click="nextStep"
        >
          Далее
        </VBtn>
        <VBtn
          v-else
          color="success"
          variant="flat"
          @click="handleSubmit"
        >
          Сохранить
        </VBtn>
      </VCardActions>
  </VContainer>

  <VDialog
    v-model="showNewRoleDialog"
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
          @click="showNewRoleDialog = false"
        >
          Отмена
        </VBtn>
        <VBtn
          color="primary"
          variant="flat"
          @click="saveNewRole"
        >
          Сохранить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
