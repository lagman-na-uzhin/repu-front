export interface IAssignManagerLeadPayload {
  leadId: string
  managerId?: string
}

export interface IConfirmLeadPayload {
  leadId: string
  tariffType: 'BASIC' | 'PRO' | 'PRO_PLUS' | 'CUSTOM'
  organizationCountRange: string
  companyName?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  features?: {
    companyDataSync: boolean
    multiAccess: boolean
    registerPlacement: boolean
    reviewReply: boolean
    reviewAutoReply: boolean
    reviewComplaint: boolean
    reviewAutoComplaint: boolean
    analysisReview: boolean
    analysisByRadius: boolean
    analysisCompetitor: boolean
  }
}
