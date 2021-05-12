<template>
  <div class="confirm-email">
    <div class="row mt-5">
      <div class="col-8">
        <div class="alert" :class="messageConfirm.status === 200 ? 'alert-success' : 'alert-danger'">
          <h5>{{messageConfirm.data.message}}</h5>
        </div>
      </div>
      <div class="col-4">
        <h2 class="mb-3">Danh mục cho thuê</h2>
        <ul class="list-group">
          <li class="list-group-item" @click="searchArticleByRoomType('cho_thue_nha_tro')">Cho thuê phòng trọ</li>
          <li class="list-group-item" @click="searchArticleByRoomType('cho_thue_can_ho')">Cho thuê căn hộ</li>
          <li class="list-group-item" @click="searchArticleByRoomType('tim_nguoi_o_ghep')">Tìm người ở ghép</li>
        </ul>
      </div>
      <div class="col-12">
        <h4 class="mt-3 mb-3">Bài đăng mới</h4>
        <div class="row">
          <div class="col-4 border p-3 mb-3" v-for="item in articleSuggestion" :key="item.id">
            <router-link  :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
              <div class="row">
                <div class="col-4">
                  <img v-if="!item.images[0]" src="../assets/default.jpg" :alt="item.title" class="img img-fluid img-thumbnail" width="100%">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import JwPagination from 'jw-vue-pagination'
import {AccountService, ArticleService} from '../api'
import img from '../assets/default.jpg'
export default {
  name: 'confirm-email',
  components: {
    JwPagination
  },

  data () {
    return {
      data: [],
      articleSuggestion: [],
      pageOfItems: [],
      messageConfirm: null
    }
  },

  async created () {
    this.messageConfirm = await AccountService.confirmEmail(window.location.search.replace('%40', '@'))
    this.articleSuggestion = await ArticleService.articlesSuggestion('')
  },

  methods: {
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

    replaceByDefault (e) {
      e.target.src = img
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
