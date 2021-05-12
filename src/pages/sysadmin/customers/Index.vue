<template>
  <section class="content">

    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>

    <form class="form-inline mb-3" action="">
      <label for="exampleFormControlSelect1" class="ml-3">Trạng thái: </label>
      <select class="form-control ml-3" id="exampleFormControlSelect1" v-model="status">
        <option :value="0">Tất cả</option>
        <option :value="1">Chưa kích hoạt</option>
        <option :value="2">Đang hoạt động</option>
        <option :value="3">Đã khoá</option>
      </select>

      <div @click="filter" class="btn btn-primary ml-3">Lọc khách hàng</div>
      <div @click="unFilter" class="btn btn-primary ml-3">Bỏ lọc</div>
    </form>

    <BeeGridTable
      border
      :showSummary="false"
      :columns="columns"
      :data="dataFilter"
    >
      <template slot-scope="{ row }" slot="image">
        <img v-if="!row.image" src="../../../assets/default-avatar.jpg" class="img img-fluid" width="60px"/>
        <img v-if="row.image" :src="row.image" @error="replaceByDefault" class="img img-fluid" width="60px"/>
      </template>
      <template slot-scope="{ row }" slot="gender">
        <p v-if="row.gender === true">Nam</p>
        <p v-if="row.gender === false">Nữ</p>
      </template>
      <template slot-scope="{ row }" slot="accountBalance">
        <p>{{ row.accountBalance }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="deleted">
        <p v-if="!row.enabled">Chưa kích hoạt</p>
        <p v-if="row.enabled && !row.deleted">Đang hoạt động</p>
        <p v-if="row.enabled && row.deleted">Đã khoá</p>
      </template>
      <template slot-scope="{ row, index }" slot="op">
        <Button type="success" size="small" v-if="row.deleted" @click="updateCustomerStatus(row,'ACTIVE')">
          Mở khoá
        </Button>
        <Button type="error" size="small" v-if="!row.deleted" @click="updateCustomerStatus(row,'BLOCK')">
          Khóa
        </Button>
        <!--        <Button type="error" size="small"  @click="updateCustomerStatus(row.customerId,'DELETE')">Xóa</Button>-->
      </template>
    </BeeGridTable>
  </section>
</template>

<script>
import {CustomerService} from '../../../api/index'
import img from '../../../assets/default-avatar.jpg'

export default {
  name: 'sample',

  components: {},

  data () {
    return {
      isLoading: false,
      columns: [
        {
          title: 'Mã khách hàng',
          key: 'customerId',
          fixed: 'left',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Email',
          key: 'email',
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: 'Họ tên',
          key: 'name',
          width: 200,
          resizable: true,
          sortable: true
        },
        {
          title: 'Trạng thái',
          key: 'deleted',
          slot: 'deleted',
          hideFilter: true,
          width: 150,
          resizable: false,
          sortable: true
        },
        {
          title: 'Số điện thoại',
          key: 'phone',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Hình ảnh',
          key: 'image',
          slot: 'image',
          align: 'center',
          hideFilter: true,
          width: 120,
          resizable: true,
          sortable: false
        },
        {
          title: 'Giới tính',
          key: 'gender',
          slot: 'gender',
          hideFilter: true,
          width: 120,
          resizable: false,
          sortable: true
        },
        {
          title: 'CMND',
          key: 'cardId',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Số dư',
          key: 'accountBalance',
          slot: 'accountBalance',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Ngày sinh',
          key: 'birthday',
          hideFilter: true,
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: '',
          slot: 'op',
          headSlot: 'hop',
          fixed: 'right',
          canEdit: false,
          key: 'op',
          hideFilter: true,
          resizable: true,
          filterHeight: 50,
          width: 120
        }
      ],
      data: [],
      dataFilter: [],
      status: 0
    }
  },

  async created () {
    const {data, status} = await CustomerService.customers()
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
  },

  methods: {
    async updateCustomerStatus (customer, type) {
      this.isLoading = true

      setTimeout(async () => {
        try {
          if (type === 'ACTIVE') {
            const {data, status} = await CustomerService.active(customer.customerId)
            this.handleStatus(data, status)
            if (status === 200) {
              customer.deleted = !customer.deleted
            }
          }
          if (type === 'BLOCK') {
            const {data, status} = await CustomerService.block(customer.customerId)
            this.handleStatus(data, status)
            if (status === 200) {
              customer.deleted = !customer.deleted
            }
          }
        } catch (e) {
          this.handleError(e)
        }

        this.isLoading = false
      }, 1500)
    },

    handleStatus (data, status) {
      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: data.message,
          type: 'success'
        })
      } else {
        if (status === 400 && data.message === undefined) {
          this.$toast.open({
            position: 'top-right',
            message: 'Dữ liệu không hợp lệ',
            type: 'error'
          })
        } else {
          this.$toast.open({
            position: 'top-right',
            message: data.message,
            type: 'error'
          })
        }
      }
    },

    handleError (e) {
      this.$toast.open({
        position: 'top-right',
        message: e,
        type: 'error'
      })
    },

    onCancel () {
      console.log('User cancelled the loader.')
    },

    filter () {
      if (this.status === 0) {
        this.dataFilter = this.data
      } else if (this.status === 1) {
        this.dataFilter = this.data.filter(customer => !customer.enabled)
      } else if (this.status === 2) {
        this.dataFilter = this.data.filter(customer => customer.enabled && !customer.deleted)
      } else {
        this.dataFilter = this.data.filter(customer => customer.enabled && customer.deleted)
      }
    },

    unFilter () {
      this.status = 0
      this.dataFilter = this.data
    },

    replaceByDefault (e) {
      e.target.src = img
    }
  }

}
</script>
