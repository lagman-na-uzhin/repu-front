import { SOURCE } from "@core/model/shared/source"
import type { ITimeRange } from '@core/model/shared/time'

export interface IOrganization {
  id: string
  companyId: string
  groupId: string | null
  name: string
  address: IOrganizationAddress
  workingSchedule: IWorkingSchedule
  contactPoints: IContactPoint[]
  rubrics: IOrganizationRubric[]
}
export interface IOrganizationAddress {
  city: string

  address: string

  latitude: number

  longitude: number
}

export interface IOrganizationRubric {
  id: string
  name: string
  external: {
    name: string
    externalId: string
    platform: SOURCE
  }[]
}
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface IWorkingSchedule {
  id: string
  entries: Map<DayOfWeek, IDailyWorkingHours>
  isTemporarilyClosed: boolean
}
export interface IDailyWorkingHours {
  uniqueRelation: string
  breakEndTime: string
  breakStartTime: string
  dayOfWeek: DayOfWeek
  endTime: string
  startTime: string
}

export enum ContactPointType {
  WHATSAPP = 'WHATSAPP',
  VIBER = 'VIBER',
  INSTAGRAM = 'INSTAGRAM',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE', // General phone number
  TELEGRAM = 'TELEGRAM', // Example of adding a new type
  WEBSITE = 'WEBSITE',
}
export interface IContactPoint {
  type: ContactPointType
  value: string
}
