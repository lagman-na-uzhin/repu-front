<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ICreateEmployeeRole } from '@/shared/api/role/dto/request.contracts'
import { API } from '@/shared/api'
import type { IRole } from '@/shared/contracts/role/role'

import Step1PersonalData from '@/views/pages/employee-create/Step1PersonalData.vue'
import Step2RoleAndPermissions from '@/views/pages/employee-create/Step2RoleAndPermissions.vue'
import NewRoleDialog from '@/views/pages/employee-create/NewRoleDialog.vue'

interface IStep1Data {
  name: string
  email: string
  phone: string
}

// 💡 Исправлено: Добавили isNewRole, чтобы четко отслеживать состояние
interface IStep2Data {
  roleId: string | null
  isNewRole: boolean
}

// 💡 Исправлено: Используем дискриминирующее объединение для финальных данных
interface IEmployeeFormData {
  name: string
  email: string
  phone: string
  roleId?: string
  role?: ICreateEmployeeRole
}

const props = defineProps<{
  roles: IRole[]
}>()

const emit = defineEmits<{
  (e: 'submit', payload: IEmployeeFormData): void
}>()

const currentStep = ref(1)
const showNewRoleDialog = ref(false)

const step1Data = ref<IStep1Data>({
  name: '',
  email: '',
  phone: '',
})

const step2Data = ref<IStep2Data>({
  roleId: null,
  isNewRole: false,
})

const newRoleData = ref<ICreateEmployeeRole | null>(null)

const step1FormRef = ref<any>(null)

const allRoles = ref([
  ...props.roles.map(r => ({ title: r.name, value: r.id })),
  {
    title: 'Добавить новую роль',
    value: 'new-role',
    props: {
      prependIcon: 'bx-plus',
      class: 'add-new-role-item',
    },
  },
])

async function nextStep() {
  if (currentStep.value === 1) {
    const { valid } = await step1FormRef.value.validate()
    if (valid)
      currentStep.value++
  } else if (currentStep.value === 2) {
    if (!step2Data.value.roleId && !step2Data.value.isNewRole) {
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
  let finalData: IEmployeeFormData
  if (step2Data.value.isNewRole && newRoleData.value) {
    finalData = {
      ...step1Data.value,
      role: newRoleData.value,
    }
  } else {
    finalData = {
      ...step1Data.value,
      roleId: step2Data.value.roleId as string,
    }
  }

  emit('submit', finalData)
}

async function handleSaveNewRole(data: ICreateEmployeeRole) {
  showNewRoleDialog.value = false
  newRoleData.value = data
  step2Data.value.isNewRole = true
  step2Data.value.roleId = 'new-role-created' // Устанавливаем уникальный идентификатор для созданной роли

  // 💡 Добавляем новую роль в список выбора, чтобы она отображалась
  allRoles.value.unshift({
    title: data.name,
    value: 'new-role-created',
  });
}

// 💡 Исправлено: Отслеживаем изменение roleId, чтобы открыть диалог
watch(() => step2Data.value.roleId, newVal => {
  if (newVal === 'new-role') {
    showNewRoleDialog.value = true
  }
})

// 💡 Отслеживаем, когда новая роль создана, чтобы выбрать ее в селекте
watch(() => newRoleData.value, newVal => {
  if(newVal) {
    step2Data.value.roleId = 'new-role-created';
  }
})
</script>

<template>
  <VContainer>
    <VCard class="mb-4">
      <VStepper
        v-model="currentStep"
        style="background-color: transparent"
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

    <VCard
      v-show="currentStep === 1"
      class="pa-4"
    >
      <Step1PersonalData
        ref="step1FormRef"
        v-model:data="step1Data"
      />
    </VCard>

    <VCard
      v-show="currentStep === 2"
      class="pa-4"
    >
      <Step2RoleAndPermissions
        v-model:role-id="step2Data.roleId"
        :roles="allRoles"
        @show-new-role-dialog="() => showNewRoleDialog = true"
      />
    </VCard>

    <VCard
      v-show="currentStep === 3"
      class="pa-4"
    >
      <VList lines="one">
        <VListItem :title="`Имя: ${step1Data.name}`" />
        <VListItem :title="`Email: ${step1Data.email}`" />
        <VListItem :title="`Телефон: ${step1Data.phone}`" />
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

  <NewRoleDialog
    v-model="showNewRoleDialog"
    @save="handleSaveNewRole"
  />
</template>
