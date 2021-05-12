import store from '../../store'
import Cookie from 'js-cookie'
import {AccountService} from '../../api'

export const LoginGuard = async (to, from, next) => {
  if (store.getters.profile) {
    next({name: 'client.Home'})
    return
  }

  if (Cookie.get('token')) {
    const profile = await AccountService.profile()

    if (profile.status === 200) {
      store.commit('SET_PROFILE', profile.data)
      next({name: 'client.Home'})
      return
    }
  }

  next()
}
