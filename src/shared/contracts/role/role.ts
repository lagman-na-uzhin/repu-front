import { IPermissions } from "@/shared/contracts/role/permissions"

export interface IRole {
  id: string
  name: string
  type: string
  permissions: IPermissions[]
}
