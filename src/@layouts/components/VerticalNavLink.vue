<script lang="ts" setup>
import type { NavLink } from '@layouts/types'

defineProps<{
  item: NavLink
}>()
</script>

<template>
  <li
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      :to="item.to"
      :href="item.href"
      :target="item.target"
    >
      <VIcon
        color="secondary"
        :icon="item.icon || 'bxs-circle'"
        class="nav-item-icon mr-2"
      />
      <!-- 👉 Title -->
      <span class="nav-item-title text-body-1">
        {{ item.title }}
      </span>
      <span
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        {{ item.badgeContent }}
      </span>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-item-title {
    font-size: 12px;
  }
  .nav-link a {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
