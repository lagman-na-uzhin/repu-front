<script setup lang="ts">
import { IGooglePlacementSearchResponse } from "@/shared/api/google/dto/google-placement-search.response"
import { computed, onUnmounted, ref, watch } from 'vue'
import type { AddOrganizationPayload, PlacementPayload } from '@/shared/api/organization/organization-api.dto.in' // Добавил PlacementPayload
import { useAuthStore } from '@/stores/auth.store'
import { getPlatformPngAddress } from '@core/utils/getPlatformIcon'
import { API } from '@/shared/api'
import type { IYandexPlacementSearchResponse } from '@/shared/api/yandex/dto/yandex-placement-search.response'
import type { ITwogisPlacementSearchResponse } from '@/shared/api/twogis/dto/twogis-placement-search.response'
import { TWOGIS_CITIES } from '@/shared/api/twogis/twogis-api'
import { useOrganizationStore } from '@/stores/organization.store'

const organizationStore = useOrganizationStore()
const authStore = useAuthStore()

const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return function (...args: any[]) {
    const context = this

    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), delay)
  }
}

const isPreloaderForm = ref(false)
const isPreloaderList = ref(false)
const isLoadedSuccess = ref(true)
const isSearchNotFound = ref(false)
const searchQuery = ref('')
const combinedList = ref<Array<
  (IYandexPlacementSearchResponse & { source: 'YANDEX' }) |
  (ITwogisPlacementSearchResponse & { source: 'TWOGIS' }) |
  (IGooglePlacementSearchResponse & { source: 'GOOGLE' })
>>([])

const city = ref('almaty')
const addPersonalCabinet = ref(false)
const login = ref('')
const password = ref('')
const map = ref<any>(null)
const mapMarker = ref<any>(null)
const companyId = ref(authStore.user?.companyId)


const fetchGoogleList = async () => {
  const { requestStatus, data } = await API.GOOGLE.getSearchList(
    searchQuery.value + " " + city.value,
    city.value,
  )

  console.log(data, "data")
  if (requestStatus) {
    const { items } = data.result

    console.log(items.map(item => ({ ...item, source: 'GOOGLE' })), "result.items.filter(item => item.name && item.id).map(item => ({ ...item, source: 'GOOGLE' }))")
    if (items.length)
      return items.map(item => ({ ...item, source: 'GOOGLE' }))
  }

  return []
}


const fetchYandexList = async () => {
  const { requestStatus, data } = await API.YANDEX.getSearchList(
    searchQuery.value,
    city.value,
  )

  if (requestStatus) {
    const { result } = data
    if (result && result?.items)
      return result.items.filter((item: any) => item?.name && item?.id).map((item: any) => ({ ...item, source: 'YANDEX' }))
  }

  return []
}

const fetchTwogisList = async () => {
  const { requestStatus, data } = await API.TWOGIS.getSearchList(
    searchQuery.value,
    city.value,
  )

  if (requestStatus) {
    const { result } = data
    if (result && result?.items)
      return result.items.filter((item: any) => item?.name && item?.id).map((item: any) => ({ ...item, source: 'TWOGIS' }))
  }

  return []
}

