import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state () {
    return {
      ui: {
        layout: ''
      },
      STORAGE_KEY: 'currentUser',
      profile: null,
      token: Cookie.get('token'),
      role: Cookie.get('HV31reugOY')
    }
  },

  getters: {
    profile: state => state.profile,
    role: state => state.role,
    isLoggedIn: state => !!state.token,
    layout: state => state.ui.layout || 'default'
  },

  modules: {},

  actions: {},

  mutations: {
    SET_UI (state, payload) {
      Object.assign(state.ui, payload)
    },
    SET_TOKEN (state, token) {
      state.token = token
      Cookie.set('token', token, {secure: true})
    },
    SET_ROLE (state, role) {
      state.role = role
      Cookie.set('HV31reugOY', role)
    },
    SET_PROFILE (state, payload) {
      state.profile = payload
    },
    LOG_OUT (state) {
      state.profile = null
      state.token = null
      state.role = null
      state.profile = null
      Cookie.remove('token')
      Cookie.remove('refresh_token')
      Cookie.remove('HV31reugOY')
    }
  }
})

