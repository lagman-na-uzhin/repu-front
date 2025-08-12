<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  breakStartTime: string | null;
  breakEndTime: string | null;
}

const props = defineProps({
  modelValue: Boolean,
  workingSchedules: Array<Schedule>,
});
const emit = defineEmits(['update:modelValue', 'save']);

const showDialog = ref(props.modelValue);
const allDays = [
  { dayOfWeek: 'MONDAY', dayName: 'Пн' },
  { dayOfWeek: 'TUESDAY', dayName: 'Вт' },
  { dayOfWeek: 'WEDNESDAY', dayName: 'Ср' },
  { dayOfWeek: 'THURSDAY', dayName: 'Чт' },
  { dayOfWeek: 'FRIDAY', dayName: 'Пт' },
  { dayOfWeek: 'SATURDAY', dayName: 'Сб' },
  { dayOfWeek: 'SUNDAY', dayName: 'Вс' },
];

const scheduleState = ref(allDays.map(day => {
  const existing = props.workingSchedules.find(s => s.dayOfWeek === day.dayOfWeek);
  return {
    ...day,
    isWorking: !!existing,
    is24x7: false,
    startTime: existing?.startTime || '09:00',
    endTime: existing?.endTime || '18:00',
    isBreak: !!existing?.breakStartTime,
    breakStartTime: existing?.breakStartTime || '13:00',
    breakEndTime: existing?.breakEndTime || '14:00',
  };
}));

const handleSave = () => {
  const newSchedules = scheduleState.value
    .filter(day => day.isWorking)
    .map(day => {
      // Логика для круглосуточного режима
      if (day.is24x7) {
        return {
          dayOfWeek: day.dayOfWeek,
          startTime: '00:00',
          endTime: '24:00',
          breakStartTime: null,
          breakEndTime: null,
        };
      }
      return {
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        breakStartTime: day.isBreak ? day.breakStartTime : null,
        breakEndTime: day.isBreak ? day.breakEndTime : null,
      };
    });
  emit('save', newSchedules);
  showDialog.value = false;
};

const handleClose = () => {
  showDialog.value = false;
};

const set24x7 = () => {
  scheduleState.value.forEach(day => {
    day.isWorking = true;
    day.is24x7 = true;
  });
};

const setWeekend = (dayOfWeek) => {
  const day = scheduleState.value.find(d => d.dayOfWeek === dayOfWeek);
  if (day) {
    day.isWorking = !day.isWorking;
    day.is24x7 = false;
  }
};

const setAllWorking = () => {
  scheduleState.value.forEach(day => {
    day.isWorking = true;
    day.is24x7 = false;
  });
};

watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal;
});

watch(showDialog, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', false);
  }
});
</script>

<template>
  <VDialog v-model="showDialog" max-width="600">
    <VCard>
      <VCardTitle>
        <span class="text-h6">Редактирование расписания</span>
      </VCardTitle>
      <VCardText>
        <div class="d-flex justify-center gap-2 mb-4">
          <VBtn color="primary" @click="set24x7">Круглосуточно</VBtn>
          <VBtn color="secondary" @click="setWeekend('SATURDAY')">Сб — выходной</VBtn>
          <VBtn color="secondary" @click="setWeekend('SUNDAY')">Вс — выходной</VBtn>
          <VBtn color="secondary" @click="setAllWorking">Все дни рабочие</VBtn>
        </div>

        <VList density="compact">
          <VListItem
            v-for="day in scheduleState"
            :key="day.dayOfWeek"
            class="mb-2 rounded"
            :class="{ 'bg-grey-lighten-4': !day.isWorking }"
          >
            <div class="d-flex align-center">
              <VCheckbox
                v-model="day.isWorking"
                :label="day.dayName"
                hide-details
                class="flex-grow-1"
                @change="day.is24x7 = false"
              />
              <div v-if="day.isWorking" class="d-flex align-center gap-2">
                <VCheckbox
                  v-model="day.is24x7"
                  label="24/7"
                  hide-details
                  class="mr-4"
                  @change="day.is24x7 ? day.isBreak = false : null"
                />

                <VTextField
                  v-if="!day.is24x7"
                  v-model="day.startTime"
                  type="time"
                  density="compact"
                  hide-details
                  class="time-input"
                />
                <span v-if="!day.is24x7">—</span>
                <VTextField
                  v-if="!day.is24x7"
                  v-model="day.endTime"
                  type="time"
                  density="compact"
                  hide-details
                  class="time-input"
                />

                <VCheckbox
                  v-if="!day.is24x7"
                  v-model="day.isBreak"
                  label="Перерыв"
                  density="compact"
                  hide-details
                  class="ml-4"
                />
              </div>
            </div>
            <div v-if="day.isWorking && day.isBreak && !day.is24x7" class="d-flex align-center gap-2 mt-2 ml-10">
              <VTextField
                v-model="day.breakStartTime"
                type="time"
                label="Начало перерыва"
                density="compact"
                hide-details
                class="time-input"
              />
              <span>—</span>
              <VTextField
                v-model="day.breakEndTime"
                type="time"
                label="Конец перерыва"
                density="compact"
                hide-details
                class="time-input"
              />
            </div>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="handleClose">Отмена</VBtn>
        <VBtn color="primary" variant="flat" @click="handleSave">Сохранить</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.time-input {
  max-width: 100px;
}
</style>