const fetchCombinedList = async () => {
  isPreloaderList.value = true
  isSearchNotFound.value = false
  isLoadedSuccess.value = true

  let yandexResults: (IYandexPlacementSearchResponse & { source: 'YANDEX' })[] = []
  let twogisResults: (ITwogisPlacementSearchResponse & { source: 'TWOGIS' })[] = []
  let googleResults: (IGooglePlacementSearchResponse & { source: 'GOOGLE' })[] = []

  try {
    // Determine which sources to fetch based on selected organizations
    const hasYandexSelected = selectedOrganizations.value.some(org => org.source === 'YANDEX')
    const hasTwogisSelected = selectedOrganizations.value.some(org => org.source === 'TWOGIS')
    const hasGoogleSelected = selectedOrganizations.value.some(org => org.source === 'GOOGLE')

    const fetchPromises = []
    if (!hasYandexSelected) { // Only fetch Yandex if no Yandex organization is already selected
      fetchPromises.push(fetchYandexList())
    }
    else {
      fetchPromises.push(Promise.resolve([])) // Return empty if already selected
    }
    if (!hasTwogisSelected) { // Only fetch 2GIS if no 2GIS organization is already selected
      fetchPromises.push(fetchTwogisList())
    }
    else {
      fetchPromises.push(Promise.resolve([])) // Return empty if already selected
    }
    if (!hasGoogleSelected) {
      fetchPromises.push(fetchGoogleList())
    } else {
      fetchPromises.push(Promise.resolve([]))
    }

    [yandexResults, twogisResults, googleResults] = await Promise.all(fetchPromises)
  }
  catch (error) {
    console.error('Error fetching search lists:', error)
    isLoadedSuccess.value = false
  }
  finally {
    combinedList.value = [...yandexResults, ...twogisResults, ...googleResults]
    if (combinedList.value.length === 0 && searchQuery.value)
      isSearchNotFound.value = true

    isPreloaderList.value = false
  }
}

interface SelectedOrganizationType {
  login?: string
  password?: string
  source?: 'YANDEX' | 'TWOGIS' | 'GOOGLE'
  orgId?: string | number
  name?: string
  address?: string
  type?: string
  city?: string
}

const selectedOrganizations = ref<Array<SelectedOrganizationType>>([])

const filteredCombinedList = computed(() => {
  if (!combinedList.value.length)
    return []

  const hasYandexSelected = selectedOrganizations.value.some(org => org.source === 'YANDEX')
  const hasTwogisSelected = selectedOrganizations.value.some(org => org.source === 'TWOGIS')
  const hasGoogleSelected = selectedOrganizations.value.some(org => org.source === 'GOOGLE')

  return combinedList.value.filter(item => {
    if (hasYandexSelected && item.source === 'YANDEX')
      return false

    if (hasTwogisSelected && item.source === 'TWOGIS')
      return false

    return !(hasGoogleSelected && item.source === 'GOOGLE');


  })
})

const onSearch = debounce(() => {
  fetchCombinedList()
}, 500)

watch(city, () => {
  if (map.value && city.value) {
    const foundCity = TWOGIS_CITIES.find(
      cityObj => cityObj.value === city.value,
    )

    if (foundCity)
      map.value.setView([foundCity.center.lat, foundCity.center.lon], 13)
  }
  fetchCombinedList()
})

watch(selectedOrganizations, () => {
  fetchCombinedList()
}, { deep: true })

onUnmounted(() => {
  if (map.value?.remove)
    map.value.remove()
})

