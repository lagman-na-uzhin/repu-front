<script setup lang="ts">
import { nextTick, watch } from 'vue'

const props = defineProps<{
  roles: { title: string; value: string; props?: object }[]
  roleId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:roleId', payload: string | null): void
  (e: 'show-new-role-dialog'): void
}>()

watch(() => props.roleId, newVal => {
  if (newVal === 'new-role') {
    emit('show-new-role-dialog')
    nextTick(() => {
      emit('update:roleId', null)
    })
  }
})
</script>

<template>
  <VSelect
    :model-value="props.roleId"
    :rules="[(v: string) => !!v || 'Выберите роль']"
    :items="props.roles"
    label="Выберите роль"
    variant="outlined"
    class="mb-4"
    @update:modelValue="value => emit('update:roleId', value)"
  />
</template>
