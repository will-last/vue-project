import { createRouter, createWebHashHistory } from 'vue-router'

const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: () => import('@/components/BackendLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        },
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        },
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        },
      },
    ],
  },
]

const frontendRoutes = [
  {
    path: '/',
    component: () => import('@/components/FrontendLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
        meta: {
          title: 'AI咨询',
        },
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
        meta: {
          title: '情绪日记',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
        meta: {
          title: '知识库',
        },
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...backendRoutes, ...frontendRoutes],
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 当前用户是否登录
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // 如果是后台用户
    if (userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (userInfo.userType == 1) {
      // 已登录的前台用户只能访问前台路由
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    if (to.path.startsWith('/back')) {
      // 如果访问后台页面，跳转到登录页
      next('/auth/login')
    } else {
      next()
    }
  }
})

export default router
