import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { ILoginPayload } from '@/shared/api/auth/auth-api.dto.in'
import type { IUser } from '@core/model/user'

export const AuthApi = {
  async login(payload: ILoginPayload): Promise<RequestResult<void>> {
    const res = await useApi.post('/auth/default/login', payload)
    console.log(res.data, "rees")
    return res
  },

  async managerLogin(payload: ILoginPayload): Promise<RequestResult<void>> {
    const res = await useApi.post('/auth/control/login', payload)
    console.log(res.data, "rees")
    return res
  },

  async me(): Promise<RequestResult<IUser>> {
    return useApi.get<IUser>('/auth/me')
  },
}
