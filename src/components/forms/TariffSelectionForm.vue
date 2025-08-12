<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Features {
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

interface FormData {
  organizationCountRange: string | null
  features: Features
  finalPrice: number | null // This prop will be bound to finalPriceDisplay in parent
  priceChangeReason: string
  tariffType: string | null
}

const props = defineProps<{
  formData: FormData
  calculatedPrice: number
  finalPriceDisplay: number | null // This is the computed property from parent
  manualPriceOverride: number | null
}>()

const emit = defineEmits<{
  (e: 'update:formData', field: 'organizationCountRange' | 'priceChangeReason', value: any): void
  (e: 'update:features', features: Features): void
  (e: 'update:tariffType', tariffType: string | null): void
  (e: 'update:finalPriceDisplay', value: number | null): void // To update the computed property's setter
  (e: 'tariff-card-selected', tariffId: string): void // New event for card selection
}>()

const form = ref<any>(null)

const tariffMode = ref<'standard' | 'custom'>('standard')
const selectedTariffCardId = ref<string | null>(null) // Internal state for selected tariff card

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

const tariffs = [
  {
    id: 'BASIC',
    name: 'Basic',
    features: {
      companyDataSync: true,
      multiAccess: false,
      reviewAutoReply: false,
      analysisReview: false,
      registerPlacement: false,
      reviewReply: false,
      reviewComplaint: false,
      reviewAutoComplaint: false,
      analysisByRadius: false,
      analysisCompetitor: false,
    },
    basePrice: 100,
  },
  {
    id: 'PRO',
    name: 'Pro',
    features: {
      companyDataSync: true,
      multiAccess: true,
      reviewAutoReply: true,
      analysisReview: false,
      registerPlacement: false,
      reviewReply: false,
      reviewComplaint: false,
      reviewAutoComplaint: false,
      analysisByRadius: false,
      analysisCompetitor: false,
    },
    basePrice: 250,
  },
  {
    id: 'PRO_PLUS',
    name: 'Pro +',
    features: {
      companyDataSync: true,
      multiAccess: true,
      reviewAutoReply: true,
      analysisReview: true,
      registerPlacement: true,
      reviewReply: true,
      reviewComplaint: true,
      reviewAutoComplaint: true,
      analysisByRadius: true,
      analysisCompetitor: true,
    },
    basePrice: 500,
  },
  {
    id: 'CUSTOM',
    name: 'Кастомный',
    features: defaultFeatures(),
    basePrice: 0,
  }
]

const organizationCountOptions = [
  '1-5',
  '5-10',
  '10-50',
  '50+',
]

const organizationCountRange = ref(props.formData.organizationCountRange);
const priceChangeReason = ref(props.formData.priceChangeReason);

watch(organizationCountRange, (newVal) => emit('update:formData', 'organizationCountRange', newVal));
watch(priceChangeReason, (newVal) => emit('update:formData', 'priceChangeReason', newVal));

watch(() => props.formData.organizationCountRange, (newVal) => organizationCountRange.value = newVal);
watch(() => props.formData.priceChangeReason, (newVal) => priceChangeReason.value = newVal);

const localFeatures = ref<Features>({ ...props.formData.features });

watch(localFeatures, (newVal) => {
  emit('update:features', newVal);
}, { deep: true });

watch(() => props.formData.features, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(localFeatures.value)) {
    localFeatures.value = { ...newVal };
  }
}, { deep: true });


const selectTariffCard = (tariffId: string) => {
  selectedTariffCardId.value = tariffId;
  emit('tariff-card-selected', tariffId); // Notify parent of selection

  if (tariffId === 'CUSTOM') {
    tariffMode.value = 'custom';
    localFeatures.value = defaultFeatures(); // Reset features for custom
    emit('update:tariffType', 'CUSTOM');
  } else {
    tariffMode.value = 'standard';
    const selected = tariffs.find(t => t.id === tariffId);
    if (selected) {
      localFeatures.value = { ...defaultFeatures(), ...selected.features };
      emit('update:tariffType', selected.id);
    }
  }
};

function resetValidation() {
  form.value?.resetValidation();
  selectedTariffCardId.value = null; // Also reset selected tariff visually
  tariffMode.value = 'standard'; // Reset tariff mode
}

