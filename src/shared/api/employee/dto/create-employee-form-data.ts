import type { ICreateEmployeeRole } from '@/shared/api/role/dto/request.contracts'

export interface IEmployeeCreateFormData {
  email: string
  name: string
  phone: string
  roleId?: string
  role?: ICreateEmployeeRole
}
