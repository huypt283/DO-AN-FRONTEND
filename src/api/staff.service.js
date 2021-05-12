import {ApiService} from './api.service'

export const StaffService = {

  async staffs () {
    return ApiService.get(`/super-admin/staffs`)
  },

  async detail (id) {
    return ApiService.get(`/super-admin/staffs/${id}`)
  },

  async save (data = {}) {
    return ApiService.post(`/super-admin/staffs`, data)
  },

  async edit (data = {}, id) {
    return ApiService.put(`/super-admin/staffs/${id}`, data)
  },

  async active (id) {
    return ApiService.post(`/super-admin/staffs/active/${id}`)
  },

  async block (id) {
    return ApiService.post(`/super-admin/staffs/block/${id}`)
  },

  async delete (id) {
    return ApiService.delete(`/super-admin/staffs/${id}`)
  }

}
