<script setup lang="ts">
import EditRubricsDialog from "@/views/pages/edit-organization/EditRubricsDialog.vue"
import EditScheduleDialog from "@/views/pages/edit-organization/EditScheduleDialog.vue"
import { computed, ref, watch } from 'vue'
import { getPlatformPngAddress } from '@core/utils/getPlatformIcon'

interface Placement {
  id: string
  platform: 'TWOGIS' | 'GOOGLE'
  rating: number
  reviewCount: number
}

interface Schedule {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  startTime: string
  endTime: string
  breakStartTime: string | null
  breakEndTime: string | null
}

const props = defineProps<{
  organization: {
    id: string
    name: string
    address: string
    isTemporarilyClosed: boolean
    rubrics: { name: string; type: 'primary' | 'additional' }[]
    placements: Placement[]
    workingSchedules: Schedule[]
  }
}>()

const emit = defineEmits([
  'save',
  'deactivate',
  'add-placement',
  'edit-schedule',
  'close',
])

const isEditingName = ref(false)
const editableName = ref(props.organization.name)
const isTemporarilyClosed = ref(props.organization.isTemporarilyClosed)
const placements = ref<Placement[]>(props.organization.placements)
const localRubrics = ref(props.organization.rubrics)
const localSchedules = ref(props.organization.workingSchedules)

// Состояния для модальных окон
const showEditRubricsDialog = ref(false)
const showEditScheduleDialog = ref(false)

watch(() => props.organization, newOrg => {
  editableName.value = newOrg.name
  isTemporarilyClosed.value = newOrg.isTemporarilyClosed
  placements.value = newOrg.placements
  localRubrics.value = newOrg.rubrics
  localSchedules.value = newOrg.workingSchedules
}, { deep: true, immediate: true })

const saveChanges = () => {
  const updatedData = {
    ...props.organization,
    name: editableName.value,
    isTemporarilyClosed: isTemporarilyClosed.value,
    placements: placements.value,
    rubrics: localRubrics.value,
    workingSchedules: localSchedules.value,
  }

  emit('save', updatedData)
}

const handleAddPlacement = () => {
  console.log('Добавить новое размещение')
  emit('add-placement')
}

const handleEditSchedule = () => {
  showEditScheduleDialog.value = true
}

const handleEditRubrics = () => {
  showEditRubricsDialog.value = true
}

const handleSaveRubrics = (newRubrics) => {
  localRubrics.value = newRubrics
}

const handleSaveSchedules = (newSchedules) => {
  localSchedules.value = newSchedules
}

const addPlacementBtnText = computed(() => {
  if (props.organization.placements.length === 0)
    return 'Добавить размещении Google Maps и 2GIS'
  if (!props.organization.placements.find(p => p.platform === 'TWOGIS'))
    return 'Добавить размещение 2GIS'
  if (!props.organization.placements.find(p => p.platform === 'GOOGLE'))
    return 'Добавить размещение Google Maps'

  return null
})

const dayMap = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
}

const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const formattedSchedules = computed(() => {
  const sortedSchedules = [...localSchedules.value].sort((a, b) => {
    const dayA = dayOrder.indexOf(a.dayOfWeek)
    const dayB = dayOrder.indexOf(b.dayOfWeek)

    return dayA - dayB
  })

  return sortedSchedules.map(schedule => {
    const day = dayMap[schedule.dayOfWeek]
    const startTime = schedule.startTime.slice(0, 5)
    const endTime = schedule.endTime.slice(0, 5)
    const time = `${startTime} — ${endTime}`

    return {
      ...schedule,
      day,
      time,
    }
  })
})

const getPlacementByPlatform = (platform: 'TWOGIS' | 'GOOGLE') => {
  return placements.value.find(p => p.platform === platform)
}

const addNewPlacement = (platform: 'TWOGIS' | 'GOOGLE') => {
  console.log(`Нажата кнопка "Добавить" для платформы ${platform}`)
}

