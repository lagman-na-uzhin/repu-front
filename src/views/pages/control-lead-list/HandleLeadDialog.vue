<script setup lang="ts">
import CompanyContactForm from "@/components/forms/CompanyContactForm.vue"
import TariffSelectionForm from "@/components/forms/TariffSelectionForm.vue"
import { nextTick, ref, watch, computed } from 'vue'
import { Lead, useLeadStore } from '@/stores/lead.store'

interface ProcessDialogState {
  isVisible: boolean
  lead: Lead | null
}

const props = defineProps<{
  processDialog: ProcessDialogState
}>()

const emit = defineEmits<{
  (e: 'update:processDialog', value: ProcessDialogState): void
}>()

const leadStore = useLeadStore()

interface FormData {
  companyName: string
  leadName: string
  leadEmail: string
  leadPhone: string
  organizationCountRange: string | null
  features: {
    companyDataSync: boolean
    multiAccess: boolean
    reviewAutoReply: boolean
    analysisReview: boolean
    registerPlacement: boolean
    reviewReply: boolean
    reviewComplaint: boolean
    reviewAutoComplaint: boolean
    analysisByRadius: boolean
    analysisCompetitor: boolean
  }
  finalPrice: number | null
  priceChangeReason: string
  tariffType: string | null
}

const defaultFeatures = () => ({
  companyDataSync: false,
  multiAccess: false,
  reviewAutoReply: false,
  analysisReview: false,
  registerPlacement: false,
  reviewReply: false,
  reviewComplaint: false,
  reviewAutoComplaint: false,
  analysisByRadius: false,
  analysisCompetitor: false,
});

const formData = ref<FormData>({
  companyName: '',
  leadName: '',
  leadEmail: '',
  leadPhone: '',
  organizationCountRange: null,
  features: defaultFeatures(),
  finalPrice: null,
  priceChangeReason: '',
  tariffType: null,
})

const currentStep = ref(0)
const step1FormRef = ref<InstanceType<typeof CompanyContactForm> | null>(null)
const step2FormRef = ref<InstanceType<typeof TariffSelectionForm> | null>(null)

const calculatedPrice = ref(0)
const manualPriceOverride = ref<number | null>(null);

const finalPriceDisplay = computed<number | null>({
  get() {
    return manualPriceOverride.value !== null ? manualPriceOverride.value : calculatedPrice.value;
  },
  set(newValue: number | null) {
    manualPriceOverride.value = newValue;
    formData.value.finalPrice = newValue;
  }
});

async function calculatePrice() {
  if (formData.value.organizationCountRange && formData.value.tariffType) {
    try {
      const price = await leadStore.calculateTariffPrice({
        tariffType: formData.value.tariffType,
        organizationCountRange: formData.value.organizationCountRange,
        features: formData.value.features,
      });
      calculatedPrice.value = price;
      if (manualPriceOverride.value === null) {
        formData.value.finalPrice = price;
      }
    } catch (error) {
      console.error('Error calculating price from store:', error);
      calculatedPrice.value = 0;
      if (manualPriceOverride.value === null) {
        formData.value.finalPrice = 0;
      }
    }
  } else {
    calculatedPrice.value = 0;
    if (manualPriceOverride.value === null) {
      formData.value.finalPrice = null;
    }
  }
}

watch(
  [
    () => formData.value.organizationCountRange,
    () => formData.value.features,
  ],
  calculatePrice,
  { deep: true }
);

watch([calculatedPrice, manualPriceOverride], ([newCalculatedPrice, newManualPriceOverride]) => {
  if (newManualPriceOverride === null || newManualPriceOverride === newCalculatedPrice) {
    formData.value.priceChangeReason = '';
  }
}, { deep: true });


function closeDialogAndReset() {
  formData.value = {
    companyName: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    organizationCountRange: null,
    features: defaultFeatures(),
    finalPrice: null,
    priceChangeReason: '',
    tariffType: null,
  }
  calculatedPrice.value = 0
  manualPriceOverride.value = null;
  currentStep.value = 0

  emit('update:processDialog', { isVisible: false, lead: null })

  nextTick(() => {
    step1FormRef.value?.resetValidation()
    step2FormRef.value?.resetValidation()
  })
}

watch(() => props.processDialog.isVisible, async newVal => {
  if (newVal) {
    if (props.processDialog.lead) {
      formData.value = {
        companyName: props.processDialog.lead.companyName || '',
        leadName: props.processDialog.lead.name || '',
        leadEmail: props.processDialog.lead.email || '',
        leadPhone: props.processDialog.lead.phone || '',
        organizationCountRange: null,
        features: defaultFeatures(),
        finalPrice: null,
        priceChangeReason: '',
        tariffType: null,
      }
    } else {
      formData.value = {
        companyName: '',
        leadName: '',
        leadEmail: '',
        leadPhone: '',
        organizationCountRange: null,
        features: defaultFeatures(),
        finalPrice: null,
        priceChangeReason: '',
        tariffType: null,
      }
    }
    calculatedPrice.value = 0
    manualPriceOverride.value = null;

    currentStep.value = 0
    await nextTick()
    step1FormRef.value?.resetValidation()
    step2FormRef.value?.resetValidation()

    calculatePrice();
  }
})

