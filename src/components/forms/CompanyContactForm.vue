<script setup lang="ts">
import { ref, watch } from 'vue'

interface FormData {
  companyName: string
  leadName: string
  leadEmail: string
  leadPhone: string
}

const props = defineProps<{
  formData: FormData
}>()

const emit = defineEmits<{
  (e: 'update:formData', field: keyof FormData, value: any): void
}>()

const form = ref<any>(null)

// Internal reactive properties for form fields
const companyName = ref(props.formData.companyName);
const leadName = ref(props.formData.leadName);
const leadEmail = ref(props.formData.leadEmail);
const leadPhone = ref(props.formData.leadPhone);

// Watch internal refs and emit updates to parent
watch(companyName, (newVal) => emit('update:formData', 'companyName', newVal));
watch(leadName, (newVal) => emit('update:formData', 'leadName', newVal));
watch(leadEmail, (newVal) => emit('update:formData', 'leadEmail', newVal));
watch(leadPhone, (newVal) => emit('update:formData', 'leadPhone', newVal));

// Watch parent prop changes to update internal refs
watch(() => props.formData.companyName, (newVal) => companyName.value = newVal);
watch(() => props.formData.leadName, (newVal) => leadName.value = newVal);
watch(() => props.formData.leadEmail, (newVal) => leadEmail.value = newVal);
watch(() => props.formData.leadPhone, (newVal) => leadPhone.value = newVal);


async function validateForm() {
  if (form.value) {
    const { valid } = await form.value.validate();
    return valid;
  }
  return false;
}

function resetValidation() {
  form.value?.resetValidation();
}

// Expose functions for parent to call
defineExpose({
  validateForm,
  resetValidation
})
</script>

<template>
  <h3 class="mb-4 mt-4">
    Данные Компании и Лида
  </h3>
  <VForm ref="form">
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="companyName"
          label="Название компании"
          class="mb-4"
          :rules="[v => !!v || 'Название компании обязательно']"
        />
        <VTextField
          v-model="leadName"
          label="Имя контактного лица"
          class="mb-4"
          :rules="[v => !!v || 'Имя контактного лица обязательно']"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="leadEmail"
          label="Email контактного лица"
          class="mb-4"
          :rules="[v => !!v || 'Email контактного лица обязателен', v => /.+@.+\..+/.test(v) || 'Некорректный email']"
        />
        <VTextField
          v-model="leadPhone"
          label="Номер телефона контактного лица"
          class="mb-4"
          :rules="[v => !!v || 'Номер телефона обязателен', v => /^\+?[0-9\s-()]{7,25}$/.test(v) || 'Некорректный номер телефона']"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
