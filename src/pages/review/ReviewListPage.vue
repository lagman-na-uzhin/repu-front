<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { API } from '@/shared/api'
import { useAuthStore } from '@/stores/auth.store'
import type { IReview } from '@core/model/default/review' // Убедитесь, что это ваш Read Model, если он расширяет IReview
import ReviewList from '@/views/pages/review-list/ReviewList.vue'
import ReviewListFilters from '@/views/pages/review-list/ReviewListFilters.vue'
import ReviewListHeader from '@/views/pages/review-list/ReviewListHeader.vue'

// Импортируем утилиты для работы с параметрами таблицы
import { MODULE_CONTENT, getTableParams, saveTableParams } from '@/utils/table-params'

// --- Состояние компонента ---
const reviews = ref<IReview[]>([]) // Если IReview - это Read Model, то здесь все хорошо
const loading = ref(false)
const totalReviews = ref(0) // Общее количество отзывов без учёта пагинации

const authStore = useAuthStore()

// Инициальные фильтры, которые пользователь может сбрасывать.
// companyId здесь не указываем, так как он будет добавляться динамически.
const initialUserChangableFilters = {
  groupId: null,
  cityId: null,
  organizationId: null,
  platforms: [],
  tone: 'all',
  dateFrom: null,
  dateTo: null,
}

// currentTableParams теперь не содержит companyId в filter при инициализации,
// так как companyId будет добавляться динамически при каждом запросе.
const currentTableParams = ref(getTableParams(MODULE_CONTENT.REVIEW_LIST, initialUserChangableFilters))

const fetchReviews = async () => {
  loading.value = true
  try {
    const paramsToSend = {
      ...currentTableParams.value,
      filter: {
        ...currentTableParams.value.filter, // Текущие фильтры из currentTableParams
        companyId: authStore.user?.companyId, // companyId текущей компании пользователя
      },
    }

    const { data, success } = await API.REVIEW.getList(paramsToSend)

    if (success && data) {
      reviews.value = data.list
      totalReviews.value = data.total

      // Обновляем параметры пагинации из ответа API, если они предоставлены
      currentTableParams.value.pagination.page = data.currentPage || currentTableParams.value.pagination.page
      currentTableParams.value.pagination.limit = data.limit || currentTableParams.value.pagination.limit
    }
  }
  catch (error) {
    reviews.value = []
    totalReviews.value = 0
  }
  finally {
    loading.value = false
    saveTableParams(MODULE_CONTENT.REVIEW_LIST, currentTableParams.value)
  }
}

// Обработка обновлений фильтров от ReviewListHeader и ReviewListFilters
const handleFilterUpdate = (newFilters: { [key: string]: any }) => {
  // Мержим новые фильтры с текущими
  currentTableParams.value.filter = { ...currentTableParams.value.filter, ...newFilters }
  currentTableParams.value.pagination.page = 1 // Сбрасываем страницу при изменении фильтров
  fetchReviews()
}

// Обработка событий пагинации от ReviewList
const handlePaginationUpdate = (pagination: { page?: number; itemsPerPage?: number }) => {
  if (pagination.page !== undefined)
    currentTableParams.value.pagination.page = pagination.page

  if (pagination.itemsPerPage !== undefined)
    currentTableParams.value.pagination.limit = pagination.itemsPerPage

  fetchReviews()
}

// Обработка сброса фильтров
const handleFilterReset = () => {
  // Полностью перезаписываем фильтры на их начальное состояние (без companyId)
  currentTableParams.value.filter = { ...initialUserChangableFilters }
  currentTableParams.value.pagination.page = 1 // Сбрасываем страницу
  fetchReviews()
}

// --- Вычисляемые свойства для пагинации ---
const totalPages = computed(() => {
  return Math.ceil(totalReviews.value / currentTableParams.value.pagination.limit)
})

const currentPage = computed({
  get: () => currentTableParams.value.pagination.page,
  set: val => {
    currentTableParams.value.pagination.page = val
  },
})

const itemsPerPage = computed({
  get: () => currentTableParams.value.pagination.limit,
  set: val => {
    currentTableParams.value.pagination.limit = val
  },
})

const compactOrganizations = ref(null)

const fetchCompactOrganizations = async () => {
  const { success, data } = await API.ORGANIZATION.getCompactOrganizations({ companyId: authStore.user!.companyId })
  if (success && data) {
    console.log(data, "data")
    console.log(typeof data, "typeof data")
    compactOrganizations.value = data
  }

  console.log(data, "data")
}

onMounted(() => {
  fetchReviews()
  fetchCompactOrganizations()
})
</script>

<template>
  <ReviewListHeader
    :compact-organizations="compactOrganizations"
    @update:filters="handleFilterUpdate"
  />
  <VRow>
    <VCol
      cols="12"
      sm="12"
      md="5"
      xl="3"
      order-md="2"
      order-xl="2"
    >
      <ReviewListFilters
        @update:filters="handleFilterUpdate"
        @reset:filters="handleFilterReset"
      />
    </VCol>

    <VCol
      cols="12"
      sm="12"
      md="7"
      xl="9"
      order-md="1"
      order-xl="1"
    >
      <ReviewList
        :reviews="reviews"
        :loading="loading"
        :total-pages="totalPages"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @update:model-value="handlePaginationUpdate({ page: $event })"
        @update:items-per-page="handlePaginationUpdate({ itemsPerPage: $event })"
      />
    </VCol>
  </VRow>
</template>