async function nextStep() {
  if (currentStep.value === 0) {
    const valid = await step1FormRef.value?.validateForm()
    if (valid) {
      currentStep.value = 1
      await nextTick(); // Ensure the next component is mounted before potentially calling its methods
      step2FormRef.value?.ensureInitialTariffSelectionAndPrice(); // Call a method on the child
    }
  }
}

async function saveProcessDialog() {
  const step2Valid = await step2FormRef.value?.validateForm()
  if (!step2Valid) {
    console.warn('Step 2 form validation failed.')
    return
  }

  const selectedTariffId = step2FormRef.value?.selectedTariffCardId;
  if (!selectedTariffId) {
    return;
  }

  formData.value.finalPrice = finalPriceDisplay.value;

  console.log('Данные для сохранения (перед отправкой в store):', {
    leadId: props.processDialog.lead?.id,
    formData: formData.value,
  })

  if (props.processDialog.lead?.id) {
    try {
      await leadStore.confirmLead({
        leadId: props.processDialog.lead.id,
        tariffType: formData.value.tariffType!,
        organizationCountRange: formData.value.organizationCountRange!,
        companyName: formData.value.companyName,
        contactName: formData.value.leadName,
        contactEmail: formData.value.leadEmail,
        contactPhone: formData.value.leadPhone,
        features: formData.value.features,
        finalPrice: formData.value.finalPrice!,
      });
      console.log('Lead confirmed successfully via store action.')
      closeDialogAndReset()
    } catch (error) {
      console.error('Error confirming lead:', error)
    }
  } else {
    console.error('Lead ID is missing, cannot confirm lead.')
  }
}

// Handlers for events emitted by child components
const updateFormData = (field: keyof FormData, value: any) => {
  formData.value[field] = value as any;
};

const updateFeatures = (features: FormData['features']) => {
  formData.value.features = features;
};

const updateTariffType = (tariffType: string | null) => {
  formData.value.tariffType = tariffType;
};

const handleTariffCardSelected = (tariffId: string) => {
  manualPriceOverride.value = null; // Important reset
};


</script>

<template>
  <VDialog
    v-if="processDialog.isVisible"
    v-model="processDialog.isVisible"
    max-width="800"
    persistent
  >
    <VCard>
      <VCardTitle class="headline pl-6 pr-6 pt-6 pb-2 d-flex align-center">
        <VSpacer />
        <VBtn
          icon="bx-x"
          variant="text"
          @click="closeDialogAndReset"
        />
      </VCardTitle>

      <VCardText class="pa-0">
        <VStepper
          v-model="currentStep"
          alt-labels
          hide-actions
          class="elevation-0"
        >
          <VStepperHeader>
            <VStepperItem
              :complete="currentStep > 1"
              :color="currentStep >= 1 ? 'primary' : 'grey'"
              title="Данные Компании и Лида"
              value="1"
            />

            <VDivider :color="currentStep > 1 ? 'primary' : 'grey'" />

            <VStepperItem
              :complete="currentStep > 2"
              :color="currentStep >= 2 ? 'primary' : 'grey'"
              title="Выбор Тарифа"
              value="2"
            />
          </VStepperHeader>
        </VStepper>
      </VCardText>

      <VCardText class="pa-6">
        <VWindow v-model="currentStep">
          <VWindowItem value="1">
            <CompanyContactForm
              ref="step1FormRef"
              :form-data="formData"
              @update:form-data="updateFormData"
            />
          </VWindowItem>

          <VWindowItem value="2">
            <TariffSelectionForm
              ref="step2FormRef"
              :form-data="formData"
              :calculated-price="calculatedPrice"
              :final-price-display="finalPriceDisplay"
              :manual-price-override="manualPriceOverride"
              @update:form-data="updateFormData"
              @update:features="updateFeatures"
              @update:tariff-type="updateTariffType"
              @update:final-price-display="finalPriceDisplay = $event"
              @tariff-card-selected="handleTariffCardSelected"
            />
          </VWindowItem>
        </VWindow>
      </VCardText>

      <VCardActions class="pa-6 pt-0">
        <VBtn
          v-if="currentStep > 0"
          color="secondary"
          variant="text"
          @click="currentStep--"
        >
          Назад
        </VBtn>
        <VSpacer />
        <VBtn
          v-if="currentStep === 0"
          color="primary"
          variant="flat"
          @click="nextStep"
        >
          Далее
        </VBtn>
        <VBtn
          v-else-if="currentStep === 1"
          color="primary"
          variant="flat"
          @click="saveProcessDialog"
        >
          Завершить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

