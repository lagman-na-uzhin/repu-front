export interface ICreateEmployeeRole {
  name: string
  permissions: {
    module: string;
    permission?: string;
    organizationId?: string;
    fullAccess?: boolean;
  }
}
