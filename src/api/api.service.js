import axios from 'axios'
import store from '../store/index'
import Cookie from 'js-cookie'
import {AccountService} from '../api'
import router from '../router'

// create an axios instance
const axiosApiInstance = axios.create({
  baseURL: 'https://nha-tro-back-end.herokuapp.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'access-control-allow-headers': 'content-type,x-requested-with',
    'access-control-allow-methods': 'OPTIONS, GET, POST, PUT, DELETE',
    'access-control-allow-origin': '*',
    'access-control-max-age': '0'
  }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.state.token) {
      config.headers['Authorization'] = `Bearer ${Cookie.get('token')}`
    }
    return config
  }
)

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config
  if (error.response.status === 401 && error.response.data.message.includes('Phiên đăng nhập đã hết hạn')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({resolve, reject})
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        return resolve(axios.request(originalRequest))
      }).catch(err => {
        return err.response
      })
    }

    originalRequest._retry = true
    isRefreshing = true
    return new Promise(async (resolve, reject) => {
      const token = await AccountService.refreshToken()
      isRefreshing = false
      if (token === undefined) {
        store.commit('LOG_OUT')
        router.push({name: 'Login'})
      } else {
        store.commit('SET_TOKEN', token)
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        processQueue(null, token)
        return resolve(axios.request(originalRequest))
      }
    })
  }
  if (error.response.status === 403 || error.response.status === 401) {
    store.commit('LOG_OUT')
    router.push({name: 'Login'})
  }
  return error.response
})

export const ApiService = {
  get (url, params = {}) {
    return axiosApiInstance.get(`${url}`, {params})
  },

  post (url, body, config = {}) {
    return axiosApiInstance.post(`${url}`, body, config)
  },

  put (url, body, params = {}) {
    return axiosApiInstance.put(`${url}`, body, {params})
  },

  delete (url, params = {}) {
    return axiosApiInstance.delete(url, params)
  },

  patch (url, body, config = {}) {
    return axiosApiInstance.patch(`${url}`, body, config)
  }
}