const redirectToExternalPlacementPage = (externalId: string, platform: 'TWOGIS' | 'GOOGLE') => {
  if (platform === 'TWOGIS') {
    const id = externalId.split('_')[0]

    window.location.href = `https://2gis.kz/almaty/firm/${id}`
  }
  else {
    window.location.href = `https://www.google.com/maps/place/?q=place_id:${externalId}`
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pa-2">
        <VTextarea
          v-if="isEditingName"
          v-model="editableName"
          auto-grow
          rows="1"
          hide-details
          class="text-h5 font-weight-bold"
          @blur="isEditingName = false"
          @keydown.enter.prevent="isEditingName = false"
        />
        <h5
          v-else
          class="text-h5 font-weight-bold cursor-pointer"
          @click="isEditingName = true"
        >
          {{ editableName }}
        </h5>

        <span>{{ organization.address.address }}</span>
      </VCard>
    </VCol>

    <VCol cols="12">
      <OrganizationTwogisMap
        :latitude="Number(organization.address.latitude)"
        :longitude="Number(organization.address.longitude)"
        api-key="142be1a7-aa84-4b5b-9a8d-1c05f09d518d"
      />
    </VCol>
  </VRow>

  <div class="d-flex flex-column">
    <VCol class="pa-0 mt-4">
      <div class="d-flex align-center justify-space-between cursor-pointer" @click="handleEditRubrics">
        <h6 class="text-h6 mb-2 font-weight-bold">
          Рубрики:
        </h6>
      </div>

      <VCard class="pa-4">
        <div class="d-flex flex-wrap ga-2">
          <VChip
            @click="handleEditRubrics"
            class="cursor-pointer"
            v-for="rubric in localRubrics"
            :key="rubric.name"
            :color="rubric.type === 'primary' ? 'primary' : 'default'"
            variant="tonal"
            size="small"
          >
            {{ rubric.name }}
          </VChip>
        </div>
      </VCard>
    </VCol>

    <VDivider class="mt-4" />
    <VCol class="pa-0">
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 mb-2 font-weight-bold">
          Размещении: {{ organization.placements.length }}
        </h6>
      </div>
      <VCard class="pa-4">
        <div class="d-flex align-center justify-space-evenly mt-2">
          <div
            v-for="platform in ['TWOGIS', 'GOOGLE']"
            :key="platform"
          >
            <div
              v-if="getPlacementByPlatform(platform)"
              variant="outlined"
              class="cursor-pointer ga-4 d-flex flex-column align-center justify-center"
              @click="redirectToExternalPlacementPage(getPlacementByPlatform(platform).externalId, platform)"
            >
              <VImg
                :src="getPlatformPngAddress(platform)"
                width="60"
                height="60"
              />
              <span class="d-inline-flex align-center ga-4">
                <span class="text-primary">4.7</span>
                <VRating
                  v-model="getPlacementByPlatform(platform).rating"
                  density="compact"
                  half-increments
                  readonly
                  size="xs"
                />
              </span>
            </div>

            <div
              v-else
              class="disabled-placement-container ga-4 d-flex flex-column align-center justify-center"
            >
              <VImg
                :src="getPlatformPngAddress(platform)"
                class="disabled-platform-icon"
                width="60"
                height="60"
              />
              <span class="d-inline-flex align-center ga-4">
                <VRating
                  class="disabled-platform-rating"
                  model-value="0.0"
                  density="compact"
                  readonly
                  disabled
                  size="xs"
                />
              </span>
              <VBtn
                class="add-button"
                color="primary"
                icon="bx-plus"
                size="large"
                variant="tonal"
                @click="addNewPlacement(platform)"
              />
            </div>
          </div>
        </div>
      </VCard>
    </VCol>

    <VDivider class="mt-4" />

    <VCol
      cols="3"
      class="pa-0"
    >
      <div class="d-flex align-center justify-space-between mb-2 cursor-pointer" @click="handleEditSchedule">
        <h6 class="text-h6 font-weight-bold">
          Время работы:
        </h6>
      </div>

      <VList
        density="compact"
        class="pa-0"
        style="background-color: transparent"
      >
        <VListItem
          v-for="schedule in formattedSchedules"
          :key="schedule.dayOfWeek"
          class="px-0"
        >
          <VListItemTitle class="d-flex justify-space-between align-center">
            <span>{{ schedule.day }}</span>

            <VCard class="pa-2 cursor-pointer"  @click="handleEditSchedule">
              <span class="font-weight-bold">{{ schedule.time }}</span>
            </VCard>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCol>

    <VDivider class="mt-4" />

    <VCol class="pa-0">
      <div class="d-flex align-center">
        <VSwitch
          v-model="isTemporarilyClosed"
          color="red"
          label="Временно закрыта"
          hide-details
        />
      </div>
    </VCol>
  </div>

  <VCardActions class="justify-end">
    <VBtn
      variant="text"
      color="secondary"
      @click="emit('close')"
    >
      Отмена
    </VBtn>
    <VBtn
      color="primary"
      variant="outlined"
      @click="saveChanges"
    >
      Применить для группы
    </VBtn>
    <VBtn
      color="primary"
      variant="flat"
      @click="saveChanges"
    >
      Применить
    </VBtn>
  </VCardActions>

  <EditRubricsDialog
    v-model="showEditRubricsDialog"
    :rubrics="localRubrics"
    @save="handleSaveRubrics"
  />

  <EditScheduleDialog
    v-model="showEditScheduleDialog"
    :working-schedules="localSchedules"
    @save="handleSaveSchedules"
  />
</template>

<style>
.disabled-placement-container {
  position: relative; /* Родительский элемент должен быть позиционирован */
}

.disabled-platform-icon {
  filter: grayscale(100%) blur(1px);
  opacity: 0.8;
}
.disabled-platform-rating {
  filter: grayscale(100%) blur(2px);
  opacity: 0.6;
}
.add-button {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; /* Помещает кнопку поверх других элементов */
}
</style>
