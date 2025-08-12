import type { RequestResult } from '@/composables/useApi'
import { useApi } from '@/composables/useApi'
import { IAssignManagerLeadPayload, IConfirmLeadPayload } from "@/shared/api/lead/dto/request-contracts"

export const LeadApi = {
  async getList(payload: any): Promise<RequestResult<any>> {
    return useApi.get('/control/leads', payload)
  },

  async assignManager(payload: IAssignManagerLeadPayload): Promise<RequestResult<any>> {
    return useApi.post('/control/leads/assign', payload)
  },

  async confirm(payload: IConfirmLeadPayload): Promise<RequestResult<any>> {
    return useApi.post('/control/leads/confirm', payload)
  },
}
