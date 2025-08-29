<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatPhoneWithoutPrefix } from "@core/utils/formatters"

// 🆕 Определяем интерфейс для данных
interface IStep1Data {
  name: string
  email: string
  phone: string
}

// 🆕 Используем интерфейс в props
const props = defineProps<{
  data: IStep1Data
}>()

// 🆕 Используем интерфейс в emits
const emit = defineEmits<{
  (e: 'update:data', payload: IStep1Data): void
}>()

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
