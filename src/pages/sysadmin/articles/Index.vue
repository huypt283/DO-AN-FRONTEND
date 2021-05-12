<template>
  <section class="content">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>

    <h5>Lọc bài viết theo ngày đăng và trạng thái</h5>
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
        <label for="exampleFormControlSelect2">Trạng thái: </label>
        <select class="form-control" id="exampleFormControlSelect2" v-model="status">
          <option :value="0">Tất cả</option>
          <option :value="1">Đã khoá</option>
          <option :value="2">Đã ẩn</option>
          <option :value="3">Đang hiển thị</option>
          <option :value="4">Chưa được duyệt</option>
        </select>
      </div>
      <div class="form-group col-6">
        <label for="customer-name">Người đăng: </label>
        <input type="text" class="form-control" id="customer-name" v-model="customer"/>
      </div>

      <div @click="filter" class="btn btn-primary ml-auto">Lọc bài đăng</div>
      <div @click="unFilter" class="btn btn-primary ml-3 mr-3">Bỏ lọc</div>
    </form>

    <!--   Liên hệ   -->
    <div class="modal fade" id="lienHe" tabindex="-1" role="dialog" aria-labelledby="lienHeModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="lienHeModalLabel">Liên hệ</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" class="form-control" v-model="$v.formContact.title.$model">
                <span class="text-danger" v-if="!$v.formContact.title.required"
                      v-html=" 'Tiêu đề không được để trống<br>' "/>
                <span class="text-danger" v-if="!$v.formContact.title.minLength"
                      v-html=" 'Tiêu đề phải tối thiểu 5 kí tự<br>' "/>
                <span class="text-danger" v-if="!$v.formContact.title.maxLength"
                      v-html=" 'Tiêu đề có tối đa 220 kí tự<br>' "/>
              </div>
              <div class="form-group">
                <label>Nội dung</label>
                <textarea class="form-control" rows="3" v-model="$v.formContact.content.$model"></textarea>
                <span class="text-danger" v-if="!$v.formContact.content.required"
                      v-html=" 'Nội dung không được để trống<br>' "/>
                <span class="text-danger" v-if="!$v.formContact.content.minLength"
                      v-html=" 'Nội dung phải tối thiểu 10 kí tự<br>' "/>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" :disabled="this.$v.formContact.$invalid"
                    @click="contactCustomer"
                    data-dismiss="modal">Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--   Liên hệ   -->

    <!--   Khoá bài đăng   -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Khoá bài đăng</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Lý do</label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="reason"></textarea>
              <span class="text-danger" v-if="!$v.reason.required"
                    v-html=" 'Lí do không được để trống<br>' "/>
              <span class="text-danger" v-if="!$v.reason.minLength"
                    v-html=" 'Lý do phải có ít nhất 10 kí tự<br>' "/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Trở lại</button>
            <button type="button" class="btn btn-primary" :disabled="this.$v.reason.$invalid" @click="blockArticle"
                    data-dismiss="modal">Khoá
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--   Khoá bài đăng   -->

    <BeeGridTable
      border
      :showSummary="false"
      :columns="columns"
      :data="dataFilter"
    >
      <template slot-scope="{ row }" slot="title">
        <p>{{ row.title }}
          <span class="badge badge-info" data-toggle="modal" data-target="#lienHe"
                @click="updateArticleToContactId(row.articleId)">Liên hệ</span>
        </p>
      </template>
      <template slot-scope="{ row }" slot="customer">
        <p>{{ row.customer.name+ '<'+row.customer.email+'>' }}</p>
      </template>
      <template slot-scope="{ row }" slot="address">
        <p>{{ row.location.address }}</p>
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
      <template slot-scope="{ row }" slot="images">
        <img v-if="!row.images" src="../../../assets/default.jpg" class="img img-fluid" width="60px"/>
        <span v-if="row.images" v-for="item in row.images">
          <img :src="item" @error="replaceByDefault" class="img img-fluid" width="60px"/>
        </span>
      </template>
      <template slot-scope="{ row }" slot="vip">
        <p v-if="row.vip">Tin nổi bật</p>
        <p v-if="!row.vip">Tin thường</p>
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
      <template slot-scope="{ row, index }" slot="op">
        <Button
          type="success"
          size="small"
          @click="updateArticleStatus(row, 'ACTIVE')"
          v-if="!row.blocked && row.deleted !== false && (0 < row.days || new Date(row.expDate).getTime() > Date.now())">
          Duyệt
        </Button>

        <Button
          type="success"
          size="small"
          @click="updateArticleStatus(row, 'UNBLOCK')"
          v-if="row.blocked">Mở khoá
        </Button>

        <Button
          type="error"
          size="small"
          data-toggle="modal"
          @click="updateArticleBlock(row)"
          data-target="#exampleModal"
          v-if="!row.blocked">Khoá
        </Button>
      </template>
    </BeeGridTable>
  </section>
