import {ApiService} from './api.service'

export * from './api.service'
export * from './account.service'
export * from './staff.service'
export * from './customer.service'
export * from './address.service'
export * from './article.service'
export * from './news.service'

export const AdminTransactionService = {
  async adminTransactions () {
    return ApiService.get(`/super-admin/transactions`)
  },

  async transactionStatistics () {
    return ApiService.get(`/admin/statistics/transaction`)
  }
}
