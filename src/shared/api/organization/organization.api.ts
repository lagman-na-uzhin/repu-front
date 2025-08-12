import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import { AddOrganizationPayload, GetOrganizationListParams } from '@/shared/api/organization/organization-api.dto.in'
import type { PaginationResponse } from '@/shared/contracts/pagination-response'
import type { IOrganization } from '@core/model/default/organization'

export const OrganizationApi = {
  async getListByCompany(payload: GetOrganizationListParams): Promise<RequestResult<PaginationResponse<IOrganization>>> {
    return useApi.get<IOrganization[]>('/organizations', payload)
  },
  async getCompactOrganizations(payload: {companyId: string}): Promise<RequestResult<any>> {
    return useApi.get<IOrganization[]>('/organizations/c', payload)
  },
  async add(payload: AddOrganizationPayload): Promise<RequestResult<null>> {
    return useApi.post<IOrganization[]>('/organizations', payload)
  },
  async getSummary(payload: {companyId: string}): Promise<RequestResult<{total: number, active: number}>> {
    return useApi.get('/organizations/summary', payload)

  }
}
