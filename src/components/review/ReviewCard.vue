<script setup>
import { defineProps } from 'vue'
import { getPlatformPngAddress } from '@/@core/utils/getPlatformIcon.ts'

const props = defineProps({
  review: {
    type: Object,
    required: true,
    validator: value => {
      return (
        typeof value.id === 'number'
        && typeof value.profile === 'object'
        && typeof value.profile.firstname === 'string'
        && typeof value.text === 'string'
        && typeof value.rating === 'number'
        && typeof value.date === 'string'
        && ['2Gis', 'Google Maps', 'Yandex Maps'].includes(value.platform)
      )
    },
  },
})
</script>

<template>
  <VCard
    class="review-card pa-4"
    outlined
  >
    <VRow
      align="center"
      no-gutters
    >
      <VCol
        cols="auto"
        class="mr-3"
      >
        <VAvatar size="56">
          <VImg
            :src="review.profile.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'"
            alt="Аватар автора"
          />
        </VAvatar>
      </VCol>
      <VCol>
        <div class="text-subtitle-1 font-weight-medium">
          {{ review.profile.firstname }}
        </div>
        <div class="text-caption text-grey">
          {{ review.date }}
        </div>
        <VRating
          :model-value="review.rating"
          color="amber"
          density="compact"
          half-increments
          readonly
          size="x-small"
          class="mt-1"
        />
      </VCol>
      <VCol
        cols="auto"
        class="ml-auto"
      >
        <img
          style="max-width: 30px"
          :src="getPlatformPngAddress(review.platform)"
        >
      </VCol>
    </VRow>

    <div class="review-card__text mt-4 text-body-1">
      {{ review.text }}
    </div>
  </VCard>
</template>

<style scoped>
.review-card {
  border-radius: 8px;
}

.review-card__text {
  white-space: pre-wrap; /* Сохраняет переносы строк в тексте отзыва */
}
</style>
