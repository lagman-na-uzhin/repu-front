import qs from 'qs'
import Swal from 'sweetalert2'
import errorCodes from '../plugins/request/request-codes/error.json' assert { type: 'json' }
import successCodes from '../plugins/request/request-codes/success.json' assert { type: 'json' }
import { useAuthStore } from '@/stores/auth.store'
import { axiosIns } from '@/plugins/request'

export interface RequestResult<T = any> {
  success: boolean
  statusCode: number
  message: string
  data: T | null
}

const handleUnauthorized = async () => {
  console.log("handleUnauthorized")
  await useAuthStore().handleUnauthorized()
}

const requestHandleMessage = async (type: string, requestCode: string) => {
  if (requestCode?.toLowerCase() === 'unauthorized') {
    await handleUnauthorized()

    return
  }

  if (requestCode === 'Forbidden resource') {
    window.location.href = '/forbidden'

    return
  }

  const errorMessages: Record<string, { title: string; text?: string; icon?: string }> = errorCodes

  if (type === 'ERROR' && errorMessages[requestCode]) {
    Swal.fire({
      target: '.v-application',
      icon: 'error',
      ...errorMessages[requestCode],
    })

    return
  }

  const message
    = type === 'OK' ? successCodes[requestCode] : errorCodes[requestCode]

  if (type === 'OK' && !message)
    return

  Swal.fire(
    message
      ? {
        target: '.v-application',
        position: message.position || (message.toast ? 'top-right' : 'center'),
        timer: message.toast ? 3200 : undefined,
        showConfirmButton: !message.toast,
        ...message,
      }
      : {
        target: '.v-application',
        title: 'Неизвестная ошибка',
        text: 'Обратитесь к администрации',
        icon: 'error',
      }
  )
}

export const useApi = {
  get: async <T = any>(
    api: string,
    payload?: any,
  ): Promise<RequestResult<T>> =>

    new Promise(resolve => {
      axiosIns
        .get(api, {
          params: payload || null,

          paramsSerializer(params: any) {
            return qs.stringify(params, { arrayFormat: 'brackets' })
          },
        })
        .then((response: any) => {
          resolve({
            success: true,
            code: response.data.code,
            status: response.data.status,
            data: response.data?.data || response.data,
          })
        })
        .catch((error: any) => {
          requestHandleMessage('ERROR', error?.response?.data?.status)
          resolve({
            success: false,
            code: error.response.data.code,
            status: error.response.data.status,
            data: null,
          })
        })
    }),
  post: async <T = any>(
    api: string,
    payload?: any,
    isFormData = false,
  ): Promise<RequestResult<T>> =>
    new Promise(resolve => {
      axiosIns
        .post(api, payload, {
          headers: {
            'Content-Type': isFormData
              ? 'multipart/form-data'
              : 'application/json',
          },
        })
        .then((response: any) => {
          console.log(response, "response")
          requestHandleMessage('OK', response?.data?.message)
          resolve({
            success: true,
            data: response.data?.data,
          })
        })
        .catch((error: any) => {
          requestHandleMessage('ERROR', error?.response?.data?.statusCode)
          resolve({
            success: false,
            data: null,
          })
        })
    }),
  put: async <T = any>(
    api: string,
    payload?: any,
    isFormData = false,
  ): Promise<RequestResult<T>> =>
    new Promise(resolve => {
      axiosIns
        .put(api, payload, {
          headers: {
            'Content-Type': isFormData
              ? 'multipart/form-data'
              : 'application/json',
          },
        })
        .then((response: any) => {
          console.log(response, "response")
          requestHandleMessage('OK', response?.data?.message)
          resolve({
            success: true,
            data: response.data?.data,
          })
        })
        .catch((error: any) => {
          console.log(error, "ERRRORR")
          requestHandleMessage('ERROR', error?.response?.data?.statusCode)
          resolve({
            success: false,
            data: null,
          })
        })
    }),
}
