<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { VTooltip } from 'vuetify/components/VTooltip'

interface Schedule {
  uniqueRelation: string
  dayOfWeek: string
  startTime: string
  endTime: string
  breakStartTime: string | null
  breakEndTime: string | null
}

interface ScheduleBlock {
  id: string
  days: string[]
  startTime: string
  endTime: string
  isBreak: boolean
  breakStartTime: string | null
  breakEndTime: string | null
}

const props = defineProps({
  modelValue: Boolean,
  workingSchedules: Array<Schedule>,
  scheduleId: String,
})

const emit = defineEmits(['update:modelValue', 'save'])

const showDialog = ref(props.modelValue)

const dayMap = {
  MONDAY: 'Пн',
  TUESDAY: 'Вт',
  WEDNESDAY: 'Ср',
  THURSDAY: 'Чт',
  FRIDAY: 'Пт',
  SATURDAY: 'Сб',
  SUNDAY: 'Вс',
}

const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const schedules = ref<ScheduleBlock[]>([])
const allDays = Object.keys(dayMap)

const availableDays = computed(() => {
  const selectedDays = schedules.value.flatMap(block => block.days)

  return allDays.filter(day => !selectedDays.includes(day))
})

const initializeSchedules = () => {
  if (!props.workingSchedules || props.workingSchedules.length === 0) {
    schedules.value = [{
      id: crypto.randomUUID(),
      days: [],
      startTime: '09:00',
      endTime: '18:00',
      isBreak: false,
      breakStartTime: '13:00',
      breakEndTime: '14:00',
    }]

    return
  }

  const sortedSchedules = [...props.workingSchedules].sort((a, b) => {
    const dayA = dayOrder.indexOf(a.dayOfWeek)
    const dayB = dayOrder.indexOf(b.dayOfWeek)

    return dayA - dayB
  })

  const newSchedules: ScheduleBlock[] = []
  let currentBlock: ScheduleBlock | null = null

  for (const schedule of sortedSchedules) {
    // Check if the current schedule can be added to the current block
    const isSameTime = currentBlock?.startTime === schedule.startTime && currentBlock?.endTime === schedule.endTime
    const isSameBreak = currentBlock?.isBreak === !!schedule.breakStartTime && (currentBlock?.isBreak ? (currentBlock?.breakStartTime === schedule.breakStartTime && currentBlock?.breakEndTime === schedule.breakEndTime) : true)

    if (currentBlock && isSameTime && isSameBreak) {
      currentBlock.days.push(schedule.dayOfWeek)
    } else {
      // Start a new block
      currentBlock = {
        id: crypto.randomUUID(),
        days: [schedule.dayOfWeek],
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isBreak: !!schedule.breakStartTime,
        breakStartTime: schedule.breakStartTime,
        breakEndTime: schedule.breakEndTime,
      }
      newSchedules.push(currentBlock)
    }
  }
  schedules.value = newSchedules
}

const handleSave = () => {
  const newSchedules: Schedule[] = []

  schedules.value.forEach(block => {
    block.days.forEach(day => {
      newSchedules.push({
        uniqueRelation: `${day}_${props.scheduleId}`,
        dayOfWeek: day,
        startTime: block.startTime,
        endTime: block.endTime,
        breakStartTime: block.isBreak ? block.breakStartTime : null,
        breakEndTime: block.isBreak ? block.breakEndTime : null,
      })
    })
  })

  emit('save', newSchedules)
}

const handleClose = () => {
  showDialog.value = false
}

const addNewScheduleBlock = () => {
  schedules.value.push({
    id: crypto.randomUUID(),
    days: availableDays.value,
    startTime: '09:00',
    endTime: '18:00',
    isBreak: false,
    breakStartTime: '13:00',
    breakEndTime: '14:00',
  })
}

const removeScheduleBlock = (id: string) => {
  schedules.value = schedules.value.filter(block => block.id !== id)
  if (schedules.value.length === 0) {
    addNewScheduleBlock()
    schedules.value[0].days = []
  }
}

