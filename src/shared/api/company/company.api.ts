import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { Company } from '@core/model/default/company'

export const CompanyApi = {
  async getById(companyId: string): Promise<RequestResult<Company>> {
    return useApi.get<Company>(`/company/${companyId}`)
  },
}
