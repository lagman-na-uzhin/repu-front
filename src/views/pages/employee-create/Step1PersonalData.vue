<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatPhoneWithoutPrefix } from "@core/utils/formatters"

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:data'])

const form = ref<any>(null)

const localData = computed({
  get: () => props.data,
  set: (value) => emit('update:data', value),
})

const formattedPhone = computed({
  get: () => formatPhoneWithoutPrefix(localData.value.phone),
  set: (value: string) => {
    localData.value.phone = value
  },
})

// expose `form` to the parent component for validation
defineExpose({
  validate: () => form.value.validate(),
})
</script>

<template>
  <VForm ref="form">
    <VTextField
      v-model="localData.name"
      :rules="[(v: string) => !!v || 'Имя обязательно']"
      label="Имя"
      variant="filled"
      class="mb-4"
    />
    <VTextField
      v-model="localData.email"
      :rules="[
        (v: string) => !!v || 'Email обязателен',
        (v: string) => /.+@.+\..+/.test(v) || 'Введите корректный email',
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
</template>
