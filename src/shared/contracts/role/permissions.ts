export enum PERMISSION_MODULES {
  COMPANY = 'COMPANY',
  REVIEW = 'REVIEW',
  ORGANIZATIONS = 'ORGANIZATION',
  EMPLOYEE = 'EMPLOYEE',
  PLACEMENT = 'PLACEMENT',
}

export interface IPermissions {
  id: string
  module: PERMISSION_MODULES
  permission: string
  organizationsId: string | null
}