const selectOrganization = (
  organization: (IYandexPlacementSearchResponse | ITwogisPlacementSearchResponse),
  source: 'YANDEX' | 'TWOGIS',
  points?: { lat: number; lon: number },
) => {
  let orgToAdd: SelectedOrganizationType | null = null

  if (source === 'YANDEX') {
    orgToAdd = {
      orgId: (organization as IYandexPlacementSearchResponse).id,
      name: (organization as IYandexPlacementSearchResponse).name,
      address: (organization as IYandexPlacementSearchResponse).address_name,
      type: (organization as IYandexPlacementSearchResponse).type,
      source: 'YANDEX',
      login: login.value,
      password: password.value,
    }
  }
  else if (source === 'TWOGIS') {
    const cityAlias = (organization as ITwogisPlacementSearchResponse)?.adm_div?.find(item => item.city_alias)?.city_alias

    orgToAdd = {
      orgId: (organization as ITwogisPlacementSearchResponse).id,
      name: (organization as ITwogisPlacementSearchResponse).name,
      address: (organization as ITwogisPlacementSearchResponse).address_name,
      type: (organization as ITwogisPlacementSearchResponse).type,
      city: cityAlias,
      source: 'TWOGIS',
      login: login.value,
      password: password.value,
    }
    if (map.value && points) {
      const { lat, lon } = points
      if (typeof DG !== 'undefined' && DG.default && typeof DG.default.marker === 'function') {
        if (!mapMarker?.value)
          mapMarker.value = DG.default.marker([lat, lon]).addTo(map.value)
        else
          mapMarker.value.setLatLng([lat, lon])

        map.value.setView([lat, lon], 16)
      }
      else {
        console.warn('DG.default.marker is not available. Map marker functionality skipped.')
      }
    }
  } else if (source === 'GOOGLE') {
    orgToAdd = {
      orgId: (organization as IGooglePlacementSearchResponse).id,
      name: (organization as IGooglePlacementSearchResponse).name,
      address: (organization as IGooglePlacementSearchResponse).address_name,
      type: (organization as IGooglePlacementSearchResponse).type,
      city: city.value,
      source: 'GOOGLE',
      login: login.value,
      password: password.value,
    }

    if (map.value && (organization as IGooglePlacementSearchResponse).location) {
      const { lat, lng } = (organization as IGooglePlacementSearchResponse).location
      if (typeof DG !== 'undefined' && DG.default && typeof DG.default.marker === 'function') {
        if (!mapMarker?.value)
          mapMarker.value = DG.default.marker([lat, lng]).addTo(map.value)
        else
          mapMarker.value.setLatLng([lat, lng])

        map.value.setView([lat, lng], 16)
      }
    }
  }


  if (orgToAdd) {
    // First, remove any existing organization from the same source
    selectedOrganizations.value = selectedOrganizations.value.filter(
      org => org.source !== orgToAdd?.source,
    )

    // Then add the new organization
    selectedOrganizations.value.push(orgToAdd)
  }
}

const removeSelectedOrganization = (orgId: string | number, source: string) => {
  selectedOrganizations.value = selectedOrganizations.value.filter(
    org => !(org.orgId === orgId && org.source === source),
  )
}

const submit = async () => {
  if (!companyId.value) {
    alert('Пожалуйста, укажите ID компании, название организации и выберите хотя бы одно размещение.')
    return
  }
  isPreloaderForm.value = true

  const payload: AddOrganizationPayload = {
    companyId: companyId.value,
    groupId: null, //TODO MOCK,
    city: city.value,
    externalId: String(selectedOrganizations.value[0].orgId),
    platform: "TWOGIS"
  };

  try {
    await organizationStore.addOrganization(payload); // Вызываем addOrganization
    selectedOrganizations.value = []
    searchQuery.value = ''
    login.value = ''
    password.value = ''
    addPersonalCabinet.value = false
    alert('Организация успешно добавлена!'); // Оповещение об успехе
  } catch (error) {
    console.error('Ошибка при добавлении организации:', error);
    alert('Произошла ошибка при добавлении организации.'); // Оповещение об ошибке
  } finally {
    isPreloaderForm.value = false
  }
}

const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

const isEmailValid = computed(() => {
  return emailRegex.test(login.value)
})

const isItemSelected = (item: any) => {
  return selectedOrganizations.value.some(
    org => org.orgId === item.id && org.source === item.source,
  )
}
</script>

