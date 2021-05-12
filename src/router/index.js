import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import {
  AdminGuard,
  AuthGuard,
  ClientGuard,
  LoginGuard,
  NoneGuard,
  ResolveGuard,
  SupperAdminGuard
} from '../router/guards/index'

Vue.use(Router)

export function page (path) {
  return () => import(/* webpackChunkName: "[request]" */ `../pages/${path}`)
}

function createInitialRouter () {
  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'client.Home',
        component: page('client/Home.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/tim-kiem?roomType=:roomType&city=:city&district=:district&ward=:ward&minAcreage=:minAcreage&maxAcreage=:maxAcreage&minPrice=:minPrice&maxPrice=:maxPrice',
        name: 'client.Search',
        component: page('client/SearchArticle.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/bai-dang/:slug',
        name: 'client.ArticleDetail',
        component: page('client/ArticleDetail.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/quan-ly-bai-dang',
        name: 'client.ManageArticle',
        component: page('client/ManageArticle.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/dang-bai-moi',
        name: 'client.CreateArticle',
        component: page('client/CreateArticle.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/chinh-sua-bai-dang/:id',
        name: 'client.EditArticle',
        component: page('client/EditArticle.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/thong-tin-ca-nhan',
        name: 'Profile',
        component: page('client/Profile.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([AuthGuard])
      },
      {
        path: '/nap-tien',
        name: 'client.Payment',
        component: page('client/Payment.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/lich-su-nap-tien',
        name: 'client.TransactionHistory',
        component: page('client/TransactionHistory.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/tin-da-luu',
        name: 'client.FavoriteArticle',
        component: page('client/FavoriteArticle.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([ClientGuard])
      },
      {
        path: '/404',
        name: 'ErrorPage',
        component: page('client/ErrorPage.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/tin-tuc',
        name: 'client.News',
        component: page('client/News.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/tin-tuc/:slug',
        name: 'client.NewsDetail',
        component: page('client/NewsDetail.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/dang-nhap',
        name: 'Login',
        component: page('Login.vue'),
        meta: {layout: 'auth'},
        beforeEnter: ResolveGuard([LoginGuard])
      },
      {
        path: '/dang-ky',
        name: 'Register',
        component: page('Register.vue'),
        meta: {layout: 'auth'}
      },
      {
        path: '/quen-mat-khau',
        name: 'ForgotPassword',
        component: page('ForgotPassword.vue'),
        meta: {layout: 'auth'},
        beforeEnter: ResolveGuard([LoginGuard])
      },
      {
        path: '/dat-lai-mat-khau',
        name: 'ResetPassword',
        component: page('ResetPassword.vue'),
        meta: {layout: 'auth'}
      },
      {
        path: '/xac-nhan-email',
        name: 'ConfirmEmail',
        component: page('ConfirmEmail.vue'),
        meta: {layout: 'web'},
        beforeEnter: ResolveGuard([NoneGuard])
      },
      {
        path: '/sysadmin/thong-ke',
        name: 'sysadmin/statistics.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/statistics/Index.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/khach-hang',
        name: 'sysadmin/customers.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/customers/Index.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/bai-dang',
        name: 'sysadmin/articles.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/articles/Index.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/bai-dang/chi-tiet/:id',
        name: 'sysadmin/articles.New',
        meta: {layout: 'default'},
        component: page('sysadmin/articles/Detail.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/nhan-vien',
        name: 'sysadmin/staffs.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/staffs/Index.vue'),
        beforeEnter: ResolveGuard([SupperAdminGuard])
      },
      {
        path: '/sysadmin/nhan-vien/them-moi',
        name: 'sysadmin/staffs.New',
        meta: {layout: 'default'},
        component: page('sysadmin/staffs/New.vue'),
        beforeEnter: ResolveGuard([SupperAdminGuard])
      },
      {
        path: '/sysadmin/nhan-vien/chinh-sua/:id',
        name: 'sysadmin/staffs.Edit',
        meta: {layout: 'default'},
        component: page('sysadmin/staffs/Edit.vue'),
        beforeEnter: ResolveGuard([SupperAdminGuard])
      },
      {
        path: '/sysadmin/tin-tuc',
        name: 'sysadmin/news.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/news/Index.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/tin-tuc/them-moi',
        name: 'sysadmin/news.New',
        meta: {layout: 'default'},
        component: page('sysadmin/news/New.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/tin-tuc/chinh-sua/:id',
        name: 'sysadmin/news.Edit',
        meta: {layout: 'default'},
        component: page('sysadmin/news/Edit.vue'),
        beforeEnter: ResolveGuard([AdminGuard])
      },
      {
        path: '/sysadmin/giao-dich',
        name: 'sysadmin/transactions.Index',
        meta: {layout: 'default'},
        component: page('sysadmin/transactions/Index.vue'),
        beforeEnter: ResolveGuard([SupperAdminGuard])
      }
    ],
    linkActiveClass: 'active'
  })
  router.beforeEach(beforeEachFn)
  router.afterEach(afterEachFn)
  return router
}

const router = createInitialRouter()
export default router

async function beforeEachFn (to, from, next) {
  store.commit('SET_UI', {
    layout: to.meta.layout || 'web'
  })
  return next()
}

async function afterEachFn () {
  await router.app.$nextTick()
}
