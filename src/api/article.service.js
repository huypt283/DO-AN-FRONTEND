import {ApiService} from './api.service'

export const ArticleService = {

  async adminArticles () {
    return ApiService.get(`/admin/articles`)
  },

  async favoriteArticle () {
    return ApiService.get(`/customer/favorite-article`)
  },

  async articleStatistics () {
    return ApiService.get(`/admin/statistics/article`)
  },

  async articles (email) {
    return ApiService.get(`/articles?email=${email}`).then(resp => {
      return resp.data
    })
  },

  async articlesSuggestion (email) {
    return ApiService.get(`/articles/suggestion?email=${email}`).then(resp => {
      return resp.data
    })
  },

  async detailArticle (slug, email) {
    return ApiService.get(`/articles/${slug}?email=${email}`)
  },

  async searchArticles (typeRoom = null, city = '', district = '', ward = '', minAcreage = '', maxAcreage = '', minPrice = '', maxPrice = '', email = '') {
    return ApiService.get(`/articles?roomType=${typeRoom}&city=${city}&district=${district}&ward=${ward}&minAcreage=${minAcreage}&maxAcreage=${maxAcreage}&minPrice=${minPrice}&maxPrice=${maxPrice}&email=${email}`)
      .then(resp => {
        return resp.data
      })
  },

  async filterArticlesByRoomType (typeRoom = null) {
    return ApiService.get(`/articles?roomType=${typeRoom}`)
      .then(resp => {
        return resp.data
      })
  },

  async activeArticle (id) {
    return ApiService.post(`/admin/articles/active/${id}`)
  },

  async unblockArticle (id, data = {}) {
    return ApiService.post(`/admin/articles/unblock/${id}`, data)
  },

  async blockArticle (id, data = {}) {
    return ApiService.post(`/admin/articles/block/${id}`, data)
  },

  async contactCustomer (id, data = {}) {
    return ApiService.post(`/admin/articles/contact/${id}`, data)
  }

}