<template>
  <VRow>
    <VCol
      md="6"
      offset="md-3"
    >
      <VCard title="Добавить организацию">
        <VCardText>
          <div class="mb-2 font-weight-medium">
            Выберите город и введите название в поле поиска:
          </div>
          <div>
            <label class="v-label text-body-2 mb-2">Город</label>
            <VSelect
              v-model="city"
              :items="TWOGIS_CITIES"
              item-value="value"
              item-title="name"
            />
          </div>
          <label class="v-label text-body-2 mt-4 mb-2">Поиск размещений</label>
          <VTextField
            v-model="searchQuery"
            class="w-100"
            prepend-inner-icon="bx-search"
            placeholder="Поиск по названию в Яндекс и 2GIS..."
            @input="onSearch"
          />

          <div
            v-if="selectedOrganizations.length > 0"
            class="mt-4"
          >
            <div class="font-weight-medium mb-2">
              Выбранные размещении вашей организации:
            </div>
            <div
              v-for="org in selectedOrganizations"
              :key="`${org.source}-${org.orgId}`"
              class="d-flex justify-content-between align-items-center bg-primary-lighten-5 rounded-lg mb-2"
              style="border: 1px solid #e0e0e0;"
            >
              <div class="px-6 py-4">
                <div class="font-weight-medium">
                  {{ org.name }}
                </div>
                <div>{{ org.address }}</div>
                <div class="text-caption font-italic d-flex align-center">
                  <img
                    style="max-width: 20px; margin-right: 5px;"
                    :src="getPlatformPngAddress(org.source!)"
                  >
                  {{ org.source }}
                </div>
              </div>
              <VBtn
                flat
                variant="text"
                icon="bx-x"
                class="mr-2"
                color="red"
                @click="removeSelectedOrganization(org.orgId!, org.source!)"
              >
                <VIcon
                  size="24"
                  icon="bx-x"
                />
              </VBtn>
            </div>
          </div>

          <div v-if="!selectedOrganizations.length || searchQuery">
            <BasePreloader
              v-if="isPreloaderList"
              class="pt-8"
            />
            <BaseErrorFetch
              v-else-if="!isPreloaderList && !isLoadedSuccess && searchQuery"
              class="mt-4"
            />
            <div
              v-else-if="!combinedList.length && isSearchNotFound"
              class="mt-4 font-weight-medium text-center"
            >
              Поиск ничего не нашел<br>
              Название должно быть как в Яндекс или 2GIS...<br>
              Попробуйте изменить написание
            </div>
            <VList
              v-else-if="!isSearchNotFound && searchQuery && filteredCombinedList.length"
              class="scrollable-list"
            >
              <VListItem
                v-for="(item, index) in filteredCombinedList"
                :key="`${item.source}-${item.id}-${index}`"
                :value="item.id"
                :class="{ 'v-list-item--active': isItemSelected(item) }"
                @click="selectOrganization(item, item.source, (item as ITwogisPlacementSearchResponse).point)"
              >
                <VListItemTitle class="py-2">
                  <div class="font-weight-bold d-flex align-center">
                    {{ item.name }}
                    <span class="text-caption font-italic ml-2">
                      <img
                        style="max-width: 20px"
                        :src="getPlatformPngAddress(item.source)"
                      >
                    </span>
                  </div>
                  <div>{{ item.address_name }}</div>
                </VListItemTitle>
              </VListItem>
            </VList>
            <VAlert
              v-else-if="!filteredCombinedList.length && searchQuery && !isPreloaderList"
              type="info"
              variant="outlined"
              class="mt-4"
            >
              Все доступные размещения из "{{ searchQuery }}" уже выбраны или не найдены.
            </VAlert>
          </div>
        </VCardText>
        <VCardText>
          <div v-if="addPersonalCabinet">
            <label class="v-label text-body-2 mt-4 mb-2">Логин</label>
            <AppTextField
              v-model="login"
              type="email"
              class="w-100"
              placeholder="Логин от личного кабинета организации"
            />
            <div
              v-if="!isEmailValid && login.length > 0"
              class="text-error mt-2"
            >
              Пожалуйста, введите действительный адрес электронной почты
            </div>
            <label class="v-label text-body-2 mt-4 mb-2">Пароль</label>
            <AppTextField
              v-model="password"
              type="password"
              class="w-100"
              placeholder="Пароль от личного кабинета организации"
            />
          </div>
        </VCardText>
        <VCardText class="d-flex justify-space-between">
          <VBtn
            text="Добавить"
            :loading="isPreloaderForm"
            @click="submit"
          >
            Сохранить
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.border-radius {
  border-radius: 8px;
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
}

.v-list-item--active {
  background-color: #e0f2f7;
}
</style>
