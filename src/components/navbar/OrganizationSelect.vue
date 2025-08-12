<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { API } from '@/shared/api'
import type { IOrganization } from '@core/model/default/organization'
import { useAuthStore } from '@/stores/auth.store'


const organization = ref<IOrganization | null>(null)

const organizations = ref<IOrganization[]>([{ id: null, name: 'Все организации' }])

const page = ref(1)
const pageSize = 10
const isLoading = ref(false)
const hasMore = ref(true) // <--- Initialize hasMore to true here

const menu = ref(false)

async function fetchOrganizations() {
  if (isLoading.value || !hasMore.value)
    return
  isLoading.value = true

  try {
    const { success, data } = await API.ORGANIZATION.getListByUser()

    if (success && data) { // Check for data existence
      if (data.list.length > 0) {
        hasMore.value = data.length === pageSize

        organizations.value = [
          organizations.value[0],
          ...organizations.value.slice(1),
          ...data.list,
        ];
        page.value += 1;
      } else {
        hasMore.value = false
      }
    } else {
      hasMore.value = false
    }
  }
  finally {
    isLoading.value = false
    console.log(organizations.value, "orgsssssssssss")
  }
}

watch(menu, opened => {
  if (opened && hasMore.value && !isLoading.value) {
    fetchOrganizations()
  }
})
</script>

<template>
  <VSelect
    v-model="organization"
    :items="organizations"
    item-value="id"
    item-title="name"
    variant="filled"
    hide-details
    hide-selected
    density="comfortable"
    class="pa-5"
    :menu="menu"
    no-data-text=""
    @update:menu="menu = $event"
  >
    <template #append-item>
      <div v-if="organizations.length > 1">
        <div class="pa-2 text-center">
          <VBtn
            v-if="hasMore"
            :loading="isLoading"
            class="text-subtitle-2"
            variant="plain"
            @click="fetchOrganizations"
          >
            Загрузить ещё
          </VBtn>
        </div>
      </div>

      <div
        v-else
        class="pa-4 text-center text-subtitle-2 d-flex flex-column align-center justify-center"
      >
        <VIcon
          icon="bx-buildings"
          size="32"
          class="mb-2"
        />
        Организаций пока нет
      </div>

      <div
        class="pa-2 text-center w-10"
        @mousedown.stop
      >
        <AddOrganizationBtn variant="text" />
      </div>
    </template>
  </VSelect>
</template>
