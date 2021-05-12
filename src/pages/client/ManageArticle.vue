<template>
  <div class="article-manager">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Gia hạn</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="exampleFormControlSelect1">Bài đăng cần gia hạn</label><label class="text-danger">*</label>
              <select class="form-control mb-3" id="exampleFormControlSelect1" v-model="formData.extendSelected">
                <option v-for="item in data" :key="item.articleId"
                        v-if="!item.blocked" :value="item.articleId">
                  {{ item.articleId }} - {{ item.title }}
                </option>
              </select>
              <div class="form-group">
                <label>Gói thời gian</label><label class="text-danger">*</label>
                <select class="form-control mb-3" v-model="formData.timeType" @change="getTypeTime">
                  <option :value="'day'">Ngày</option>
                  <option :value="'week'">Tuần</option>
                  <option :value="'month'">Tháng</option>
                </select>
              </div>
              <div class="form-group">
                <label>Số {{ typeTime }}</label><label class="text-danger">*</label>
                <input type="number" class="form-control" v-model="formData.times" min="1">
              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Trở lại</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="extendTime"
                    :disabled="this.$v.formData.$invalid">Gia hạn bài đăng
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mt-4">
        <li class="breadcrumb-item"><a href="#">Phongtro283</a></li>
        <li class="breadcrumb-item"><a href="#">Quản lý</a></li>
        <li class="breadcrumb-item active" aria-current="page">Quản lý bài đăng</li>
      </ol>
    </nav>

    <h1>Quản lý bài đăng</h1>

    <hr/>
    <br>

    <h5>Lọc bài viết theo ngày đăng và trạng thái</h5>
    <form class="mb-3 row" action="">
      <div class="form-group col-4">
        <label for="startDate">Ngày bắt đầu: </label>
        <input type="date" class="form-control" id="startDate" v-model="startDate"/>
      </div>
      <div class="form-group col-4">
        <label for="endDate">Ngày kết thúc: </label>
        <input type="date" class="form-control" id="endDate" v-model="endDate"/>
      </div>
      <div class="form-group col-4">
        <label for="exampleFormControlSelect2">Trạng thái: </label>
        <select class="form-control" id="exampleFormControlSelect2" v-model="status">
          <option :value="0">Tất cả</option>
          <option :value="1">Đã khoá</option>
          <option :value="2">Đã ẩn</option>
          <option :value="3">Đang hiển thị</option>
          <option :value="4">Chưa được duyệt</option>
        </select>
      </div>

      <div @click="filter" class="btn btn-primary ml-auto">Lọc bài đăng</div>
      <div @click="unFilter" class="btn btn-primary ml-3 mr-3">Bỏ lọc</div>
    </form>

    <router-link :to="{ name: 'client.CreateArticle' }">
      <button type="button" class="btn btn-info mb-3 mt-3"><i class="fa fa-plus"></i> Đăng tin mới
      </button>
    </router-link>

    <button type="button" class="btn btn-info mb-3 mt-3" data-toggle="modal" data-target="#exampleModal">
      Gia hạn
    </button>

    <BeeGridTable
      border
      :showSummary="false"
      :columns="columns"
      :data="dataFilter"
    >
      <template slot-scope="{ row }" slot="address">
        <p>{{ row.location.address }}</p>
      </template>
      <template slot-scope="{ row }" slot="images">
        <img v-if="!row.images" alt="Ảnh phòng" src="../../assets/default.jpg" class="img img-fluid" width="60px"/>
        <img v-if="row.images" alt="Ảnh phòng" :src="row.images[0]" class="img img-fluid" @error="replaceByDefault"
             width="60px"/>
      </template>
      <template slot-scope="{ row }" slot="status">
        <p v-if="row.blocked">Đã khoá</p>
        <p v-if="!row.blocked && row.deleted">Đã ẩn</p>
        <p v-if="!row.blocked && row.deleted === false">Đang hiển thị</p>
        <p v-if="!row.blocked && row.deleted === null">Chưa được duyệt</p>
      </template>
      <template slot-scope="{ row }" slot="roomType">
        <p v-if="row.roomType === 'cho_thue_nha_tro'">Cho thuê phòng trọ</p>
        <p v-if="row.roomType === 'cho_thue_can_ho'">Cho thuê căn hộ</p>
        <p v-if="row.roomType === 'tim_nguoi_o_ghep'">Tìm người ở ghép</p>
      </template>
      <template slot-scope="{ row }" slot="vip">
        <p v-if="row.vip">Tin nổi bật</p>
        <p v-if="!row.vip">Tin thường</p>
      </template>
      <template slot-scope="{ row }" slot="expDate">
        <p>{{ row.expDate }}</p>
      </template>
      <template slot-scope="{ row }" slot="roomPrice">
        <p>{{ row.roomPrice }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="wifiPrice">
        <p>{{ row.roomService.wifiPrice }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="electricPrice">
        <p>{{ row.roomService.electricPrice }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="waterPrice">
        <p>{{ row.roomService.waterPrice }} VNĐ</p>
      </template>
      <template slot-scope="{ row }" slot="acreage">
        <p>{{ row.acreage }} m2</p>
      </template>
      <template slot-scope="{ row }" slot="gender">
        <p v-if="row.gender === true">Nam</p>
        <p v-if="row.gender === false">Nữ</p>
      </template>
      <template slot-scope="{ row }" slot="accountBalance">
        <p>{{ row.accountBalance }} VNĐ</p>
      </template>
      <template slot-scope="{ row, index }" slot="op">
        <router-link :to="{ name: 'client.EditArticle', params: {id: row.articleId}}">
          <button class="btn btn-success">Cập nhật</button>
        </router-link>

        <button class="btn btn-success" v-if="!row.blocked && row.deleted && row.expDate !== null &&
         new Date(row.expDate).getTime() > Date.now()" @click="updateArticleStatus(row.articleId,'ACTIVE')">Hiển thị
        </button>

        <button class="btn btn-danger" v-if="row.deleted === false" @click="updateArticleStatus(row.articleId,'HIDE')">
          Ẩn
        </button>

<!--        <button class="btn btn-danger" @click="updateArticleStatus(row.articleId,'DELETE')">-->
<!--          Xoá-->
<!--        </button>-->
      </template>
    </BeeGridTable>
  </div>
</template>
<script>
import {CustomerService} from '../../api/index'
import {minValue, required} from 'vuelidate/lib/validators'
import img from '../../assets/default.jpg'
import store from '../../store/index'
import moment from 'moment'

export default {
  name: 'article-manager',
  components: {},
  data () {
    return {
      isLoading: false,
      startDate: undefined,
      endDate: undefined,
      status: 0,
      columns: [
        {
          title: 'Mã bài đăng',
          key: 'articleId',
          fixed: 'left',
          width: 130,
          resizable: false,
          sortable: true
        },
        {
          title: 'Tiêu đề',
          key: 'title',
          width: 220,
          resizable: true,
          sortable: true
        },
        {
          title: 'Trạng thái',
          key: 'status',
          slot: 'status',
          hideFilter: true,
          width: 150,
          resizable: false,
          sortable: false
        },
        {
          title: 'Gói tin',
          key: 'vip',
          slot: 'vip',
          hideFilter: true,
          width: 120,
          resizable: false,
          sortable: true
        },
        {
          title: 'Ngày hết hạn',
          key: 'expDate',
          slot: 'expDate',
          hideFilter: true,
          width: 150,
          resizable: false,
          sortable: true
        },
        {
          title: 'Hình ảnh',
          key: 'images',
          slot: 'images',
          align: 'center',
          hideFilter: true,
          width: 120,
          resizable: true,
          sortable: false
        },
        {
          title: 'Loại tin',
          key: 'roomType',
          slot: 'roomType',
          hideFilter: true,
          width: 200,
          resizable: false,
          sortable: true
        },
        {
          title: 'Số ngày hiển thị sau khi duyệt',
          key: 'days',
          width: 250,
          resizable: false,
          sortable: true
        },
        {
          title: 'Địa chỉ',
          key: 'address',
          slot: 'address',
          width: 300,
          resizable: true,
          sortable: true
        },
        {
          title: 'Giá phòng',
          key: 'roomPrice',
          slot: 'roomPrice',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Giá wifi',
          key: 'roomService',
          slot: 'wifiPrice',
          width: 120,
          resizable: true,
          sortable: true
        },
        {
          title: 'Giá điện',
          key: 'roomService',
          slot: 'electricPrice',
          width: 120,
          resizable: true,
          sortable: true
        },
        {
          title: 'Giá nước',
          key: 'roomService',
          slot: 'waterPrice',
          width: 120,
          resizable: true,
          sortable: true
        },
        {
          title: 'Diện tích',
          key: 'acreage',
          slot: 'acreage',
          width: 120,
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
          width: 220
        }
      ],
      data: [],
      dataFilter: [],
      formData: {
        extendSelected: null,
        times: 1,
        timeType: 'day'
      },
      typeTime: 'ngày'
    }
  },

  validations: {
    formData: {
      extendSelected: {required},
      timeType: {required},
      times: {required, minValue: minValue(1)}
    }
  },

  async created () {
    const {data, status} = await CustomerService.customersArticles()
    if (status === 200) {
      this.data = this.dataFilter = data
    } else {
      store.commit('LOG_OUT')
      await this.$router.push({name: 'Login'})
    }
  },
  methods: {
    getTypeTime () {
      switch (this.$v.formData.timeType.$model) {
        case 'day':
          this.typeTime = 'ngày'
          break
        case 'week':
          this.typeTime = 'tuần'
          break
        case 'month':
          this.typeTime = 'tháng'
          break
      }
    },

    async updateArticleStatus (id, type) {
      this.isLoading = true
      setTimeout(async () => {
        try {
          if (type === 'ACTIVE') {
            const {data, status} = await CustomerService.customersArticlesShow(id)
            this.handleStatus(data, status)
          }
          if (type === 'HIDE') {
            const {data, status} = await CustomerService.customersArticlesHide(id)
            this.handleStatus(data, status)
          }
          if (type === 'DELETE') {
            const {data, status} = CustomerService.customersArticlesDelete(id)
            this.handleStatus(data, status)
          }
        } catch (e) {
          this.handleError(e)
        }
        this.isLoading = false

        await this.fetch()
      }, 1500)
    },

    async extendTime () {
      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await CustomerService.extendArticle(this.formData.extendSelected, {
            'times': this.formData.times,
            'timeType': this.formData.timeType
          })
          this.handleStatus(data, status)
        } catch (e) {
          this.handleError(e)
        }
        this.isLoading = false

        await this.fetch()
      }, 1500)
    },

    async fetch () {
      const {data, status} = await CustomerService.customersArticles()
      if (status === 200) {
        this.data = this.dataFilter = data
      } else {
        store.commit('LOG_OUT')
        await this.$router.push({name: 'Login'})
      }
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
      this.dataFilter = this.data.filter(article => {
        let filterResult = true
        if (this.startDate) {
          filterResult = filterResult && moment(article.timeCreated).format('YYYY-MM-DD') >= moment(this.startDate).format('YYYY-MM-DD')
        }
        if (this.endDate) {
          filterResult = filterResult && moment(article.timeCreated).format('YYYY-MM-DD') <= moment(this.endDate).format('YYYY-MM-DD')
        }

        if (this.status !== 0) {
          if (this.status === 1) {
            filterResult = filterResult && article.blocked
          } else {
            filterResult = filterResult && !article.blocked
            if (this.status === 2) {
              filterResult = filterResult && article.deleted
            } else if (this.status === 3) {
              filterResult = filterResult && article.deleted === false
            } else {
              filterResult = filterResult && article.deleted === null
            }
          }
        }
        return filterResult
      })
    },
    unFilter () {
      this.startDate = undefined
      this.endDate = undefined
      this.status = 0
      this.dataFilter = this.data
    },

    replaceByDefault (e) {
      e.target.src = img
    }
  }
}
</script>

<style scoped>
</style>
