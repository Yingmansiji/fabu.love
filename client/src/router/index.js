import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // 去除#
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/apps',
      component: resolve => require(['@/components/main/main.vue'], resolve),
      children: [
        {
          path: '/apps',
          component: resolve => require(['@/components/appList/appList.vue'], resolve)
        },
        {
          path: '/app/:appId',
          name: 'AppDetail',
          component: resolve => require(['@/components/appDetail/appDetail.vue'], resolve)
        },
        {
          path: '/members',
          name: 'TeamMgr',
          component: resolve => require(['@/components/team/teamMgr.vue'], resolve)
        },
        {
          path: '/miniAppList',
          name: 'MiniAppList',
          component: resolve => require(['@/components/miniApplication/miniAppList.vue'], resolve)
        },
        {
          path: '/miniApp/:appId',
          name: 'MiniAppDetail',
          component: resolve => require(['@/components/miniApplication/miniAppDetail.vue'], resolve)
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/auth/auth.vue'], resolve)
    },
    {
      path: '/user',
      name: 'UserInfo',
      component: resolve => require(['@/components/user/userInfo.vue'], resolve)
    },
    {
      path: '/:id',
      name: 'AppPreView',
      component: resolve => require(['@/components/appDetail/appPreView.vue'], resolve)
    }
  ]
})
