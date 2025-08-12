<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

interface NavLink {
  title: string
  to: string
  icon?: string
}

interface NavGroup {
  title: string
  icon?: string
  children: NavLink[]
}

const authStore = useAuthStore()

const isAdmin = true

const regularNavGroups = [
  { title: 'Главная', to: '/dashboard', icon: 'bx-home-circle' },
  { title: 'О Компании', to: '/company', icon: 'bx-buildings' },
  { title: 'Мои Организаций', to: '/organizations', icon: 'bx-store' },
  { title: 'Отзывы', to: '/reviews', icon: 'bx-comment-detail' },
  { title: 'Шаблоны ответов', to: '/templates/reply', icon: 'bx-message-dots' },
  { title: 'Cотрудники', to: '/employees', icon: 'bx-group' },
]

const adminNavGroups = [
  { title: 'Главная', to: '/control/dashboard', icon: 'bx-dashboard' },
  { title: 'Компании', icon: 'bx-briefcase' },
  { title: 'Лиды', icon: 'bx-contact' },
]
</script>

<template>
  <VList  style="background-color: transparent !important;" :nav="true" density="compact" class="pa-0">
    <template v-if="!isAdmin">
      <template
        v-for="group in adminNavGroups"
        :key="group.title"
      >
        <VerticalNavLink
          class="pt-2 pb-2 pr-2 text-h5"
          :item="{ title: group.title, to: group.to, icon: group.icon }"
        />
      </template>
    </template>

    <template
      v-for="group in regularNavGroups"
      v-else
    >
      <VerticalNavLink
        class="pa-3 text-subtitle-1 cursor-pointer"
        :item="{ title: group.title, to: group.to, icon: group.icon }"
      />
    </template>
  </VList>
</template>
