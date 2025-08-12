<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import ReplyTemplateListHeader from '@/views/pages/reply-templates/ReplyTemplateListHeader.vue'
import { API } from '@/shared/api' // Предполагаем, что у вас есть API сервис
import { useAuthStore } from '@/stores/auth.store' // Для получения companyId
import { MODULE_CONTENT, getTableParams } from '@/utils/table-params' // Для параметров таблицы
import ResponseTemplateList from '@/views/pages/reply-templates/ReplyTemplateList.vue'

// --- Локальное состояние ---
const templates = ref([]) // Массив для хранения шаблонов ответов
const isLoading = ref(true) // Состояние загрузки данных
const totalRows = ref(0) // Общее количество шаблонов для пагинации
const totalPages = ref(1) // Общее количество страниц

const user = useAuthStore().user
const moduleName = MODULE_CONTENT.RESPONSE_TEMPLATES // Новое имя модуля для table-params
const tableParams = reactive(getTableParams(moduleName, { companyId: user?.companyId }))

const fetchTemplates = async () => {
  isLoading.value = true
  try {
    const { success, data } = await API.RESPONSE_TEMPLATES.getListByCompany(tableParams)

    if (success) {
      templates.value = data.list
      totalRows.value = data.total
      totalPages.value = data.totalPages || 1 // Убедитесь, что totalPages возвращается API
    }
    else {
      console.error('Ошибка при получении шаблонов:', data)
      templates.value = []
      totalRows.value = 0
      totalPages.value = 1
    }
  }
  catch (error) {
    console.error('Произошла ошибка при получении шаблонов:', error)
    templates.value = []
    totalRows.value = 0
    totalPages.value = 1
  }
  finally {
    isLoading.value = false
  }
}

// --- Обработчики пагинации/сортировки ---
const handleUpdateCurrentPage = (newPage: number) => {
  tableParams.pagination.currentPage = newPage
}

const handleUpdateItemsPerPage = (newItemsPerPage: number) => {
  tableParams.pagination.perPage = newItemsPerPage
  tableParams.pagination.currentPage = 1 // Сброс на первую страницу при изменении количества элементов
  // watchEffect автоматически вызовет fetchTemplates
}

const handleRefreshTemplates = () => {
  fetchTemplates() // Можно вызвать явно, например, после добавления/удаления
}

// --- Наблюдение за tableParams для автоматического обновления ---
watchEffect(() => {
  fetchTemplates()
})
</script>

<template>
  <ReplyTemplateListHeader />
  <VRow>
    <VCol cols="12">
      <ResponseTemplateList
        :templates="templates"
        :is-loading="isLoading"
        :total-rows="totalRows"
        :total-pages="totalPages"
        :current-page="tableParams.pagination.currentPage"
        :items-per-page="tableParams.pagination.perPage"
        @update:current-page="handleUpdateCurrentPage"
        @update:items-per-page="handleUpdateItemsPerPage"
        @refresh="handleRefreshTemplates"
        @edit="console.log('Редактировать:', $event)"
        @delete="console.log('Удалить:', $event)"
      />
    </VCol>
  </VRow>
</template>
