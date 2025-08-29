<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

interface Props {
  permission: {module: string, permission: string}
  size?: string
  variant?: string
}

const props = defineProps<Props>()
const user = useAuthStore().user

const hasPermission = computed(() => {
  if (!user)
    return false

  return !!user.role.permissions?.find(
    p => p.module === props.permission.module && p.permission === props.permission.permission,
  )
})
</script>

<template>
  <VBtn
    :disabled="!true"
    :size="props.size"
    :variant="props.variant"
    v-bind="$attrs"
  >
    <slot />
  </VBtn>
</template>
