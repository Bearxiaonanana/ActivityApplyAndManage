import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import ('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import ('@/views/404'),
    hidden: true
  },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () =>
        import ('@/views/dashboard/index'),
      meta: { title: 'admin', icon: 'dashboard' }
    }]
  },
  // 用户信息管理
  {
    path: '/register/user',
    component: Layout,
    redirect: '/register/user/list',
    name: 'User',
    meta: { title: '用户信息管理', icon: 'example' },
    children: [{
      path: 'list',
      name: '用户列表',
      component: () =>
        import ('@/views/register/user/list'),
      meta: { title: '用户列表', icon: 'table' }
    }]
  },
  // 比赛信息管理
{
  path: '/register/competition',
  component: Layout,
  redirect: '/register/competition',
  name: '比赛列表',
  meta: { title: '比赛信息', icon: 'example' },
  children: [{
    path: 'list',
    name: '比赛列表',
    component: () =>
          import('@/views/register/competition/list'),
    meta: { title: '比赛列表', icon: 'table' }
  },
      {
        path: 'save',
        name: '添加比赛',
        component: () =>
          import ('@/views/register/competition/save'),
        meta: { title: '添加比赛', icon: 'tree' }
      },
      {
        path: 'edit/:id',
        name: '编辑比赛',
        component: () =>
          import ('@/views/register/competition/save'),
        meta: { title: '编辑比赛', noCache: true },
        hidden: true
      },
      {
        path: 'enter/:id',
        name: '报名信息',
        component: () =>
          import ('@/views/register/competition/enter'),
        meta: { title: '报名信息', noCache: true },
        hidden: true
      },
    ]

  },
  // 用户信息管理
  {
    path: '/register/clase',
    component: Layout,
    redirect: '/register/clase/list',
    name: 'Clase',
    meta: { title: '班级信息管理', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: '班级列表',
        component: () =>
          import ('@/views/register/clase/list'),
        meta: { title: '班级列表', icon: 'table' }
      },
      {
        path: 'save',
        name: '添加班级',
        component: () =>
          import ('@/views/register/clase/save'),
        meta: { title: '添加班级', icon: 'tree' }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
