<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

interface Template {
  id: string
  name?: string
  type: 'positive' | 'negative' | 'neutral' | 'all'
  text: string
}

const props = defineProps<{
  templates: Template[]
  isLoading: boolean
  totalRows: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:itemsPerPage', items: number): void
  (e: 'refresh'): void
  (e: 'edit', templateId: string): void
  (e: 'delete', templateId: string): void
}>()

const headers = [
  { title: 'Название', key: 'name' },
  { title: 'Тип Отзыва', key: 'type' },
  { title: 'Текст Шаблона', key: 'text' },
  { title: 'Действия', key: 'actions', sortable: false },
]

const templateTypeMap: Record<Template['type'], string> = {
  positive: 'Положительный',
  negative: 'Отрицательный',
  neutral: 'Нейтральный',
  all: 'Все Типы',
}

const editTemplate = (id: string) => {
  emit('edit', id)
}

const deleteTemplate = (id: string) => {
  emit('delete', id)
}
</script>

<template>
  <VCard>
    <VDataTableServer
      :headers="headers"
      :items="templates"
      :items-length="totalRows"
      :loading="isLoading"
      :page="currentPage"
      :items-per-page="itemsPerPage"
      item-value="id"
      class="elevation-1"
      @update:page="(page) => emit('update:currentPage', page)"
      @update:items-per-page="(items) => emit('update:itemsPerPage', items)"
    >
      <template #item.name="{ item }">
        {{ item.name || 'Без названия' }}
      </template>

      <template #item.type="{ item }">
        <VChip
          :color="item.type === 'positive' ? 'success' : item.type === 'negative' ? 'error' : 'info'"
          size="small"
          label
        >
          {{ templateTypeMap[item.type] || item.type }}
        </VChip>
      </template>

      <template #item.text="{ item }">
        <VTooltip
          :text="item.text"
          location="top"
        >
          <template #activator="{ props }">
            <span
              v-bind="props"
              class="d-inline-block text-truncate"
              style="max-width: 200px;"
            >
              {{ item.text }}
            </span>
          </template>
        </VTooltip>
      </template>

      <template #item.actions="{ item }">
        <VBtn
          icon
          flat
          size="small"
          @click="editTemplate(item.id)"
        >
          <VIcon>mdi-pencil</VIcon>
          <VTooltip
            activator="parent"
            location="top"
          >
            Редактировать
          </VTooltip>
        </VBtn>
        <VBtn
          icon
          flat
          size="small"
          @click="deleteTemplate(item.id)"
        >
          <VIcon>mdi-delete</VIcon>
          <VTooltip
            activator="parent"
            location="top"
          >
            Удалить
          </VTooltip>
        </VBtn>
      </template>

      <template #loading>
        <VProgressLinear
          indeterminate
          color="primary"
        />
      </template>
      <template #no-data>
        <NotFoundMessage
          class="ma-10 pa-10"
          message="Нет доступных шаблонов."
          size="medium"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>
