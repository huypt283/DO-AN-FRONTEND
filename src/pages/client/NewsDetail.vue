<template>
  <div class="news-detail">
    <br>
    <h3>Tin tức</h3>
    <div class="row mt-5">
      <div class="col-8">
        <div class="row">
          <div class="col-12">
            <h1 class="mb-3">{{ data.title }}</h1>
            <hooper style="height: 500px" class="bg-light border">
              <slide v-if="data.images" class="text-center" v-for="item in data.images">
                <img :src="item" @error="replaceByDefault" class="img img-fluid h-100">
              </slide>
              <hooper-navigation slot="hooper-addons"></hooper-navigation>
            </hooper>
            <div class="card">
              <div class="card-body news-content" style="overflow: hidden;">
                <div v-html="data.content"></div>
              </div>
            </div>
          </div>
        </div>
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
          <router-link :to="{ name: 'client.ArticleDetail', params: {slug: item.slug} }">
            <div class="row">
              <div class="col-4">
                <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title"
                     class="img img-fluid img-thumbnail" width="100%">
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
        <div class="border p-3" v-for="item in newsSuggestion" :key="item.newId">
          <router-link :to="{ name: 'client.NewsDetail', params: {slug: item.slug} }">
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
import {Hooper, Slide, Navigation as HooperNavigation} from 'hooper'
import 'hooper/dist/hooper.css'
import {ArticleService, NewsService} from '../../api/index'
import img from '../../assets/default.jpg'
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  name: 'detail',

  components: {
    Hooper,
    Slide,
    HooperNavigation
  },

  data () {
    return {
      newsSuggestion: [],
      articleSuggestion: [],
      data: {}
    }
  },

  async beforeRouteEnter (to, from, next) {
    const {data, status} = await NewsService.newsDetail(to.params.slug)

    if (status === 200) {
      to.meta.collection = data
      next()
    } else {
      next({name: 'ErrorPage'})
    }
  },

  async beforeRouteUpdate (to, from, next) {
    const {data, status} = await NewsService.newsDetail(to.params.slug)
    if (status === 200) {
      this.data = data
      next()
    } else {
      next({name: 'ErrorPage'})
    }
  },

  async created () {
    this.data = this.$route.meta.collection
    this.newsSuggestion = await NewsService.news()
    if (this.profile) {
      this.articleSuggestion = await ArticleService.articlesSuggestion(this.profile.email)
    } else {
      this.articleSuggestion = await ArticleService.articlesSuggestion('')
    }
  },

  methods: {
    async searchArticleByRoomType (typeRoom) {
      await this.$router.push(
        {
          name: 'client.Search',
          params: {
            'roomType': typeRoom,
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

<style>
.news-content img {
  width: 100% !important;
}
</style>
