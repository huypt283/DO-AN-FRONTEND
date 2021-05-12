import store from '../../store/index'
import Cookie from 'js-cookie'
import {AccountService} from '../../api'

export const AdminGuard = async (to, from, next) => {
  if (store.getters.profile && (store.getters.role === 'nq6WrCC7BZ' || store.getters.role === 'LuB5YqE9En')) {
    next()
    return
  }

  if (Cookie.get('token')) {
    const profile = await AccountService.profile()

    if (profile.status === 200) {
      store.commit('SET_PROFILE', profile.data)
    }

    if (store.getters.profile && (store.getters.role === 'nq6WrCC7BZ' || store.getters.role === 'LuB5YqE9En')) {
      next()
      return
    }
  }

  store.commit('LOG_OUT')
  next({name: 'Login'})
}
