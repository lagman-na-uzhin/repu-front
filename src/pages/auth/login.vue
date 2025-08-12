<script setup lang="ts">
import { ROUTES } from "@/plugins/router/routes"
import { API } from '@/shared/api'
import { useAuthStore } from '@/stores/auth.store'
import logo from '@images/logo.svg?raw'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url'

const router = useRouter()
const authStore = useAuthStore()

interface ILoginForm {
  email: string
  password: string
}

const form = ref<ILoginForm>({
  email: '',
  password: '',
})

const loading = ref<boolean>(false)

const onSubmit = async () => {
  loading.value = true

  try {
    const { success } = await API.AUTH.login(form.value)

    if (success) {
      await router.push('/dashboard')
    }
  }
  catch (e) {
    form.value = {
      email: '',
      password: '',
    }
  }
  finally {
    loading.value = false
  }
}

const isPasswordVisible = ref(false)
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg
        :src="authV1TopShape"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
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
            <!-- eslint-disable vue/no-v-html -->
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
          <h4 class="text-h4 mb-1">
            Welcome to Sneat! 👋🏻
          </h4>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  autofocus
                  label="Логин"
                  type="email"
                  placeholder="andrey@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Пароль"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <a
                    class="text-primary"
                    href="javascript:void(0)"
                  >
                    Забыли пароль?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="loading"
                >
                  Войти
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  Впервые на нашей платформе?
                </span>
                <RouterLink
                  class="text-primary ms-1 d-inline-block text-body-1"
                  to="/"
                >
                  Зарегистрироваться
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
