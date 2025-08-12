import { type RequestResult, useApi } from '@/composables/useApi'
import { IEmployee } from "@/shared/contracts/employee"
import type { PaginationResponse } from '@/shared/contracts/pagination-response'


export const EmployeeApi = {
  getList: async (
    query: any,
  ): Promise<RequestResult<PaginationResponse<IEmployee>>> => {
    return useApi.get('/employees', query)
  },
}
