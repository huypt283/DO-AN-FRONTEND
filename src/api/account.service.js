import {ApiService} from './api.service'
import Cookie from 'js-cookie'
import axios from 'axios'

export const AccountService = {

  async profile () {
    return ApiService.get(`/profile`)
  },

  async updateAvatar (data = {}) {
    return ApiService.post(`/avatar`, data)
  },

  async deleteAvatar () {
    return ApiService.delete(`/avatar`)
  },

  async updateProfile (data = {}) {
    return ApiService.put(`/profile`, data)
  },

  async changePassword (data = {}) {
    return ApiService.put(`/change-password`, data)
  },

  async confirmEmail (param) {
    return ApiService.get(`/confirm${param}`)
  },

  async refreshToken () {
    return axios.get(`https://nha-tro-back-end.herokuapp.com/refresh-token`, {
      headers: {
        'lynx': `$xzyw.${Cookie.get('refresh_token')}`
      }
    })
      .then(response => {
        return response.data.access_token
      })
      .catch(error => {
        console.log(error)
      })
  },

  async forgotPassword (email) {
    return ApiService.post(`/forgot-password?email=${email}`)
  },

  async resetPassword (data = {}) {
    return ApiService.post(`/reset-password`, data)
  },

  async login (data = {}, isStatic = true) {
    return ApiService.post(`/sign-in`, data)
  },

  async register (data = {}, isStatic = true) {
    return ApiService.post(`/sign-up`, data)
  },

  async logout () {
    return ApiService.post(`/sign-out`)
  }

}
