import type { Router } from 'vue-router'
import { useCompanyStore } from '@/stores/company.store'
import { useAuthStore } from '@/stores/auth.store'

export const setupGuards = (router: Router) => {
  router.beforeEach(async to => {
    if (!to.meta.requiresAuth)
      return true

    const authStore = useAuthStore()
    const companyStore = useCompanyStore()

    console.log(authStore.user, 'authStore.user')
    if (!authStore.user) {
      const user = await authStore.initUser()

      if (user && !authStore.isAdmin)
        await companyStore.init(user.companyId!)
    }

    if (
      Array.isArray(to.meta.allowedRoles)
      && !to.meta.allowedRoles.includes(authStore.userRole)
    )
      return { path: '/forbidden' }

    return true
  })
}
