import { PERMISSION_MODULES } from "@/shared/contracts/role/permissions"


export interface IUserRole {
  id: string
  name: string | null
  type: 'OWNER' | 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
  permissions: {
    id: string
    module: PERMISSION_MODULES
    permission: string
  }
}

export interface IUser {
  id: string
  name: string
  role: IUserRole
  email: string
  companyId: string | null
}
