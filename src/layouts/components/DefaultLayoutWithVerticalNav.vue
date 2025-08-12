<script lang="ts" setup>
import NavItems from '@/layouts/components/NavItems.vue'
import SupportProfile from '@/components/navbar/SupportProfile.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCompanyStore } from '@/stores/company.store'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'

import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

const companyManager = ref()

const authStore = useAuthStore()
const companyStore = useCompanyStore()

onMounted(async () => {
  companyManager.value = await companyStore.fetchCompanyManager()
})
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex align-center pa-0 ma-0 w-100">
        <RouterLink
          to="/"
          class="app-logo app-title-wrapper"
        >
          <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle style="fill: #696CFF;" class="circle" cx="20" cy="20" r="16"/>
            <text style="font: bold 24px sans-serif; fill: #696CFF;" class="text" x="45" y="28">Repu360</text>
          </svg>

        </RouterLink>

        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <NavbarThemeSwitcher class="me-1" />
        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="bx-x" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <div class="d-flex flex-column">
        <div class="pt-5">
          <NavItems />
        </div>

        <div
          v-if="!authStore.isAdmin && companyManager"
        >
          <SupportProfile class="mt-10" :manager="companyManager" />
        </div>
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
