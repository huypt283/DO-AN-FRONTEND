<template>
  <div class="news">
    <br>
    <h3>Tin tức</h3>
    <div class="row mt-5">
      <div class="col-8">
        <div class="row">
          <div class="col-12">
            <ul class="list-group list-group-flush">
              <li class="list-group-item pl-0" v-for="item in data" :key="item.newId">
                <router-link :to="{ name: 'client.NewsDetail', params: {slug: item.slug}}">
                  <div class="row">
                    <div class="col-3">
                      <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title"
                           class="img img-fluid img-thumbnail" width="100%">
                      <img
                        v-if="item.images[0]"
                        :src="item.images[0]"
                        :alt="item.title"
                        @error="replaceByDefault"
                        class="img img-fluid img-thumbnail" width="100%">
                    </div>
                    <div class="col-9">
                      <h4 class="mb-0">
                        <p class="text-dark nav-link p-0">{{ item.title }}</p>
                      </h4>
                      <small class="d-block text-secondary">Cập nhật: {{ formatTime(item.timeUpdated) }}</small>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
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
          <router-link :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
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
        <div class="border p-3" v-for="item in newsSuggestion" :key="item.id">
          <router-link :to="{ name: 'client.NewsDetail', params: {slug: item.slug}}">
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
import {mapGetters} from 'vuex'
import JwPagination from 'jw-vue-pagination'
import {ArticleService, NewsService} from '../../api/index'
import moment from 'moment'
import img from '../../assets/default.jpg'

export default {
  name: 'news',
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
    this.data = await NewsService.news()
    this.newsSuggestion = await NewsService.newsSuggestion()
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
    },
    onChangePage (pageOfItems) {
      this.pageOfItems = pageOfItems
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
</style>
