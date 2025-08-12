import type { FilterParams, GetListParams } from '@/shared/contracts/pagination-params'

export interface GetOrganizationListFilterParams extends FilterParams {
  readonly companyId: string
}
export interface GetOrganizationListParams extends GetListParams<GetOrganizationListFilterParams> {}

export interface AddOrganizationPayload {
  companyId: string
  groupId: string | null
  city: string
  externalId: string
  platform: 'TWOGIS'

  // placements: {
  //   externalId: string
  //   platform: 'YANDEX' | 'TWOGIS'
  // }[]
}
