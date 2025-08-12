<script lang="ts">
import { defineComponent, h, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { syncRef, useToggle } from '@vueuse/core'

import { VCol } from 'vuetify/components'
import VerticalNav from '@layouts/components/VerticalNav.vue'

export default defineComponent({
  setup(props, { slots }) {
    const isOverlayNavActive = ref(false)
    const isLayoutOverlayVisible = ref(false)
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)

    const route = useRoute()
    const { mdAndDown, lgAndUp } = useDisplay()

    syncRef(isOverlayNavActive, isLayoutOverlayVisible)

    const closeOverlay = () => {
      isOverlayNavActive.value = false
    }

    return () => {
      const desktopNav = h(
        'div',
        {
          class: ['d-none d-lg-flex flex-column h-100'],
          style: '',
        },
        [
          slots['vertical-nav-header']?.({ toggleIsOverlayNavActive }),
          slots['before-vertical-nav-items']?.(),
          slots['vertical-nav-content']?.(),
          slots['after-vertical-nav-items']?.(),
        ],
      )

      const mobileOverlayNav = h(
        VerticalNav,
        {
          isOverlayNavActive: isOverlayNavActive.value,
          toggleIsOverlayNavActive,
          temporary: true,
          fixed: true,
          location: 'left',
          width: 260,
          style: mdAndDown.value ? '' : 'display: none !important;',
        },
        {
          'nav-header': () => slots['vertical-nav-header']?.({ toggleIsOverlayNavActive }),
          'before-nav-items': () => slots['before-vertical-nav-items']?.(),
          'default': () => slots['vertical-nav-content']?.(),
          'after-nav-items': () => slots['after-vertical-nav-items']?.(),
        },
      )

      // 3. Navbar (Шапка) - Оборачиваем в VContainer для ограничения ширины
      const navbar = h(
        'header',
        { class: ['layout-navbar navbar-blur'] },
        [
          h(
            'div',
            { class: 'navbar-content-container' },
            h(
              'div',
              { class: 'v-container pa-0 w-100 d-flex align-center' }, // pa-0 для контроля паддингов, w-100 для полной ширины VContainer
              slots.navbar?.({
                toggleVerticalOverlayNavActive: toggleIsOverlayNavActive,
              }),
            ),
          ),
        ],
      )

      const main = h(
        'main',
        { class: 'layout-page-content' },
        [
          h(
            'div', // Это ваш текущий 'page-content-container'
            { class: 'page-content-container h-100' }, // Добавляем h-100
            h(
              'div', // Дополнительный контейнер для всей внутренней части (сайбара + контента)
              {
                class: ['v-container pa-0 h-100', // Ограничиваем ширину основного контента
                  { 'layout-content-width-container': true }], // Добавим свой класс для стилизации ширины
              },
              h(
                'div', // VRow (в render function это просто div с классом)
                { class: 'v-row no-gutters h-100' }, // no-gutters для контроля отступов
                [
                  // Колонка для десктопной навигации
                  lgAndUp.value && h(VCol, { cols: 12, lg: 2, class: 'pa-0 d-flex flex-column' }, [
                    desktopNav,
                  ]),

                  // Колонка для основного содержимого страницы
                  h(
                    VCol,
                    {
                      cols: 12,
                      lg: lgAndUp.value ? 10 : 12, // Если есть сайдбар (lgAndUp), то 10 колонок, иначе все 12
                      class: 'pa-0 d-flex flex-column h-100', // Убираем дефолтный паддинг VCol
                    },
                    h('div', { class: 'v-container pa-6 flex-grow-1' }, slots.default?.()), // Внутренний контейнер для отступов контента
                  ),
                ],
              ),
            ),
          ),
        ],
      )

      // 5. Footer (Футер) - Оборачиваем в VContainer для ограничения ширины
      const footer = h(
        'footer',
        { class: 'layout-footer' },
        [
          h(
            'div',
            { class: 'footer-content-container' },
            h(
              'div', // Новый внутренний контейнер для ограничения ширины
              { class: 'v-container pa-0 w-100' }, // pa-0 для контроля паддингов, w-100 для полной ширины VContainer
              slots.footer?.(),
            ),
          ),
        ],
      )

      // 6. Overlay - Оставляем как есть
      const layoutOverlay = h(
        'div',
        {
          class: ['layout-overlay', { visible: isLayoutOverlayVisible.value }],
          onClick: closeOverlay,
        },
      )

      // Возвращаем корневую структуру макета
      return h(
        'div',
        {
          class: [
            'layout-wrapper layout-nav-type-vertical layout-navbar-static layout-footer-static layout-content-width-fluid',

            mdAndDown.value && 'layout-overlay-nav', // Оставляем только для мобильных
            route.meta.layoutWrapperClasses,
          ],
        },
        [
          mobileOverlayNav, // Рендерим мобильный оверлей-сайдбар

          h(
            'div',
            { class: 'layout-content-wrapper' },
            [
              navbar,
              main,
              footer,
            ],
          ),
          layoutOverlay,
        ],
      )
    }
  },
})
</script>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    // Убираем padding-inline-start здесь, так как навигация теперь внутри VMain
    padding-inline-start: 0 !important;
    transition: padding-inline-start 0.2s ease-in-out; // Оставляем, на всякий случай
    will-change: padding-inline-start;

    // @media screen and (min-width: 1280px) {
    //   padding-inline-start: variables.$layout-vertical-nav-width; // Убрать
    // }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;
    .navbar-content-container {
      //block-size: variables.$layout-vertical-nav-navbar-height;
      background-color: transparent !important;
      border: none !important;
      margin: 0;
      padding: 0;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            // Если у вас тут `contained` логика, возможно, ее надо адаптировать
          }
          @else {
            // Убираем это правило, так как мы используем VContainer
            // .navbar-content-container {
            //   @include mixins.boxed-content;
            // }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    // @include mixins.boxed-content; // Убираем, так как VContainer теперь внутри
  }
  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: opacity;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden; // Может потребоваться изменить, если контент должен скроллиться
      .page-content-container {
        inline-size: 100%;
      }
    }
  }
}

// Новый класс для ограничения ширины контента, который применяется к VContainer
// Вы можете настроить max-width здесь
.layout-content-width-container {
  max-width: 1440px; // Например, 1440px или 1280px, как вам нравится
  margin-left: auto;
  margin-right: auto;
}
</style>
