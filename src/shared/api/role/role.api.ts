import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { IRole } from '@/shared/contracts/role/role'

export const RoleApi = {
  getRoles: async (): Promise<RequestResult<IRole>> => {
    return useApi.get('/roles')
  },
}