async function validateForm() {
  if (form.value) {
    const { valid } = await form.value.validate();
    // Also check if a tariff card is selected
    if (!selectedTariffCardId.value) {
      // You might want to add a visible error message here
      console.warn('Tariff not selected validation failed.');
      return false;
    }
    return valid;
  }
  return false;
}

// Method to ensure initial state of tariff selection and trigger price calculation if needed
const ensureInitialTariffSelectionAndPrice = () => {
  // If a tariffType is already set (e.g., from loaded lead data), select the corresponding card
  if (props.formData.tariffType) {
    selectedTariffCardId.value = props.formData.tariffType;
    if (props.formData.tariffType === 'CUSTOM') {
      tariffMode.value = 'custom';
    } else {
      tariffMode.value = 'standard';
    }
  } else {
    // If no tariffType is set, ensure selectedTariffCardId and tariffMode are default
    selectedTariffCardId.value = null;
    tariffMode.value = 'standard';
  }
};


defineExpose({
  validateForm,
  resetValidation,
  selectedTariffCardId, // Expose for parent to read
  ensureInitialTariffSelectionAndPrice // Expose for parent to call on step activation
})
</script>

<template>
  <h3 class="mb-4 mt-4">
    Шаг 2: Выбор Тарифа
  </h3>
  <VForm ref="form">
    <VSelect
      v-model="organizationCountRange"
      :items="organizationCountOptions"
      label="Количество организаций"
      class="mb-4"
      :rules="[v => !!v || 'Выберите количество организаций']"
    />

    <h4 class="mb-3">
      Выберите тариф:
    </h4>
    <VRow>
      <VCol
        v-for="tariff in tariffs"
        :key="tariff.id"
        cols="12" sm="6" md="3"
      >
        <VCard
          :class="{ 'selected-tariff': selectedTariffCardId === tariff.id }"
          class="tariff-card"
          @click="selectTariffCard(tariff.id)"
        >
          <VCardTitle>{{ tariff.name }}</VCardTitle>
        </VCard>
      </VCol>
    </VRow>
    <div v-if="tariffMode === 'custom'" class="mt-6">
      <h4 class="mb-3">
        Выберите опции для кастомного тарифа:
      </h4>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VCheckbox
            v-model="localFeatures.reviewAutoReply"
            label="Автоответы"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.analysisReview"
            label="Аналитика отзывов"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.registerPlacement"
            label="Размещение в реестре"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.reviewReply"
            label="Ответы на отзывы"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.reviewComplaint"
            label="Жалобы на отзывы"
            density="compact"
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VCheckbox
            v-model="localFeatures.multiAccess"
            label="Мультидоступ"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.companyDataSync"
            label="Синхронизация данных организаций"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.reviewAutoComplaint"
            label="Автоматические жалобы"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.analysisByRadius"
            label="Аналитика по радиусу"
            density="compact"
            hide-details
          />
          <VCheckbox
            v-model="localFeatures.analysisCompetitor"
            label="Аналитика конкурентов"
            density="compact"
            hide-details
          />
        </VCol>
      </VRow>
    </div>

    <VTextField
      v-if="finalPriceDisplay !== null"
      :model-value="finalPriceDisplay"
      @update:model-value="emit('update:finalPriceDisplay', $event)"
      label="Итоговая цена"
      type="number"
      prefix="$"
      class="mt-6"
      :rules="[v => (v !== null && v >= 0) || 'Цена должна быть неотрицательным числом']"
    />

    <VTextField
      v-if="manualPriceOverride !== null && manualPriceOverride !== calculatedPrice"
      v-model="priceChangeReason"
      label="Причина изменения цены"
      class="mt-4"
      :rules="[v => !!v || 'Укажите причину изменения цены']"
    />
  </VForm>
</template>

<style scoped>
.tariff-card {
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-left: 5px solid transparent;
}

.tariff-card.selected-tariff {
  color: white;
  background-color: rgba(var(--v-theme-primary), 0.3); /* Slightly transparent */
}

.tariff-card {
  border-left-color: rgb(var(--v-theme-primary));
}
</style>
