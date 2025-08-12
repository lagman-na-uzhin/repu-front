<template>
  <div>
    <div class="d-flex text-h5 align-center justify-center text-center mb-4">
      Организация, которую вы хотите добавить, уже размещена хотя бы на одной из карт (Google Maps, 2ГИС или Яндекс.Карты)?
    </div>
    <div class="d-flex flex-column gap-2">
      <VBtn color="primary" @click="$emit('select', true)">Да, размещена</VBtn>
      <VBtn color="secondary" @click="$emit('select', false)">Нет, не размещена</VBtn>
    </div>
  </div>
</template>
