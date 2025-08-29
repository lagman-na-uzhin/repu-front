<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SOURCE } from '@core/model/shared/source'
import { API } from '@/shared/api'
import type { IOrganization, IOrganizationRubric, IWorkingSchedule } from '@core/model/default/organization'
import { getCityName } from '@/utils/city-alias-map'
import EditRubricsDialog from '@/views/pages/edit-organization/EditRubricsDialog.vue'
import EditScheduleDialog from '@/views/pages/edit-organization/EditScheduleDialog.vue'
import { getPlatformPngAddress } from '@core/utils/getPlatformIcon'

interface Placement {
  id: string
  platform: 'TWOGIS' | 'GOOGLE'
  rating: number
  reviewCount: number
}

const props = defineProps<{
  organization: IOrganization
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
const placements = ref<Placement[]>(props.organization.placements)
const localRubrics = ref<IOrganizationRubric>(props.organization.rubrics)

const localSchedule = ref<IWorkingSchedule | null>(props.organization?.workingSchedule || null)

const localIsTemporaryClosed = ref<boolean>(props.organization.workingSchedule.isTemporarilyClosed)

const showEditRubricsDialog = ref(false)
const showEditScheduleDialog = ref(false)

watch(() => props.organization, newOrg => {
  editableName.value = newOrg.name
  localIsTemporaryClosed.value = newOrg.workingSchedule.isTemporarilyClosed
  placements.value = newOrg.placements
  localRubrics.value = newOrg.rubrics

  localSchedule.value = newOrg.workingSchedule || []
}, { deep: true, immediate: true })

const saveChanges = () => {
  const updatedData = {
    ...props.organization,
    name: editableName.value,
    isTemporarilyClosed: isTemporarilyClosed.value,
    placements: placements.value,
    rubrics: localRubrics.value,
    workingSchedules: localSchedule.value,
  }

  emit('save', updatedData)
}

const handleEditSchedule = () => {
  if (showEditScheduleDialog.value != true) {
    showEditScheduleDialog.value = true
  }
}

const handleEditRubrics = () => {
  showEditRubricsDialog.value = true
}

const handleSaveRubrics = async (newRubrics: {
  id: null
  name: null
  external: { externalId: string; platform: SOURCE }[]
}) => {
  localRubrics.value = newRubrics

  await API.ORGANIZATION.update(props.organization.id, newRubrics)
}

const handleSaveSchedules = async newEntries => {
  console.log('handleSaveSchedules')
  localSchedule.value.entries = newEntries

  const { success } = await API.ORGANIZATION.update(
    props.organization.id,
    { workingSchedule: { dailyHours: localSchedule.value, isTemporaryClosed: localIsTemporaryClosed } },
  )

  showEditScheduleDialog.value = false
}

const handleSaveTempClosed = async () => {
  await API.ORGANIZATION.update(
    props.organization.id,
    { workingSchedule: { dailyHours: localSchedule.value, isTemporaryClosed: localIsTemporaryClosed } },
  )
  showEditScheduleDialog.value = false
}
const dayMap = {
  MONDAY: 'ПН',
  TUESDAY: 'ВТ',
  WEDNESDAY: 'СР',
  THURSDAY: 'ЧТ',
  FRIDAY: 'ПТ',
  SATURDAY: 'СБ',
  SUNDAY: 'ВС',
}

const fullDayMap = {
  MONDAY: 'Понедельник',
  TUESDAY: 'Вторник',
  WEDNESDAY: 'Среда',
  THURSDAY: 'Четверг',
  FRIDAY: 'Пятница',
  SATURDAY: 'Суббота',
  SUNDAY: 'Воскресенье',
}

const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const groupedSchedules = computed(() => {
  console.log(localSchedule.value, 'localSchedules.value')
  console.log(props.organization, 'props.organization.working_schedule')
  if (!localSchedule.value || localSchedule.value.length === 0)
    return []

  const sortedSchedules = [...localSchedule.value.entries].sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek))

  const groups = []
  let currentGroup = []

  for (let i = 0; i < sortedSchedules.length; i++) {
    const currentSchedule = sortedSchedules[i]
    const nextSchedule = sortedSchedules[i + 1]

    if (currentGroup.length === 0) {
      currentGroup.push(currentSchedule)
    }
    else {
      // Check if current schedule is the same as the last one in the group
      const lastInGroup = currentGroup[currentGroup.length - 1]
      if (
        lastInGroup.startTime === currentSchedule.startTime
        && lastInGroup.endTime === currentSchedule.endTime
        && lastInGroup.breakStartTime === currentSchedule.breakStartTime
        && lastInGroup.breakEndTime === currentSchedule.breakEndTime
      ) {
        currentGroup.push(currentSchedule)
      }
      else {
        // Schedule changed, so finalize the current group and start a new one
        groups.push(currentGroup)
        currentGroup = [currentSchedule]
      }
    }

    // Handle the last item in the list
    if (i === sortedSchedules.length - 1)
      groups.push(currentGroup)
  }

  // Format the final groups for display
  return groups.map(group => {
    const firstDay = dayMap[group[0].dayOfWeek]
    const lastDay = dayMap[group[group.length - 1].dayOfWeek]
    const dayRange = firstDay === lastDay ? fullDayMap[group[0].dayOfWeek] : `${firstDay} — ${lastDay}`
    const startTime = group[0].startTime.slice(0, 5)
    const endTime = group[0].endTime.slice(0, 5)
    const time = `${startTime} — ${endTime}`

    return {
      dayRange,
      time,
    }
  })
})

