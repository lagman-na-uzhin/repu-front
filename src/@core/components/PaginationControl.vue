<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  modelValue: number // текущая страница
  pageCount: number // общее количество страниц
  itemsPerPage: number // сколько элементов на странице
  itemsPerPageOptions?: number[] // возможные опции
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const currentPage = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const perPage = computed({
  get: () => props.itemsPerPage,
  set: val => emit('update:itemsPerPage', val),
})

watch(() => props.pageCount, newCount => {
  if (currentPage.value > newCount)
    currentPage.value = 1
})
</script>

<template>
  <div class="d-flex align-center">
    <VCol class="pa-0">
      <VSelect
        v-model="perPage"
        :items="itemsPerPageOptions || [5, 10, 20, 50, 100]"
        density="comfortable"
        hide-details
        class="select"
      />
    </VCol>

    <VCol
      class="d-flex justify-end align-center pa-0"
    >
      <VPagination
        v-model="currentPage"
        :length="pageCount"
        total-visible="5"
        size="small"
      />
    </VCol>
  </div>
</template>

<style scoped lang="scss">
.select {
  width: 6rem;
}

</style>
