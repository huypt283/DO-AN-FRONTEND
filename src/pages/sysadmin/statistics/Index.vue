<template>

  <section class="content">
    <div class="row">
      <h3 class="col-12">Thống kê số lượng bài viết theo từng tháng</h3>
    </div>
    <div class="row">
      <div class="col-12">
        <div ref="chartArticle" class="chart"></div>
      </div>
    </div>

    <div class="row">
      <h3 class="col-12">Thống kê số lượng giao dịch</h3>
    </div>
    <div class="row">
      <div class="col-6">
        <div ref="chartTransaction"></div>
      </div>
    </div>
  </section>
</template>

<script>

import {AdminTransactionService, ArticleService} from '../../../api/index'
import ApexCharts from 'apexcharts/dist/apexcharts.js'

export default {
  name: 'statistic',

  components: {},

  data () {
    return {
      data: [],
      dataTransaction: [],
      label: []
    }
  },

  mounted () {
    let optionsArticle = {
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      series: [
        {
          name: 'Số bài viết',
          data: this.data
        }
      ],
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    }

    let optionsTransaction = {
      series: this.label,
      labels: this.dataTransaction,
      chart: {
        type: 'donut'
      }
    }

    if (this.$refs.chartArticle) {
      new ApexCharts(this.$refs.chartArticle, optionsArticle).render()
    }

    if (this.$refs.chartTransaction) {
      new ApexCharts(this.$refs.chartTransaction, optionsTransaction).render()
    }
  },

  async beforeRouteEnter (to, from, next) {
    const {data, status} = await ArticleService.articleStatistics()
    if (status === 200) {
      to.meta.collection = data
      next()
    } else {
      store.commit('LOG_OUT')
      next({name: 'Login'})
    }
  },

  async created () {
    this.data = this.$route.meta.collection
    const transactions = await AdminTransactionService.transactionStatistics()
    await transactions.data.filter(val => {
      this.dataTransaction.push(val.status)
      this.label.push(val.count)
    })
  }

}
</script>
