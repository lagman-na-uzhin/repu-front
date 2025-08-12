export const ROUTES = {
  DASHBOARD: 'dashboard',
  COMPANY: 'company',
  SUBSCRIPTIONS: 'subscriptions',
  ORGANIZATION_LIST: 'organizations',
  ORGANIZATION_EDIT: 'organizations/edit',
  REVIEW_LIST: 'reviews',
  ADD_ORGANIZATION: 'organizations/add',
  REPLY_TEMPLATE_LIST: 'templates/reply',
  EMPLOYEE_LIST: '/employees',
  EMPLOYEE_CREATE: '/employees/create',
}

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  MANAGER_LOGIN: '/control/auth/login',
}

export const routes = [
  { path: '/', redirect: '/dashboard' },

  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: ROUTES.DASHBOARD,
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.EMPLOYEE_LIST,
        component: () => import('@/pages/employee/EmployeeListPage.vue'),

        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.EMPLOYEE_CREATE,
        component: () => import('@/pages/employee/EmployeeCreatePage.vue'),

        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.REPLY_TEMPLATE_LIST,
        component: () => import('@/pages/reply-templates/ReplyTemplatesListPage.vue'),

        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.ORGANIZATION_LIST,
        component: () => import('@/pages/organization/OrganizationListPage.vue'),

        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.ORGANIZATION_EDIT,
        component: () => import('@/pages/organization/OrganizationEditPage.vue'),

        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.REVIEW_LIST,
        component: () => import('@/pages/review/ReviewListPage.vue'),

        meta: { requiresAuth: true },
      },
    ],
  },

  // 🔐 Менеджерские маршруты
  {
    path: '/control',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'leads',
        component: () => import('@/pages/control/lead/LeadListPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: AUTH_ROUTES.LOGIN,
    component: () => import('@/pages/auth/login.vue'),
  },

  {
    path: AUTH_ROUTES.MANAGER_LOGIN,
    component: () => import('@/pages/auth/control-login.vue'),
  },
]

export default { routes }
