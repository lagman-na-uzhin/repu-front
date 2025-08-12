import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import type { PaginationResponse } from '@/shared/contracts/pagination-response'
import type { IOrganization } from '@core/model/default/organization'
import { IReview } from "@core/model/default/review"

export const ReviewApi = {
  async getList(payload: any): Promise<RequestResult<PaginationResponse<IReview>>> {
    return useApi.get<IOrganization[]>('/reviews', payload)
  },
}
