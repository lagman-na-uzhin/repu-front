<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IPermissions } from '@/shared/contracts/role/permissions'
import type { IRole } from '@/shared/contracts/role/role'

import Step1PersonalData from '@/views/pages/employee-create/Step1PersonalData.vue'
import Step2RoleAndPermissions from '@/views/pages/employee-create/Step2RoleAndPermissions.vue'
import NewRoleDialog from '@/views/pages/employee-create/NewRoleDialog.vue'

const currentStep = ref(1)
const showNewRoleDialog = ref(false)

const step1Data = ref({
  name: '',
  email: '',
  phone: '',
})

const step2Data = ref({
  role: null as string | null,
  isNewRole: false,
})

const newRoleData = ref({
  name: '',
  permissions: [] as IPermissions,
})

const step1FormRef = ref<any>(null)

const availableRoles = ref<IRole[]>([
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

async function nextStep() {
  if (currentStep.value === 1) {
    const { valid } = await step1FormRef.value.validate()
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

function handleSaveNewRole(data: typeof newRoleData.value) {
  newRoleData.value = data
  step2Data.value.isNewRole = true
  showNewRoleDialog.value = false

  // Сохраняем имя новой роли, чтобы оно отобразилось в списке подтверждения
  step2Data.value.role = newRoleData.value.name
}

watch(() => step2Data.value.role, newVal => {
  if (newVal === 'new-role')
    showNewRoleDialog.value = true
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
        v-model:role="step2Data.role"
        :roles="allRoles"
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

  <NewRoleDialog
    v-model="showNewRoleDialog"
    @save="handleSaveNewRole"
  />
</template>
