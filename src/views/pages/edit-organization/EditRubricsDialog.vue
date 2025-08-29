<script setup lang="ts">
import { ref, watch } from 'vue'
import { SOURCE } from '@core/model/shared/source'
import { API } from '@/shared/api'

const props = defineProps({
  modelValue: Boolean,
  rubrics: {
    type: Array as () => Array<{ name: string; id: string }>,
    default: () => [],
  },
  organizationId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const showDialog = ref(props.modelValue)

const foundRubrics = ref<{ id: string; name: string }[]>([])
const selectedRubrics = ref<{ id: string; name: string }>(props.rubrics)
const searchQuery = ref('')

// Add a new reactive variable to track the loading state
const isLoading = ref(false)

const handleSave = () => {
  const newExternal = selectedRubrics.value.map(rubric => ({
    externalId: rubric.id,
    platform: SOURCE.TWOGIS,
  }))

  emit('save', { rubrics: { external: newExternal } })
}

const handleClose = () => {
  showDialog.value = false
}

const removeRubric = (rubricName: string) => {
  selectedRubrics.value = selectedRubrics.value.filter(name => name !== rubricName)
}

const addRubric = (rubricId: string) => {
  const selectedItem = foundRubrics.value.find(item => item.id === rubricId)

  if (selectedItem && !selectedRubrics.value.includes(selectedItem.name)) {
    selectedRubrics.value.push({ name: selectedItem.name, id: selectedItem.id })
    console.log(selectedRubrics.value, 'selectedRubrics.value.')
    searchQuery.value = ''
    foundRubrics.value = []
  }
}

const fetchRubrics = async (text: string) => {
  if (!text || text.length < 2) {
    foundRubrics.value = []

    return
  }

  isLoading.value = true

  try {
    const { success, data } = await API.TWOGIS.searchRubricsFromTwogis({ organizationId: props.organizationId, text })

    if (success && data && data.items)
      foundRubrics.value = data.items
    else
      foundRubrics.value = []
  }
  catch (error) {
    console.error('Error fetching rubrics:', error)
    foundRubrics.value = []

    handleClose()
  }
  finally {
    isLoading.value = false
  }
}

let timeoutId: number | null = null
watch(searchQuery, newQuery => {
  if (timeoutId)
    clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    fetchRubrics(newQuery)
  }, 500) // 500ms debounce
})

watch(() => props.modelValue, newVal => {
  showDialog.value = newVal
})

watch(showDialog, newVal => {
  if (!newVal) {
    emit('update:modelValue', false)
    searchQuery.value = ''
    foundRubrics.value = []
  }
})

watch(() => props.rubrics, newRubrics => {
  selectedRubrics.value = newRubrics.map(r => r.name)
})
</script>

<template>
  <VDialog
    v-model="showDialog"
    max-width="600"
  >
    <VCard>
      <VCardText>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <VChip
            v-for="rubric in selectedRubrics"
            :key="rubric"
            closable
            @click:close="removeRubric(rubric)"
          >
            {{ rubric.name }}
          </VChip>
        </div>

        <VAutocomplete
          v-model:search="searchQuery"
          :items="foundRubrics"
          item-title="name"
          item-value="id"
          :no-data-text="searchQuery.length > 0 ? 'Ничего не найдено' : 'Начните ввод...'"
          label="Поиск и добавление рубрик"
          hide-details
          clearable
          :loading="isLoading"
          :custom-filter="() => true"
          @update:model-value="addRubric"
        />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          variant="text"
          @click="handleClose"
        >
          Отмена
        </VBtn>
        <VBtn
          color="primary"
          variant="flat"
          @click="handleSave"
        >
          Сохранить
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
