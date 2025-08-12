<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import { type Manager } from '@/@core/model/default/manager'

const props = defineProps({
  manager: {
    type: Object as PropType<Manager>,
    required: true,
  },
})

const iconName = 'ic:baseline-support-agent'
</script>

<template>
  <div
    outlined
    elevation="2"
  >
    <VCardText class="d-flex align-center pa-0">
      <div class="support-avatar">
        <Icon
          :icon="iconName"
          class="avatar-icon"
        />
      </div>
      <div class="ms-4">
        <div class="support-name">
          {{ manager.name }}
        </div>
        <div class="support-phone">
          {{ manager.phone }}
        </div>
        <div class="support-email">
          {{ manager.email }}
        </div>
      </div>
    </VCardText>
  </div>
</template>

<style scoped>
.support-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon {
  width: 32px;
  height: 32px;
  color: var(--v-theme-primary);
}
.support-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--v-theme-on-surface-variant);
}
.support-email {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.support-phone {
  font-size: 0.8rem;
  font-weight: 200;
  color: var(--v-theme-on-surface-variant);
}
</style>
