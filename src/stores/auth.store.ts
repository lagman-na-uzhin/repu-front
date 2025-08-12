import { defineStore } from 'pinia'
import { AUTH_ROUTES } from '@/plugins/router/routes'
import type { IUser } from '@core/model/user'
import { API } from '@/shared/api'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null as IUser | null,
  }),

  getters: {
    userRole: state => state.user?.role,
    isAdmin: state => state.user?.role.type === 'MANAGER' || state.user?.role.type === 'ADMIN',
  },

  actions: {
    async initUser() {
      try {
        const { success, data } = await API.AUTH.me()
        if (success && data) {
          this.user = data

          return this.user
        }
        else {
          await this.handleUnauthorized()
        }
      }
      catch (error) {
        console.error(error)
        await this.handleUnauthorized()
      }
    },

    async logout() {
      this.user = null
      window.location.href = AUTH_ROUTES.LOGIN
    },

    async handleUnauthorized() {
      await this.logout()
    },
  },
})
