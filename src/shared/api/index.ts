import { AuthApi } from '@/shared/api/auth/auth.api'
import { EmployeeApi } from "@/shared/api/employee/employee-api"
import { GoogleApi } from "@/shared/api/google/google-api"
import { LeadApi } from '@/shared/api/lead/lead-api'
import { ManagerApi } from "@/shared/api/manager/manager-api"
import { OrganizationApi } from '@/shared/api/organization/organization.api'
import { ReviewApi } from "@/shared/api/review/review.api"
import { RoleApi } from "@/shared/api/role/role.api"
import { TwogisApi } from "@/shared/api/twogis/twogis-api"
import { YandexApi } from '@/shared/api/yandex/yandex-api'
import { CompanyApi } from '@/shared/api/company/company.api'

export const API = {
  AUTH: AuthApi,
  ORGANIZATION: OrganizationApi,
  REVIEW: ReviewApi,
  LEAD: LeadApi,
  COMPANY: CompanyApi,
  MANAGER: ManagerApi,
  YANDEX: YandexApi,
  TWOGIS: TwogisApi,
  GOOGLE: GoogleApi,
  EMPLOYEE: EmployeeApi,
  ROLE: RoleApi
}

export const CONTROL_API = {
  ORGANIZATION: OrganizationApi,
}
