import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { Manager } from '@core/model/default/manager'

export const ManagerApi = {
  async getById(managerId: string): Promise<RequestResult<Manager>> {
    return useApi.get<Manager>(`/managers/${managerId}`)
  },
}
