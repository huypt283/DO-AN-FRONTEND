import store from '../../store/index'
import {AccountService} from '../../api'
import Cookie from 'js-cookie'

export const ClientGuard = async (to, from, next) => {
  if (store.getters.profile && store.getters.role === '3Mp71MODoP') {
    next()
    return
  }

  if (Cookie.get('token')) {
    const profile = await AccountService.profile()

    if (profile.status === 200) {
      store.commit('SET_PROFILE', profile.data)
    }

    if (store.getters.profile && store.getters.role === '3Mp71MODoP') {
      next()
      return
    }
  }

  store.commit('LOG_OUT')
  next({name: 'client.Home'})
}