const dayActiveMap = computed(() => {
  const map = new Map<string, string>() // Key: dayOfWeek, Value: blockId

  schedules.value.forEach(block => {
    block.days.forEach(day => {
      map.set(day, block.id)
    })
  })

  return map
})

const toggleDaySelection = (block: ScheduleBlock, day: string) => {
  const dayIndex = block.days.indexOf(day)

  if (dayIndex !== -1) {
    block.days = block.days.filter(d => d !== day)
  }
  else {
    for (const otherBlock of schedules.value) {
      if (otherBlock.id !== block.id)
        otherBlock.days = otherBlock.days.filter(d => d !== day)
    }
    block.days = [...block.days, day]
  }
}

watch(() => props.modelValue, newVal => {
  showDialog.value = newVal
  if (newVal)
    initializeSchedules()
})

watch(() => props.workingSchedules, () => {
  initializeSchedules()
}, { deep: true, immediate: true })

watch(showDialog, newVal => {
  if (!newVal)
    emit('update:modelValue', false)
})
</script>

<template>
  <VDialog
    v-model="showDialog"
    max-width="600"
    @close="handleClose"
  >
    <VCard>
      <VCardText>
        <VList density="compact">
          <VListItem
            v-for="block in schedules"
            :key="block.id"
            class="mb-4 rounded position-relative"
            :class="{ 'bg-grey-lighten-4': block.days.length === 0 }"
          >
            <VBtn
              icon
              variant="text"
              size="small"
              class="position-absolute top-0 right-0 mt-1 mr-1"
              @click.stop="removeScheduleBlock(block.id)"
            >
              <VIcon icon="bx-x" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Удалить блок
              </VTooltip>
            </VBtn>

            <div class="d-flex flex-column justify-center align-center pt-2">
              <VCol
                cols="12"
                class="d-flex align-center justify-center gap-2"
              >
                <VBtn
                  v-for="day in allDays"
                  :key="day"
                  size="60"
                  variant="tonal"
                  :color="dayActiveMap.get(day) === block.id ? 'primary' : 'default'"
                  class="mr-1 mb-1"
                  @click="toggleDaySelection(block, day)"
                >
                  {{ dayMap[day] }}
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                md="6"
                class="d-flex align-center gap-2"
              >
                <VTextField
                  v-model="block.startTime"
                  type="time"
                  hide-details
                  variant="filled"
                  class="time-input"
                />
                <span class="text-h6">—</span>
                <VTextField
                  v-model="block.endTime"
                  type="time"
                  hide-details
                  variant="filled"
                  class="time-input"
                />
              </VCol>
              <div class="d-flex align-center mt-2 ml-10">
                <VCheckbox
                  v-model="block.isBreak"
                  label="Перерыв"
                  hide-details
                  class="flex-grow-1"
                />
                <div
                  v-if="block.isBreak"
                  class="d-flex align-center gap-2"
                >
                  <VTextField
                    v-model="block.breakStartTime"
                    type="time"
                    density="compact"
                    hide-details
                    variant="outlined"
                    class="time-input"
                  />
                  <span class="text-h6">—</span>
                  <VTextField
                    v-model="block.breakEndTime"
                    type="time"
                    density="compact"
                    hide-details
                    variant="outlined"
                    class="time-input"
                  />
                </div>
              </div>
            </div>
          </VListItem>
        </VList>
        <VBtn
          v-if="availableDays.length > 0"
          color="primary"
          variant="tonal"
          @click="addNewScheduleBlock"
        >
          <VIcon
            start
            icon="bx-plus"
          /> Добавить другие дни ({{ availableDays.map(day => dayMap[day]).join(', ') }})
        </VBtn>
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

<style scoped>
.time-input {
  width: 90px;
}
.gap-2 {
  gap: 8px;
}
</style>
