import {ApiService} from './api.service'

export const CustomerService = {

  async customers () {
    return ApiService.get(`/admin/customers`)
  },

  async customersArticles () {
    return ApiService.get(`/customer/articles`)
  },

  async customersFavorite (id) {
    return ApiService.patch(`/customer/favorite-article/${id}`)
  },

  async customersArticlesDetail (id) {
    return ApiService.get(`/customer/articles/${id}`)
  },

  async customersArticlesDelete (id) {
    return ApiService.delete(`/customer/articles/${id}`)
  },

  async customersArticlesShow (id) {
    return ApiService.post(`/customer/articles/show/${id}`)
  },

  async customersArticlesHide (id) {
    return ApiService.post(`/customer/articles/hide/${id}`)
  },

  async customersArticlesSave (data = {}) {
    return ApiService.post(`/customer/articles`, data)
  },

  async customersArticlesUpdate (id, data = {}) {
    return ApiService.put(`/customer/articles/${id}`, data)
  },

  async customersTransactions () {
    return ApiService.get(`/customer/transactions`)
  },

  async payment (data = {}) {
    return ApiService.post(`/customer/payment`, data)
  },

  async paymentSuccess (data = {}) {
    return ApiService.post(`/customer/payment/success`, data)
  },

  async paymentError (token) {
    return ApiService.get(`/customer/payment/cancel?token=${token}`)
  },

  async extendArticle (id, data = {}) {
    return ApiService.post(`/customer/articles/extend/${id}`, data)
  },

  async active (id) {
    return ApiService.post(`/admin/customers/active/${id}`)
  },

  async block (id) {
    return ApiService.post(`/admin/customers/block/${id}`)
  },

  async delete (id) {
    return ApiService.delete(`/admin/customers/${id}`)
  }

}
