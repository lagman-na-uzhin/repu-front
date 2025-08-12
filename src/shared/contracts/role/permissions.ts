export enum PERMISSION_MODULES {
  COMPANIES = "COMPANIES",
  REVIEWS = 'REVIEWS',
  ORGANIZATIONS = 'ORGANIZATIONS',
  EMPLOYEES = 'EMPLOYEES',
  PLACEMENTS = 'PLACEMENTS',
}

export interface IPermissions {
  id: string
  module: PERMISSION_MODULES
  permission: string
  organizationsId: string | null
}
