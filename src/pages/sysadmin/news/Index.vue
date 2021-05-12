<template>

  <section class="content">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>

    <form class="form-inline mb-3" action="">
      <label for="exampleFormControlSelect1" class="ml-3 mb-3">Trạng thái: </label>
      <select class="form-control ml-3 mb-3" id="exampleFormControlSelect1" v-model="status">
        <option :value="0">Tất cả</option>
        <option :value="1">Đang hiển thị</option>
        <option :value="2">Đã ẩn</option>s
      </select>

      <div @click="filter" class="btn btn-primary ml-3 mb-3">Lọc tin tức</div>
      <div @click="unFilter" class="btn btn-primary ml-3 mb-3">Bỏ lọc</div>
    </form>

    <div class="row">
      <div class="col-12">
        <router-link :to="{ name: 'sysadmin/news.New' }">
          <button type="button" class="btn btn-info pull-left margin-bottom"><i class="fa fa-plus"></i> Thêm tin tức
          </button>
        </router-link>
      </div>
    </div>
    <BeeGridTable
      border
      :showSummary="false"
      :columns="columns"
      :data="dataFilter"
    >
      <template slot-scope="{ row }" slot="images">
        <img :src="row.images" class="img img-fluid" width="60px"/>
      </template>

      <template slot-scope="{ row }" slot="deleted">
        <p v-if="row.deleted">Đã ẩn</p>
        <p v-if="!row.deleted">Đang hiển thị</p>
      </template>
      <template slot-scope="{ row, index }" slot="op">
        <router-link :to="{ name: 'sysadmin/news.Edit', params: {id: row.newId}}">
          <Button type="warning" size="small" style="margin-right: 5px">Sửa</Button>
        </router-link>
        <Button type="success" size="small" v-if="row.deleted" @click="updateNewsStatus(row,'ACTIVE')">Hiển thị
        </Button>
        <Button type="error" size="small" v-if="!row.deleted" @click="updateNewsStatus(row,'BLOCK')">Ẩn
        </Button>
        <Button type="error" size="small" @click="updateNewsStatus(row,'DELETE', index)">Xóa</Button>
      </template>
    </BeeGridTable>

    <!-- /.row -->
  </section>
</template>

<script>
import {NewsService} from '../../../api/index'
import img from '../../../assets/default.jpg'

export default {
  name: 'staffs',

  components: {},

  data () {
    return {
      isLoading: false,
      columns: [
        {
          title: 'Mã tin tức',
          key: 'newId',
          fixed: 'left',
          width: 130,
          resizable: true,
          sortable: true
        },
        {
          title: 'Tiêu đề',
          key: 'title',
          width: 250,
          resizable: true,
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
          title: 'Trạng thái',
          key: 'deleted',
          slot: 'deleted',
          width: 150,
          resizable: true,
          sortable: true
        },
        {
          title: 'Người sửa cuối',
          key: 'lastModified',
          width: 250,
          resizable: true,
          sortable: true
        },
        {
          title: 'Ngày đăng',
          key: 'timeCreated',
          width: 200,
          resizable: false,
          sortable: true
        },
        {
          title: 'Ngày chỉnh sửa cuối',
          key: 'timeUpdated',
          width: 200,
          resizable: false,
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
          width: 200
        }
      ],
      data: [],
      dataFilter: [],
      status: 0
    }
  },

  async created () {
    const {data, status} = await NewsService.adminNews()
    if (status === 200) {
      this.data = this.dataFilter = data
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'Login'})
    }
  },

  computed: {},

  methods: {
    async updateNewsStatus (news, type, index = undefined) {
      this.isLoading = true

      setTimeout(async () => {
        try {
          if (type === 'ACTIVE') {
            const {data, status} = await NewsService.activeNews(news.newId)
            this.handleStatus(data, status)
            if (status === 200) {
              news.deleted = !news.deleted
            }
          }
          if (type === 'BLOCK') {
            const {data, status} = await NewsService.hideNews(news.newId)
            this.handleStatus(data, status)
            if (status === 200) {
              news.deleted = !news.deleted
            }
          }
          if (type === 'DELETE') {
            if (index !== undefined) {
              const {data, status} = await NewsService.deleteNews(news.newId)
              this.handleStatus(data, status)
              this.data.splice(index, 1)
              this.dataFilter = this.data
            } else {
              this.$toast.open({
                position: 'top-right',
                message: 'Bài viết không tồn tại',
                type: 'error'
              })
            }
          }
        } catch (e) {
          this.handleError(e)
        }

        this.isLoading = false
      }, 3000)
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
        this.dataFilter = this.data.filter(news => !news.deleted)
      } else {
        this.dataFilter = this.data.filter(news => news.deleted)
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
