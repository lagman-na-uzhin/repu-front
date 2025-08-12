<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="text-h6">Название и филиалы</v-card-title>
      <v-card-text>
        <v-btn
          block
          variant="text"
          class="justify-start text-none"
          @click="openDialog('companyName', company.name, 'Название компании')"
        >
          <i class="bx bx-building-house mr-2"></i> {{ company.name || 'Название компании не указано' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Адрес и ИНН</v-card-title>
      <v-card-text>
        <v-row no-gutters align="center">
          <v-col cols="10">
            <v-btn
              block
              variant="text"
              class="justify-start text-none"
              @click="openDialog('address', company.address, 'Адрес')"
            >
              <i class="bx bx-map-alt mr-2"></i> {{ company.address || 'Адрес не указан' }}
            </v-btn>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn icon variant="text" @click="viewOnMap(company.address)">
              <i class="bx bx-map-pin"></i>
            </v-btn>
          </v-col>
        </v-row>

        <v-btn
          block
          variant="text"
          class="justify-start text-none mt-2"
          @click="openDialog('tin', company.tin, 'ИНН')"
        >
          <i class="bx bx-credit-card mr-2"></i> {{ company.tin || 'ИНН не указан' }}
        </v-btn>

        <v-card flat class="mt-4 pa-0 map-card">
          <iframe
            :src="mapEmbedUrl"
            width="100%"
            height="200"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="rounded-lg embedded-map"
          ></iframe>
        </v-card>

      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Сферы деятельности</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          variant="text"
          class="justify-start text-none"
          @click="openDialog('activities', company.activities.join(', '), 'Сферы деятельности')"
        >
          <i class="bx bx-briefcase mr-2"></i> {{ company.activities.length ? company.activities.join(', ') : 'Сферы деятельности не указаны' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Контакты</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('phone', company.phone, 'Номер телефона')"
        >
          <i class="bx bx-phone mr-2"></i> {{ company.phone || 'Номер телефона не указан' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('email1', company.email1, 'Электронная почта')"
        >
          <i class="bx bx-envelope mr-2"></i> {{ company.email1 || 'Email не указан' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('email2', company.email2, 'Дополнительная почта')"
        >
          <i class="bx bx-envelope-open mr-2"></i> {{ company.email2 || 'Дополнительная почта не указана' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none"
          @click="openDialog('website', company.website, 'Веб-сайт')"
        >
          <i class="bx bx-world mr-2"></i> {{ company.website || 'Веб-сайт не указан' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Мессенджеры</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('telegram', company.messengers.telegram, 'Telegram')"
        >
          <i class="bx bxl-telegram mr-2"></i> {{ company.messengers.telegram || 'Добавить Telegram' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('viber', company.messengers.viber, 'Viber')"
        >
          <i class="bx bxl-viber mr-2"></i> {{ company.messengers.viber || 'Добавить Viber' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('whatsapp', company.messengers.whatsapp, 'WhatsApp')"
        >
          <i class="bx bxl-whatsapp mr-2"></i> {{ company.messengers.whatsapp || '+7 7022393850' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Социальные сети</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('instagram', company.social.instagram, 'Instagram')"
        >
          <i class="bx bxl-instagram mr-2"></i> {{ company.social.instagram || 'Instagram не указан' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none mb-2"
          @click="openDialog('facebook', company.social.facebook, 'Facebook')"
        >
          <i class="bx bxl-facebook-square mr-2"></i> {{ company.social.facebook || 'Facebook не указан' }}
        </v-btn>
        <v-btn
          block
          outlined
          class="justify-start text-none"
          @click="openDialog('tiktok', company.social.tiktok, 'TikTok')"
        >
          <i class="bx bxl-tiktok mr-2"></i> {{ company.social.tiktok || 'TikTok не указан' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Время работы</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          class="justify-start text-none"
          @click="openDialog('workingHours', company.workingHours, 'Время работы')"
        >
          <i class="bx bx-time mr-2"></i> {{ company.workingHours || 'Время работы не указано' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Компания работает</v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          class="justify-start text-none"
          @click="openDialog('workingDescription', company.workingDescription, 'Описание работы')"
        >
          <i class="bx bx-info-circle mr-2"></i> {{ company.workingDescription || 'Информация не заполнена' }}
        </v-btn>
        <p class="text-caption mt-2">Если филиал временно не работает, укажите эту информацию для ваших клиентов</p>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedValue"
            :label="dialogLabel"
            clearable
            outlined
            dense
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">
            Назад
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveChanges"
            :disabled="!hasChanged"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mt-8 text-center" flat>
      <v-btn color="error" text @click="deleteCompany">
        <i class="bx bx-trash mr-2"></i> Удалить компанию
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SocialData {
  instagram: string;
  facebook: string;
  tiktok: string;
}

interface MessengerData {
  telegram: string;
  viber: string;
  whatsapp: string;
}

interface CompanyData {
  name: string;
  address: string;
  tin: string;
  activities: string[];
  phone: string;
  email1: string;
  email2: string;
  website: string;
  messengers: MessengerData;
  social: SocialData;
  workingHours: string;
  workingDescription: string;
}

const dialog = ref(false);
const dialogTitle = ref('');
const dialogLabel = ref('');
const editedField = ref<string | null>(null);
const originalValue = ref('');
const editedValue = ref('');

const company = ref<CompanyData>({
  name: 'excourse, образовательный центр',
  address: 'микрорайон Самал-2, 58, Алматы', // Уточнил адрес
  tin: '1234567890',
  activities: ['Перевод с иностранных языков', 'Языковые школы', 'Обучение за рубежом', 'Помощь в обучении', 'Центры раннего развития детей'],
  phone: '+7 700-488-16-36',
  email1: 'sayat.nurly@grafen.kz',
  email2: 'edu.excourse.kzguest-catalog',
  website: 'excourse.kz',
  messengers: {
    telegram: 'excourse_support',
    viber: '+77011234567',
    whatsapp: '+7 7022393850',
  },
  social: {
    instagram: 'excourse.kz',
    facebook: 'excourse.kz',
    tiktok: '@excoursekz',
  },
  workingHours: 'Пн–Сб 10:00 – 20:00',
  workingDescription: 'Обычный режим работы',
});

const hasChanged = computed(() => editedValue.value !== originalValue.value);

const openDialog = (field: string, currentValue: string | string[], label: string) => {
  editedField.value = field;
  originalValue.value = Array.isArray(currentValue) ? currentValue.join(', ') : currentValue;
  editedValue.value = originalValue.value;
  dialogTitle.value = `Редактировать ${label.toLowerCase()}`;
  dialogLabel.value = label;
  dialog.value = true;
};

const saveChanges = () => {
  console.log(`Saving changes for ${editedField.value}: ${editedValue.value}`);

  switch (editedField.value) {
  case 'companyName':
    company.value.name = editedValue.value;
    break;
  case 'address':
    company.value.address = editedValue.value;
    break;
  case 'tin':
    company.value.tin = editedValue.value;
    break;
  case 'activities':
    company.value.activities = editedValue.value.split(',').map(s => s.trim()).filter(s => s);
    break;
  case 'phone':
    company.value.phone = editedValue.value;
    break;
  case 'email1':
    company.value.email1 = editedValue.value;
    break;
  case 'email2':
    company.value.email2 = editedValue.value;
    break;
  case 'website':
    company.value.website = editedValue.value;
    break;
  case 'telegram':
    company.value.messengers.telegram = editedValue.value;
    break;
  case 'viber':
    company.value.messengers.viber = editedValue.value;
    break;
  case 'whatsapp':
    company.value.messengers.whatsapp = editedValue.value;
    break;
  case 'instagram':
    company.value.social.instagram = editedValue.value;
    break;
  case 'facebook':
    company.value.social.facebook = editedValue.value;
    break;
  case 'tiktok':
    company.value.social.tiktok = editedValue.value;
    break;
  case 'workingHours':
    company.value.workingHours = editedValue.value;
    break;
  case 'workingDescription':
    company.value.workingDescription = editedValue.value;
    break;
  default:
    console.warn(`No save logic defined for field: ${editedField.value}`);
  }

  closeDialog();
};

const closeDialog = () => {
  dialog.value = false;
  editedField.value = null;
  originalValue.value = '';
  editedValue.value = '';
};

const mapEmbedUrl = computed(() => {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2905.860166065551!2d76.94284207629555!3d43.23894907110058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3883693e50b73c4d%3A0x675841022e379435!2z0LzQtdC90LXQvdC10YHQutCw0Y8g0KHQvtGA0LPQtdC90L3QvtC_0L7QstCwLTI!5e0!3m2!1sru!2skz!4v1719914022872!5m2!1sru!2skz`;
});


const viewOnMap = (address: string) => {
  if (address) {
    // Открываем Google Maps в новой вкладке для полной версии карты
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  } else {
    alert('Адрес не указан.');
  }
};

const deleteCompany = () => {
  if (confirm('Вы уверены, что хотите удалить эту компанию? Это действие необратимо.')) {
    console.log('Компания удалена.');
    // Implement actual deletion logic here (API call, navigate away, etc.)
  }
};
</script>

<style scoped>
.v-btn.justify-start.text-none {
  text-transform: none !important;
  justify-content: flex-start !important;
  padding-left: 16px !important;
}

/* Base Boxicon style */
.bx {
  font-family: 'boxicons' !important;
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
}

/* Стили для контейнера iframe, чтобы соответствовать дизайну Vuetify */
.map-card {
  border-radius: 8px; /* Соответствует rounded-lg Vuetify */
  overflow: hidden;   /* Обрезает углы iframe */
  /* Добавьте тень, если нужно, чтобы карта выглядела как отдельный блок */
  /* box-shadow: 0 4px 8px rgba(0,0,0,0.1); */
}

.embedded-map {
  width: 100%;
  height: 200px; /* Фиксированная высота, как в вашем макете */
  border-radius: 8px; /* Для iframe */
}
</style>
