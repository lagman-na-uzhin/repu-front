export interface IUserRole {
  id: string
  name: string | null
  type: 'OWNER' | 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
  permissions: {
    companies: string[],
    reviews: Map<string, string[]>
  }
}

export interface IUser {
  id: string
  name: string
  role: IUserRole
  email: string
  companyId: string | null
}
