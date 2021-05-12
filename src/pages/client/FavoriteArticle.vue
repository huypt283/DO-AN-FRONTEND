<template>
  <div class="favorite-article">
    <br>
    <h3>Bài đăng đã lưu</h3>
    <div class="row mt-5">
      <div class="col-8">
        <div class="border p-3" v-for="(item, index) in pageOfItems" :key="item.id">
            <div class="row">
              <div class="col-4 position-relative">
                <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title" class="img img-fluid img-thumbnail" width="100%">
                <img
                  v-if="item.images[0]"
                  :src="item.images[0]"
                  @error="replaceByDefault"
                  :alt="item.title"
                  class="img img-fluid img-thumbnail"
                  width="100%"
                >
              </div>
              <div class="col-8">
                <router-link  :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
                  <h5 class="text-danger font-weight-bold">{{ item.title }}</h5>
                  <h6 class="text-success font-weight-bold">{{ item.roomPrice }} VNĐ</h6>
                  <span class="d-block">{{ item.acreage }}m²</span>
                  <span class="d-block">{{ item.location['districtName'] }}, {{ item.location['cityName'] }}</span>
                  <small class="d-block text-secondary">Cập nhật: {{ formatTime(item.lastUpdateTime) }}</small>
                </router-link>
                <i class="fa fa-heart wl" :class="{'wl-active': item.favorite}" @click="favoriteArticle(item, index)"></i>
              </div>
            </div>
        </div>
        <jw-pagination class="mt-4" :items="data" @changePage="onChangePage"></jw-pagination>
      </div>
      <div class="col-4">
        <h2>Danh mục cho thuê</h2>
        <ul class="list-group">
          <li class="list-group-item" @click="searchArticleByRoomType('cho_thue_nha_tro')">Cho thuê phòng trọ</li>
          <li class="list-group-item" @click="searchArticleByRoomType('cho_thue_can_ho')">Cho thuê căn hộ</li>
          <li class="list-group-item" @click="searchArticleByRoomType('tim_nguoi_o_ghep')">Tìm người ở ghép</li>
        </ul>
        <h4 class="mt-3">Có thể bạn quan tâm</h4>
        <div class="border p-3" v-for="item in articleSuggestion" :key="item.id">
          <router-link  :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
            <div class="row">
              <div class="col-4">
                <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title" class="img img-fluid img-thumbnail" width="100%">
                <img
                  v-if="item.images[0]"
                  :src="item.images[0]"
                  :alt="item.title"
                  @error="replaceByDefault"
                  class="img img-fluid img-thumbnail" width="100%">
              </div>
              <div class="col-8">
                <h6 class="text-danger font-weight-bold">{{ item.title }}</h6>
                <span class="text-success font-weight-bold">{{ item.roomPrice }} VNĐ</span>
              </div>
            </div>
          </router-link>
        </div>

        <h4 class="mt-3">Tin tức mới</h4>
        <div class="border p-3" v-for="item in newsSuggestion" :key="item.id">
          <router-link  :to="{ name: 'client.NewsDetail', params: {slug: item.slug}}">
            <div class="row">
              <div class="col-4">
                <img :src="item.images[0]" :alt="item.title" class="img img-fluid img-thumbnail" width="100%">
              </div>
              <div class="col-8">
                <h6 class="text-danger font-weight-bold">{{ item.title }}</h6>
                <span class="text-success font-weight-bold">{{ item.price }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import JwPagination from 'jw-vue-pagination'
import {AddressService, ArticleService, NewsService, CustomerService} from '../../api/index'
import moment from 'moment'
import img from '../../assets/default.jpg'
export default {
  name: 'favorite-article',
  components: {
    JwPagination
  },
  data () {
    return {
      data: [],
      newsSuggestion: [],
      articleSuggestion: [],
      pageOfItems: []
    }
  },

  async created () {
    const {data, status} = await ArticleService.favoriteArticle()
    if (status === 200) {
      this.data = data
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'client.Home'})
    }

    this.newsSuggestion = await NewsService.news()
    if (this.profile) {
      this.articleSuggestion = await ArticleService.articlesSuggestion(this.profile.email)
    } else {
      this.articleSuggestion = await ArticleService.articlesSuggestion('')
    }
  },

  methods: {
    async favoriteArticle (article, index) {
      const {data, status} = await CustomerService.customersFavorite(article.articleId)
      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: data.message,
          type: 'success'
        })
        article.favorite = !article.favorite
        this.data.splice(index, 1)
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

    async searchArticleByRoomType (typeRoom) {
      await this.$router.push(
        {name: 'client.Search',
          params: {'roomType': typeRoom,
            'city': 'tat-ca',
            'district': 'tat-ca',
            'ward': 'tat-ca',
            'minAcreage': 0,
            'maxAcreage': 999999999,
            'minPrice': 0,
            'maxPrice': 999999999
          }
        })
    },
    async getDistrict () {
      if (this.citySelected !== null) {
        this.districts = await AddressService.districtDetail(this.citySelected)
      }
    },
    async getWard () {
      if (this.districtSelected !== null) {
        this.wards = await AddressService.wardDetail(this.districtSelected)
      }
    },
    onChangePage (pageOfItems) {
      this.pageOfItems = pageOfItems
    },

    replaceByDefault (e) {
      e.target.src = img
    },
    formatTime (time) {
      return moment(time).format('DD/MM/YYYY')
    }
  },

  computed: {
    ...mapGetters([
      'profile'
    ])
  }
}
</script>

<style scoped>
.wl {
  position: absolute;
  top: 5px;
  font-size: 30px;
  right: 25px;
}

.wl:hover{
  color: #ff0000;
}

.wl-active:hover{
  color: #515a6e;
}

.wl-active {
  color: #ff0000;
}
</style>
