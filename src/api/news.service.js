import {ApiService} from './api.service'

export const NewsService = {

  async news () {
    return ApiService.get(`/news`).then(resp => {
      return resp.data
    })
  },

  async newsSuggestion () {
    return ApiService.get(`/news/suggestion`).then(resp => {
      return resp.data
    })
  },

  async newsDetail (id) {
    return ApiService.get(`/news/${id}`)
  },

  async adminNews () {
    return ApiService.get(`/admin/news`)
  },

  async adminNewsDetail (id) {
    return ApiService.get(`/admin/news/${id}`)
  },

  async saveNews (data = {}) {
    return ApiService.post(`/admin/news`, data)
  },

  async editNews (data = {}, id) {
    return ApiService.put(`/admin/news/${id}`, data)
  },

  async activeNews (id) {
    return ApiService.put(`/admin/news/active/${id}`)
  },

  async hideNews (id) {
    return ApiService.put(`/admin/news/hide/${id}`)
  },

  async deleteNews (id) {
    return ApiService.delete(`/admin/news/${id}`)
  }

}
