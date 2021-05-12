<template>
  <section class="content">

    <form class="mb-3 row" action="">
      <div class="form-group col-6">
        <label for="startDate">Ngày bắt đầu: </label>
        <input type="date" class="form-control" id="startDate" v-model="startDate"/>
      </div>
      <div class="form-group col-6">
        <label for="endDate">Ngày kết thúc: </label>
        <input type="date" class="form-control" id="endDate" v-model="endDate"/>
      </div>
      <div class="form-group col-6">
        <label for="exampleFormControlSelect2">Hình thức thanh toán: </label>
        <select class="form-control" id="exampleFormControlSelect2" v-model="payType">
          <option :value="''">Tất cả</option>
          <option :value="true">Nạp tiền</option>
          <option :value="false">Thanh toán</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label for="exampleFormControlSelect1">Trạng thái: </label>
        <select class="form-control" id="exampleFormControlSelect1" v-model="status">
          <option :value="''">Tất cả</option>
          <option :value="'Thành công'">Thành công</option>
          <option :value="'Chưa hoàn thành'">Chưa hoàn thành</option>
          <option :value="'Huỷ bỏ'">Huỷ bỏ</option>
        </select>
      </div>

      <div @click="filter" class="btn btn-primary ml-auto">Lọc giao dịch</div>
      <div @click="unFilter" class="btn btn-primary ml-3 mr-3">Bỏ lọc</div>
    </form>

    <div class="form-group col-12">
      <label for="totalOut">Tổng tiền thanh toán khi đăng bài theo thời gian lọc: </label>
      <span id="totalOut"> {{ totalOutFilter }} VNĐ</span>
    </div>
    <div class="form-group col-12">
      <label for="totalIn">Tổng tiền nạp vào theo thời gian lọc: </label>
      <span id="totalIn"> {{ totalInFilter }} VNĐ</span>
    </div>
    <div class="form-group col-12">(Tổng tiền không được tính đối với giao dịch bị huỷ bỏ hoặc chưa hoàn thành)</div>

    <BeeGridTable
      border
      :showSummary="false"
      :columns="columns"
      :data="dataFilter"
    >
      <template slot-scope="{ row }" slot="timeCreated">
        <p>{{ formatTime(row.timeCreated) }}</p>
      </template>
      <template slot-scope="{ row }" slot="amount">
        <p>{{ row.amount }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="payment">
        <p v-if="row.payment">Nạp tiền</p>
        <p v-if="!row.payment">Thanh toán</p>
      </template>
    </BeeGridTable>
  </section>
</template>

<script>
import {AdminTransactionService} from '../../../api/index'
import moment from 'moment'

export default {
  name: 'sample',

  components: {},

  data () {
    return {
      totalOut: 0,
      totalIn: 0,
      totalOutFilter: 0,
      totalInFilter: 0,
      startDate: undefined,
      endDate: undefined,
      status: '',
      payType: '',
      columns: [
        {
          title: 'Mã giao dịch',
          key: 'transactionId',
          fixed: 'left',
          width: 150,
          filterHeight: 50,
          resizable: true,
          sortable: true
        },
        {
          title: 'Người giao dịch',
          key: 'email',
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: 'Ngày giao dịch',
          key: 'timeCreated',
          slot: 'timeCreated',
          width: 150,
          hideFilter: true,
          resizable: true,
          sortable: true
        },
        {
          title: 'Số tiền',
          key: 'amount',
          slot: 'amount',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Hình thức thanh toán',
          key: 'payment',
          slot: 'payment',
          hideFilter: true,
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: 'Trạng thái',
          key: 'status',
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: 'Mô tả',
          key: 'description',
          width: 450,
          resizable: true,
          sortable: true
        }
      ],
      data: [],
      dataFilter: []
    }
  },

  async created () {
    const {data, status} = await AdminTransactionService.adminTransactions()
    if (status === 200) {
      this.data = this.dataFilter = data
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'client.Home'})
    }

    this.data.forEach(transaction => {
      if (transaction.status === 'Thành công') {
        if (transaction.payment) {
          this.totalIn += transaction.amount
        } else {
          this.totalOut += transaction.amount
        }
      }
    })
    this.totalInFilter = this.totalIn
    this.totalOutFilter = this.totalOut
  },

  computed: {},

  methods: {
    filter () {
      this.totalInFilter = 0
      this.totalOutFilter = 0
      this.dataFilter = this.data.filter(transaction => {
        let filterResult = true
        if (this.startDate) {
          filterResult = filterResult && moment(transaction.timeCreated).format('YYYY-MM-DD') >= moment(this.startDate).format('YYYY-MM-DD')
        }
        if (this.endDate) {
          filterResult = filterResult && moment(transaction.timeCreated).format('YYYY-MM-DD') <= moment(this.endDate).format('YYYY-MM-DD')
        }

        // calMoney
        if (filterResult && transaction.status === 'Thành công') {
          if (transaction.payment) {
            this.totalInFilter += transaction.amount
          } else {
            this.totalOutFilter += transaction.amount
          }
        }

        if (this.status !== '') {
          filterResult = filterResult && transaction.status === this.status
        }
        if (this.payType !== '') {
          filterResult = filterResult && transaction.payment
        }
        return filterResult
      })
    },

    unFilter () {
      this.startDate = undefined
      this.endDate = undefined
      this.status = ''
      this.payType = ''
      this.dataFilter = this.data
      this.totalInFilter = this.totalIn
      this.totalOutFilter = this.totalOut
    },

    formatTime (time) {
      return moment(time).format('DD/MM/YYYY')
    }
  }

}
</script>