const formattedSchedules = computed(() => {
  const schedulesToFormat = localSchedule.value || []

  const sortedSchedules = [...schedulesToFormat].sort((a, b) => {
    const dayA = dayOrder.indexOf(a.dayOfWeek)
    const dayB = dayOrder.indexOf(b.dayOfWeek)

    return dayA - dayB
  })

  return sortedSchedules.map(schedule => {
    const day = fullDayMap[schedule.dayOfWeek]
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
    window.location.href = `https://www.google.com/maps/place/?q=place_id:$${externalId}`
  }
}

const saveName = () => {
  console.log('Имя сохранено:', editableName.value)
  isEditingName.value = false
}

const cancelNameEdit = () => {
  editableName.value = props.organization.name
  isEditingName.value = false
}

const cardUrl = computed(() => {
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=100&center=lonlat:${props.organization.address.longitude},${props.organization.address.latitude}&zoom=15&marker=lonlat:${props.organization.address.longitude},${props.
    organization.address.latitude}&apiKey=30781e0659664c018fbf73d06c0849cf`

})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pa-4">
        <div
          v-if="isEditingName"
          class="d-flex align-center gap-4"
        >
          <VTextarea
            v-model="editableName"
            auto-grow
            rows="1"
            hide-details
            class="text-h5 font-weight-bold"
            @keydown.enter.prevent="saveName"
          />
          <div class="d-flex align-center gap-2 mt-2">
            <VBtn
              size="small"
              color="primary"
              @click="saveName"
            >
              Сохранить
            </VBtn>
            <VBtn
              size="small"
              variant="text"
              @click="cancelNameEdit"
            >
              Отмена
            </VBtn>
          </div>
        </div>
        <h5
          v-else
          class="text-h5 font-weight-bold cursor-pointer"
          @click="isEditingName = true"
        >
          {{ editableName }}
        </h5>

        <span>{{ getCityName(organization.address.city) }}, {{ organization.address.address }}</span>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VImg :src="cardUrl"`/>
<!--      <OrganizationTwogisMap-->
<!--        :latitude="Number(organization.address.latitude)"-->
<!--        :longitude="Number(organization.address.longitude)"-->
<!--        api-key="142be1a7-aa84-4b5b-9a8d-1c05f09d518d"-->
<!--      />-->
    </VCol>
  </VRow>

  <div class="d-flex flex-column">
    <VCol class="pa-0 mt-4">
      <div
        class="d-flex align-center justify-space-between cursor-pointer"
        @click="handleEditRubrics"
      >
        <h6 class="text-h6 mb-2 font-weight-bold">
          Рубрики:
        </h6>
      </div>

      <VCard class="pa-4">
        <div class="d-flex flex-wrap ga-2">
          <VChip
            v-for="rubric in localRubrics"
            :key="rubric.name"
            class="cursor-pointer"
            :color="rubric.type === 'primary' ? 'primary' : 'default'"
            variant="tonal"
            size="small"
            @click="handleEditRubrics"
          >
            {{ rubric.name }}
          </VChip>
          <VBtn
            v-if="localRubrics.length === 0"
            variant="tonal"
            color="primary"
            size="small"
            class="mt-2"
            @click="handleEditRubrics"
          >
            <VIcon
              start
              icon="bx-plus"
            />
            Добавить рубрики
          </VBtn>
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
      <div
        class="d-flex align-center justify-space-between mb-2 cursor-pointer"
        @click="handleEditSchedule"
      >
        <h6 class="text-h6 font-weight-bold">
          Время работы:
        </h6>
      </div>

      <VList
        v-if="groupedSchedules.length > 0"
        density="compact"
        class="pa-0"
        style="background-color: transparent"
      >
        <VListItem
          v-for="group in groupedSchedules"
          :key="group.dayRange"
          class="px-0"
        >
          <VListItemTitle class="d-flex justify-space-between align-center">
            <span>{{ group.dayRange }}</span>

            <VCard
              class="pa-2 cursor-pointer"
              @click="handleEditSchedule"
            >
              <span class="font-weight-bold">{{ group.time }}</span>
            </VCard>
          </VListItemTitle>
        </VListItem>
      </VList>
      <VBtn
        v-else
        variant="tonal"
        color="primary"
        class="mt-2 pa-2"
        size="small"
        @click="handleEditSchedule"
      >
        <VIcon
          start
          icon="bx-plus"
        />
        Указать время работы
      </VBtn>
    </VCol>

    <VDivider class="mt-4" />

    <VCol class="pa-0">
      <div class="d-flex align-center">
        <VSwitch
          v-model="localIsTemporaryClosed"
          color="red"
          label="Временно закрыта"
          @update:model-value="handleSaveTempClosed"
          hide-details
        />
      </div>
    </VCol>
  </div>

  <EditRubricsDialog
    v-model="showEditRubricsDialog"
    :rubrics="localRubrics"
    :organization-id="props.organization.id"
    @save="handleSaveRubrics"
  />

  <EditScheduleDialog
    v-model="showEditScheduleDialog"
    :working-schedules="localSchedule.entries"
    :schedule-id="localSchedule.id"
    @save="handleSaveSchedules"
  />
</template>

<style>
.disabled-placement-container {
  position: relative;
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
  z-index: 10;
}
</style>
