import { API } from "@/shared/api"
import { AddOrganizationPayload } from "@/shared/api/organization/organization-api.dto.in"
import { defineStore } from 'pinia'

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizationForEdit: {} | null,
  }),
  actions: {
    async addOrganization(payload: AddOrganizationPayload) {
      await API.ORGANIZATION.add(payload)
    },
  },
  getters: {
  },
})
