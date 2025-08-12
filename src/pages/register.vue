<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import IMask from 'imask'
import logo from '@images/logo.svg?raw'

const form = ref({
  username: '',
  email: '',
  phone: '',
  companyName: '',
  privacyPolicies: false,
})

const inputRef = ref<HTMLElement | null>(null)
let maskInstance: IMask.InputMask<any> | null = null

onMounted(() => {
  if (inputRef.value) {
    maskInstance = IMask(inputRef.value.$el.querySelector('input') as HTMLInputElement, {
      mask: '+7 (000) 000-00-00',
      lazy: false,
      overwrite: true,
    })

    maskInstance.on('accept', () => {
      form.value.phone = maskInstance?.value || ''
    })
  }
})

watch(() => form.value.phone, newVal => {
  if (maskInstance && maskInstance.value !== newVal)
    maskInstance.value = newVal
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <RouterLink
            to="/"
            class="app-logo"
          >
            <div
              class="d-flex"
              v-html="logo"
            />
            <h1 class="app-logo-title">
              sneat
            </h1>
          </RouterLink>
        </VCardItem>

        <VCardText>
          <h4 class="mb-1 text-high-emphasis text-center">
            Управляйте репутацией уже сегодня 🚀
          </h4>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="$router.push('/')">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  autofocus
                  label="Имя"
                  placeholder="Андрей"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  ref="inputRef"
                  v-model="form.phone"
                  label="Номер"
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  variant="outlined"
                  clearable
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.companyName"
                  label="Название компании"
                  type="text"
                  placeholder="ТОО DEMETRA SYSTEMS"
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center gap-1"
              >
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  density="compact"
                  inline
                  class="pa-0"
                />
                <VLabel
                  for="privacy-policy"
                  style="opacity: 1;"
                >
                  <span class="me-1 text-high-emphasis">Я принимаю</span>
                  <a
                    href="javascript:void(0)"
                    class="text-primary"
                  >политику конфиденциальности и условия</a>
                </VLabel>
              </VCol>

              <VCol>
                <VBtn
                  block
                  type="submit"
                >
                  Зарегистрироваться
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Уже есть аккаунт?</span>
                <RouterLink
                  class="text-primary ms-1"
                  to="/login"
                >
                  Войти
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>