</template>

<script>
import {ArticleService} from '../../../api'
import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import moment from 'moment'
import img from '../../../assets/default.jpg'

export default {
  name: 'articles',

  components: {},

  data () {
    return {
      isLoading: false,
      startDate: undefined,
      endDate: undefined,
      status: 0,
      customer: '',
      columns: [
        {
          title: 'Mã bài đăng',
          key: 'articleId',
          fixed: 'left',
          width: 130,
          resizable: true,
          sortable: true
        },
        {
          title: 'Tiêu đề',
          key: 'title',
          slot: 'title',
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
          title: 'Người đăng',
          key: 'customer',
          slot: 'customer',
          hideFilter: true,
          width: 200,
          resizable: true,
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
          align: 'center',
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
          width: 200,
          resizable: true,
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
          filterHeight: 50,
          width: 150
        }
      ],
      data: [],
      dataFilter: [],
      articleToContactId: undefined,
      articleBlock: undefined,
      reason: '',
      formContact: {
        title: '',
        content: ''
      }
    }
  },

  validations: {
    reason: {required, minLength: minLength(10)},
    formContact: {
      title: {required, minLength: minLength(5), maxLength: maxLength(220)},
      content: {required, minLength: minLength(10)}
    }
  },

  async created () {
    const {data, status} = await ArticleService.adminArticles()
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

  computed: {},

  methods: {
    async updateArticleStatus (article, type) {
      this.isLoading = true

      setTimeout(async () => {
        try {
          if (type === 'ACTIVE') {
            const {data, status} = await ArticleService.activeArticle(article.articleId)
            this.handleStatus(data, status)
            if (status === 200) {
              article.deleted = false
            }
          }
          if (type === 'UNBLOCK') {
            const {data, status} = await ArticleService.unblockArticle(article.articleId)
            this.handleStatus(data, status)
            if (status === 200) {
              article.blocked = !article.blocked
            }
          }
        } catch (e) {
          this.handleError(e)
        }

        this.isLoading = false
      }, 1500)
    },

    updateArticleBlock (article) {
      this.articleBlock = article
    },
    async blockArticle () {
      if (this.$v.reason.$invalid || this.articleBlock === undefined) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await ArticleService.blockArticle(this.articleBlock.articleId, {'reason': this.reason})
          this.handleStatus(data, status)
          if (status === 200) {
            this.articleBlock.blocked = !this.articleBlock.blocked
          }
        } catch (e) {
          this.handleError(e)
        }
        this.isLoading = false
      }, 1500)
    },

    updateArticleToContactId (articleId) {
      this.articleToContactId = articleId
    },
    async contactCustomer () {
      if (this.$v.formContact.$invalid) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await ArticleService.contactCustomer(this.articleToContactId, this.formContact)
          this.handleStatus(data, status)
          if (status === 200) {
            this.articleBlock.blocked = !this.articleBlock.blocked
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
            message: data.reason ? data.reason : 'Dữ liệu không hợp lệ',
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
        if (this.customer !== '') {
          filterResult = filterResult && (article.customer.name.includes(this.customer) || article.customer.email.includes(this.customer))
        }
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
      this.customerName = ''
      this.dataFilter = this.data
    },

    formatTime (time) {
      return moment(time).format('DD/MM/YYYY')
    },

    replaceByDefault (e) {
      e.target.src = img
    }
  }

}
</script>
