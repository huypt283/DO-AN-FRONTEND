import store from '../../store/index'
import {AccountService} from '../../api'
import Cookie from 'js-cookie'

export const NoneGuard = async (to, from, next) => {
  if (store.getters.profile) {
    next()
    return
  }

  if (Cookie.get('token')) {
    const profile = await AccountService.profile()

    if (profile.status === 200) {
      store.commit('SET_PROFILE', profile.data)
      next()
      return
    }
  }

  store.commit('LOG_OUT')
  next()
}
