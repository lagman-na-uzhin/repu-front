import type { IRole } from '@/shared/contracts/role/role'

export interface IEmployee {
  id: string
  name: string
  email: string
  phone: string
  role: IRole
}
