import { type RequestResult, useApi } from '@/composables/useApi'
import type { IEmployeeCreateFormData } from "@/shared/api/employee/dto/create-employee-form-data"
import { IEmployee } from "@/shared/contracts/employee"
import type { PaginationResponse } from '@/shared/contracts/pagination-response'


export const EmployeeApi = {
  getList: async (
    query: any,
  ): Promise<RequestResult<PaginationResponse<IEmployee>>> => {
    return useApi.get('/employees', query)
  },

  create: async (
    payload: IEmployeeCreateFormData,
  ): Promise<RequestResult> => {
    return useApi.post('/employees', payload)
  },
}
