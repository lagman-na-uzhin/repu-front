import { defineStore } from 'pinia'
import { API } from '@/shared/api'

export interface Company {
  id: string
  managerId: string
  name: string
}

export const useCompanyStore = defineStore('company', {
  state: () => ({
    company: null as Company | null,
  }),
  actions: {
    async init(id: string) {
      if (this.company)
        return this.company

      const { success, data } = await API.COMPANY.getById(id)
      if (success && data) {
        this.company = data

        return data
      }
    },

    async fetchCompanyManager() {
      console.log(this.company, "thiss company")
      const { data } = await API.MANAGER.getById(this.company!.managerId)

      return data
    },
  },
})
