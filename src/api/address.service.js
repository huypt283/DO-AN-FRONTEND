import { ApiService } from './api.service'

export const AddressService = {

  async cities () {
    return ApiService.get(`/location/cities`).then(resp => {
      return resp.data
    })
  },

  async districts () {
    return ApiService.get(`/location/districts`).then(resp => {
      return resp.data
    })
  },

  async wards () {
    return ApiService.get(`/location/wards`).then(resp => {
      return resp.data
    })
  },

  async districtDetail (city) {
    return ApiService.get(`/location/districts?city=${city}`).then(resp => {
      return resp.data
    })
  },

  async wardDetail (district) {
    return ApiService.get(`/location/wards?district=${district}`).then(resp => {
      return resp.data
    })
  }

}
