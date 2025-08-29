import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { AddOrganizationPayload, GetOrganizationListParams } from '@/shared/api/organization/organization-api.dto.in'
import type { PaginationResponse } from '@/shared/contracts/pagination-response'
import { IOrganization, IOrganizationRubric, IWorkingSchedule } from '@core/model/default/organization'

export const OrganizationApi = {
  async getListByCompany(payload: GetOrganizationListParams): Promise<RequestResult<PaginationResponse<IOrganization>>> {
    return useApi.get<IOrganization[]>('/organizations', payload)
  },
  async getCompactOrganizations(): Promise<RequestResult<any>> {
    return useApi.get<IOrganization[]>('/organizations/c')
  },
  async add(payload: AddOrganizationPayload): Promise<RequestResult<null>> {
    return useApi.post<IOrganization[]>('/organizations', payload)
  },
  async getSummary(payload: { companyId: string }): Promise<RequestResult<{ total: number; active: number }>> {
    return useApi.get('/organizations/summary', payload)
  },

  async update(organizationsId: string, payload: {schedules?: Partial<IWorkingSchedule>, rubrics?: Partial<IOrganizationRubric>}): Promise<RequestResult<null>> {
    console.log('update API', "payload")
    const res = await useApi.put<IOrganization[]>(`/organizations/${organizationsId}`, payload)
    console.log(res, "res")
    return res
  },
}
