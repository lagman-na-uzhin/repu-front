import type { Router } from 'vue-router'
import { useCompanyStore } from '@/stores/company.store'
import { useAuthStore } from '@/stores/auth.store'

export const setupGuards = (router: Router) => {
  router.beforeEach(async to => {
    const authStore = useAuthStore()
    const companyStore = useCompanyStore()

    // 1. Check for authentication
    if (to.meta.requiresAuth) {
      if (!authStore.user) {
        const user = await authStore.initUser()

        if (!user) {
          // If the user cannot be initialized, redirect to login
          return { path: '/auth/login' };
        }

        if (!authStore.isAdmin) {
          await companyStore.init(user.companyId!);
        }
      }
    } else {
      // If the route doesn't require auth, proceed
      return true;
    }

    // 2. Check for Role-based access
    if (
      Array.isArray(to.meta.allowedRoles)
      && !to.meta.allowedRoles.includes(authStore.userRole)
    ) {
      return { path: '/forbidden' };
    }

    // 3. Check for Permission-based access (NEW)
    const requiredPermissions = to.meta.requiredPermissions;
    if (requiredPermissions) {
      const userPermissions = authStore.user?.role?.permissions || [];
      const hasPermission = userPermissions.some(
        p => p.module === requiredPermissions.module && p.permission === requiredPermissions.permission
      );

      if (!hasPermission) {
        return { path: '/forbidden' };
      }
    }

    return true;
  })
}
