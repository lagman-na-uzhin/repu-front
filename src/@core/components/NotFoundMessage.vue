<template>
  <div :class="['not-found-message', `not-found-message--${size}`]">
    <div class="not-found-message__icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    <p class="not-found-message__text">{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: 'Ничего не найдено.',
  },
  size: {
    type: String,
    default: 'medium', // Default size
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
});
</script>

<style scoped>
/* Base styles */
.not-found-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  min-height: 100px;
  text-align: center;
  color: #666;
  padding: 16px;
  /* Add a transition for smoother size changes */
  transition: all 0.2s ease-in-out;
}

.not-found-message__icon {
  margin-bottom: 8px;
  transition: margin-bottom 0.2s ease-in-out;
}

.not-found-message__icon svg {
  color: #999;
  transition: all 0.2s ease-in-out;
}

.not-found-message__text {
  font-weight: 500;
  transition: font-size 0.2s ease-in-out;
}

/* --- Size-specific styles --- */

/* Small size */
.not-found-message--small {
  min-height: 80px;
  padding: 12px;
}
.not-found-message--small .not-found-message__icon {
  margin-bottom: 4px;
}
.not-found-message--small .not-found-message__icon svg {
  width: 32px; /* Smaller icon */
  height: 32px;
}
.not-found-message--small .not-found-message__text {
  font-size: 0.9em; /* Smaller text */
}

/* Medium size (default) */
.not-found-message--medium {
  /* These are essentially the current default sizes */
  min-height: 100px;
  padding: 16px;
}
.not-found-message--medium .not-found-message__icon {
  margin-bottom: 8px;
}
.not-found-message--medium .not-found-message__icon svg {
  width: 48px; /* Medium icon */
  height: 48px;
}
.not-found-message--medium .not-found-message__text {
  font-size: 1em; /* Medium text */
}

/* Large size */
.not-found-message--large {
  min-height: 120px;
  padding: 20px;
}
.not-found-message--large .not-found-message__icon {
  margin-bottom: 12px;
}
.not-found-message--large .not-found-message__icon svg {
  width: 64px; /* Larger icon */
  height: 64px;
}
.not-found-message--large .not-found-message__text {
  font-size: 1.2em; /* Larger text */
}
</style>
