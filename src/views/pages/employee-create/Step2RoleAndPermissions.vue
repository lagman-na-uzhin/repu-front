<script setup lang="ts">
import { nextTick, watch } from 'vue'

const props = defineProps({
  roles: {
    type: Array,
    required: true,
  },
  role: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:role', 'show-new-role-dialog'])

watch(() => props.role, newVal => {
  if (newVal === 'new-role') {
    emit('show-new-role-dialog')
    nextTick(() => {
      emit('update:role', null)
    })
  }
})
</script>

<template>
  <VSelect
    :model-value="props.role"
    :rules="[(v: string) => !!v || 'Выберите роль']"
    :items="props.roles"
    label="Выберите роль"
    variant="outlined"
    class="mb-4"
    @update:modelValue="value => emit('update:role', value)"
  />
</template>
