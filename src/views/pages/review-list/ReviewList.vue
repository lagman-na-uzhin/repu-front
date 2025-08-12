<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import ReviewCard from '@/components/review/ReviewCard.vue'
import NotFoundMessage from '@/@core/components/NotFoundMessage.vue' // Убедитесь, что путь правильный

// Определяем пропсы, которые компонент будет принимать
const props = defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalReviews: { // Общее количество отзывов (не totalPages)
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
})

// Определяем события, которые компонент будет эмитить
const emit = defineEmits(['update:model-value', 'update:items-per-page'])

// Вычисляемое свойство для totalPages, основанное на пропсах
const totalPages = computed(() => {
  return Math.ceil(props.totalReviews / props.itemsPerPage)
})

// V-model для пагинации (связан с currentPage)
const currentLocalPage = computed({
  get: () => props.currentPage,
  set: value => {
    emit('update:model-value', value) // Эмитим изменение страницы
  },
})

// V-model для количества элементов на странице (связан с itemsPerPage)
const localItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: value => {
    emit('update:items-per-page', value) // Эмитим изменение количества элементов на странице
  },
})
</script>

<template>
  <div>
    <VRow
      v-if="props.loading"
      class="justify-center py-5"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
      <div class="ml-2 text-primary">
        Загрузка отзывов...
      </div>
    </VRow>

    <NotFoundMessage
      v-else-if="props.reviews.length === 0"
      message="Отзывы не найдены. Попробуйте изменить фильтры."
      class="pa-10"
    />

    <VList
      v-for="review in props.reviews"
      :key="review.id"
      class="mb-4"
    >
      <ReviewCard :review="review" />
    </VList>

    <VDivider v-if="props.reviews.length > 0" />

    <VCardActions
      v-if="props.reviews.length > 0"
      class="justify-center"
    >
      <PaginationControl
        v-model="currentLocalPage"
        :page-count="totalPages"
        :items-per-page="localItemsPerPage"
        class="pb-2 pt-2"
        @update:model-value="currentLocalPage = $event"
        @update:items-per-page="localItemsPerPage = $event"
      />
    </VCardActions>
  </div>
</template>
