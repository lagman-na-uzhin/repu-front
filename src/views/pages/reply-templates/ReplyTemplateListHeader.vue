<template>
  <div class="mb-4 d-flex align-center justify-space-between">
    <span class="text-h5 font-weight-medium">
      Шаблоны Ответов
    </span>
    <VBtn
      color="primary"
      @click="console.log('Добавить шаблон')"
    >
      <template #default>
        <VIcon icon="bx-plus" />
        Добавить
      </template>
    </VBtn>
  </div>
</template>
