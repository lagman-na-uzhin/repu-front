<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  rubrics: Array<{ name: string; type: 'primary' | 'additional' }>,
});
const emit = defineEmits(['update:modelValue', 'save']);

const showDialog = ref(props.modelValue);
const allAvailableRubrics = ref([
  'Ресторан', 'Кафе', 'Магазин', 'Автосервис', 'Медицинский центр',
  'Салон красоты', 'Фитнес-клуб', 'Бар', 'Ночной клуб', 'Кинотеатр',
]);
const selectedRubrics = ref(props.rubrics.map(r => r.name));
const searchQuery = ref('');

// Вычисляемый список доступных элементов для отображения
// Мы исключаем уже выбранные, чтобы они не отображались в списке поиска
const availableItems = computed(() => {
  return allAvailableRubrics.value.filter(item => !selectedRubrics.value.includes(item));
});

const handleSave = () => {
  const newRubrics = selectedRubrics.value.map(name => ({
    name,
    type: 'additional',
  }));
  emit('save', newRubrics);
  showDialog.value = false;
};

const handleClose = () => {
  showDialog.value = false;
};

const removeRubric = (rubricName: string) => {
  selectedRubrics.value = selectedRubrics.value.filter(name => name !== rubricName);
};

// 💡 Новый метод для добавления рубрики
const addRubric = (rubric: string) => {
  if (rubric && !selectedRubrics.value.includes(rubric)) {
    selectedRubrics.value.push(rubric);
    searchQuery.value = ''; // Очищаем поле поиска
  }
};

watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal;
});

watch(showDialog, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', false);
  }
});

watch(() => props.rubrics, (newRubrics) => {
  selectedRubrics.value = newRubrics.map(r => r.name);
});
</script>

<template>
  <VDialog v-model="showDialog" max-width="600">
    <VCard>
      <VCardText>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <VChip
            v-for="rubric in selectedRubrics"
            :key="rubric"
            closable
            @click:close="removeRubric(rubric)"
          >
            {{ rubric }}
          </VChip>
        </div>

        <VAutocomplete
          :items="availableItems"
          v-model:search="searchQuery"
          label="Поиск и добавление рубрик"
          hide-details
          clearable
          @update:model-value="addRubric" />
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="handleClose">Отмена</VBtn>
        <VBtn color="primary" variant="flat" @click="handleSave">Сохранить</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
