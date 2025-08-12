<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import LeadCard from '@/views/pages/control-lead-list/LeadCard.vue'
import HandleLeadDialog from '@/views/pages/control-lead-list/HandleLeadDialog.vue' // Проверьте правильность пути
import { useAuthStore } from '@/stores/auth.store' // Проверьте правильность пути
import { type Lead, useLeadStore } from '@/stores/lead.store' // Проверьте правильность пути и импорта типа Lead

// --- Stores ---
const leadsStore = useLeadStore()
const authStore = useAuthStore()

// --- State ---
const currentTab = ref('unassigned') // Вкладка по умолчанию

// --- Computed properties ---
const currentUser = computed(() => authStore.user)
const assignedLeads = computed(() => leadsStore.leads.filter(lead => lead.assignedManagerId !== null))
const unassignedLeads = computed(() => leadsStore.leads.filter(lead => lead.assignedManagerId === null))
const completedLeads = computed(() => leadsStore.leads.filter(lead => lead.assignedManagerId === null))

// --- Process Dialog State and Methods ---
// Определение типа для processDialog (обязательно для TS)
interface ProcessDialogState {
  isVisible: boolean
  lead: Lead | null
}

const processDialog = ref<ProcessDialogState>({
  isVisible: false,
  lead: null,
})

const openProcessDialog = (lead: Lead) => {
  processDialog.value.lead = lead
  processDialog.value.isVisible = true
}

// closeProcessDialog теперь управляется внутренне HandleLeadDialog,
// но это можно оставить, если вам нужно сбросить `lead` на уровне родителя
const closeProcessDialog = () => {
  processDialog.value.isVisible = false
  processDialog.value.lead = null
}

// Метод, который вызывается HandleLeadDialog при завершении формы
interface FormData { // Определение интерфейса FormData, должно совпадать с HandleLeadDialog
  companyName: string
  managerName: string
  managerEmail: string
  managerPhone: string
  organizationCountRange: string | null
  features: {
    autoReplies: boolean
    reviewAnalytics: boolean
    multiAccess: boolean
    dataSync: boolean
  }
  finalPrice: number | null
  priceChangeReason: string
}

const saveProcessedLead = (lead: Lead, data: FormData) => {
  console.log('Лид успешно обработан и готов к сохранению:', lead, data)

  // Здесь вы можете:
  // 1. Отправить `data` и `lead.id` на ваш API для создания компании/обновления лида
  // 2. Обновить состояние в вашем Pinia store
  // Например: leadsStore.updateLeadDetails(lead.id, data);
  // После успешной обработки, диалог будет закрыт HandleLeadDialog
}

// --- Manager Assignment Handler ---
const handleAssignManager = async (payload: { leadId: string; managerId: string | null; managerName: string | null }) => {
  await leadsStore.assignManager(payload.leadId, payload.managerId, payload.managerName)
}

// --- Lifecycle Hook ---
onMounted(() => {
  leadsStore.fetchLeads()
})
</script>

<template>
  <VTabs
    v-model="currentTab"
    class="mb-4 d-flex align-center"
  >
    <VTab value="unassigned">
      Неназначенные ({{ unassignedLeads.length }})
    </VTab>
    <VTab value="assigned">
      Назначенные ({{ assignedLeads.length }})
    </VTab>
    <VTab value="completed">
      Обработанные ({{ completedLeads.length }})
    </VTab>
  </VTabs>

  <VWindow v-model="currentTab">
    <VWindowItem value="assigned">
      <VRow>
        <VCol
          v-for="lead in assignedLeads"
          :key="lead.id"
          cols="12"
          md="4"
          lg="3"
          sm="6"
        >
          <LeadCard
            :lead="lead"
            @assign-manager="handleAssignManager"
            @process-lead="openProcessDialog"
          />
        </VCol>
        <VCol
          v-if="assignedLeads.length === 0"
          cols="12"
          md="4"
          lg="3"
          sm="6"
        >
          <VCard class="pa-4 text-center">
            <VCardTitle>Нет назначенных лидов</VCardTitle>
            <VCardText>Здесь появятся лиды, которым назначен менеджер.</VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>

    <VWindowItem value="unassigned">
      <VRow>
        <VCol
          v-for="lead in unassignedLeads"
          :key="lead.id"
          md="4"
          lg="3"
          sm="6"
        >
          <LeadCard
            :lead="lead"
            @assign-manager="handleAssignManager"
            @process-lead="openProcessDialog"
          />
        </VCol>
        <VCol
          v-if="unassignedLeads.length === 0"
          cols="12"
        >
          <VCard class="pa-4 text-center">
            <VCardTitle>Нет неназначенных лидов</VCardTitle>
            <VCardText>Все лиды назначены или пока нет новых.</VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>

    <VWindowItem value="completed">
      <VRow>
        <VCol
          v-for="lead in assignedLeads"
          :key="lead.id"
          cols="12"
          md="4"
          lg="3"
          sm="6"
        >
          <LeadCard
            :lead="lead"
            @assign-manager="handleAssignManager"
            @process-lead="openProcessDialog"
          />
        </VCol>
        <VCol
          v-if="assignedLeads.length === 0"
          cols="12"
          md="4"
          lg="3"
          sm="6"
        >
          <VCard class="pa-4 text-center">
            <VCardTitle>Нет назначенных лидов</VCardTitle>
            <VCardText>Здесь появятся лиды, которым назначен менеджер.</VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>

  <HandleLeadDialog
    v-model:process-dialog="processDialog"
  />
</template>

<style scoped>
/* Добавьте стили, если необходимо */
</style>
