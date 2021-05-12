<template>
  <div class="search-article">
    <div class="card mt-3">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label>Loại tin</label>
              <select class="form-control" v-model="typeRoom">
                <option value="tat-ca" selected="selected">Tất cả</option>
                <option value="cho_thue_nha_tro">Cho thuê nhà trọ</option>
                <option value="cho_thue_can_ho">Cho thuê căn hộ</option>
                <option value="tim_nguoi_o_ghep">Tìm người ở ghép</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Tỉnh thành</label>
              <select
                class="form-control"
                v-model="citySelected"
              >
                <option value="tat-ca" selected="selected">Tất cả</option>
                <option
                  v-for="city in cities"
                  :key="city.cityId"
                  :value="city.cityId"
                >
                  {{ city.cityName }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Quận huyện</label>
              <select
                class="form-control"
                @click="getDistrict"
                v-model="districtSelected"
              >
                <option value="tat-ca" selected="selected">Tất cả</option>
                <option
                  v-for="district in districts"
                  :key="district.districtId"
                  :value="district.districtId"
                >
                  {{ district.districtName }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Phường xã</label>
              <select
                class="form-control"
                @click="getWard"
                v-model="wardSelected"
              >
                <option value="tat-ca" selected="selected">Tất cả</option>
                <option
                  v-for="ward in wards"
                  :key="ward.wardId"
                  :value="ward.wardId"
                >
                  {{ ward.wardName }}
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Diện tích</label>
              <select class="form-control" v-model="acreage">
                <option :value="{'minAcreage': 0, 'maxAcreage': 999999999}" selected="selected">Tất cả</option>
                <option :value="{'minAcreage': 0, 'maxAcreage': 20}">Dưới 20m2</option>
                <option :value="{'minAcreage': 20, 'maxAcreage': 30}">20m2 Đến 30m2</option>
                <option :value="{'minAcreage': 30, 'maxAcreage': 50}">30m2 Đến 50m2</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label>Khoảng giá</label>
              <select class="form-control" v-model="price">
                <option :value="{'minPrice': 0, 'maxPrice': 999999999}" selected="selected">Tất cả</option>
                <option :value="{'minPrice': 0, 'maxPrice': 1000000}">Dưới 1 triệu</option>
                <option :value="{'minPrice': 1000000, 'maxPrice': 2000000}">1 triệu đến 2 triệu</option>
                <option :value="{'minPrice': 2000000, 'maxPrice': 3000000}">2 triệu đến 3 triệu</option>
                <option :value="{'minPrice': 3000000, 'maxPrice': 5000000}">3 triệu đến 5 triệu</option>
              </select>
            </div>
          </div>
          <div class="col mt-auto mb-3">
            <button type="button" class="btn btn-primary" @click="searchArticle">Lọc</button>
          </div>
        </div>
      </div>
    </div>
    <h1 class="mt-3">Cho thuê nhà trọ, cho thuê nhà trọ, tìm phòng trọ</h1>
    <p>Website đăng tin cho thuê phòng trọ, tìm phòng trọ nhanh, hiệu quả với hơn 70.000+ tin đăng và 2.000.000 lượt xem
      mỗi tháng.</p>
    <br>
    <h3>Tin nổi bật</h3>
    <div class="row">
      <div class="col-6 mb-3" v-for="item in pageOfItemsHotNews" :key="item.articleId">
        <div class="border p-3">
          <div class="row">
            <div class="col-4">
              <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title"
                   class="img img-fluid img-thumbnail" width="100%">
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
              <router-link :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
                <h5 class="text-danger font-weight-bold">{{ item.title }}</h5>
                <h6 class="text-success font-weight-bold">{{ item.roomPrice }} VNĐ</h6>
                <span class="d-block">{{ item.acreage }}m²</span>
                <span class="d-block">{{ item.location['districtName'] }}, {{ item.location['cityName'] }}</span>
                <small class="d-block text-secondary">Cập nhật: {{ formatTime(item.lastUpdateTime) }}</small>
              </router-link>
              <i class="fa fa-heart wl" :class="{'wl-active': item.favorite}" @click="favoriteArticle(item)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 mb-3" v-if="dataHotNews.length === 0">
        Không có dữ liệu
      </div>
      <div class="col-12">
        <jw-pagination class="mt-4 ml-3" :items="dataHotNews" @changePage="onChangePageHotNews" :pageSize="6"></jw-pagination>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-8">
        <h2> {{ title_search }} </h2>
        <div class="border p-3" v-for="item in pageOfItems" :key="item.id">
          <div class="row">
            <div class="col-4 position-relative">
              <img v-if="!item.images[0]" src="../../assets/default.jpg" :alt="item.title"
                   class="img img-fluid img-thumbnail" width="100%">
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
              <router-link :to="{ name: 'client.ArticleDetail', params: {slug: item.slug}}">
                <h5 class="text-danger font-weight-bold">{{ item.title }}</h5>
                <h6 class="text-success font-weight-bold">{{ item.roomPrice }} VNĐ</h6>
                <span class="d-block">{{ item.acreage }}m²</span>
                <span class="d-block">{{ item.location['districtName'] }}, {{ item.location['cityName'] }}</span>
                <small class="d-block text-secondary">Cập nhật: {{ formatTime(item.lastUpdateTime) }}</small>
              </router-link>
              <i class="fa fa-heart wl" :class="{'wl-active': item.favorite}" @click="favoriteArticle(item)"></i>
            </div>
          </div>
        </div>
        <div v-if="pageOfItems.length === 0">
          Không có dữ liệu
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
import {AddressService, ArticleService, CustomerService, NewsService} from '../../api/index'
import moment from 'moment'
import img from '../../assets/default.jpg'

export default {
  name: 'search',
  components: {
    JwPagination
  },
  data () {
    return {
      email: '',
      title_search: 'Tổng hợp',
      typeRoom: 'tat-ca',
      citySelected: 'tat-ca',
      districtSelected: 'tat-ca',
      wardSelected: 'tat-ca',
      acreage: {'minAcreage': 0, 'maxAcreage': 999999999},
      price: {'minPrice': 0, 'maxPrice': 999999999},
      cities: [],
      districts: [],
      wards: [],
      districtsSave: [],
      wardsSave: [],
      dataHotNews: [],
      data: [],
      newsSuggestion: [],
      articleSuggestion: [],
      pageOfItemsHotNews: [],
      pageOfItems: []
    }
  },

  async created () {
    await this.load()
    this.cities = await AddressService.cities()
    this.districtsSave = await AddressService.districts()
    this.wardsSave = await AddressService.wards()

    this.newsSuggestion = await NewsService.news()
    if (this.profile) {
      this.email = this.profile.email
    }
    this.articleSuggestion = await ArticleService.articlesSuggestion(this.email)
  },

  watch: {
    '$route.params' (newVal) {
      this.load()
    }
  },

  methods: {
    async favoriteArticle (article) {
      const {data, status} = await CustomerService.customersFavorite(article.articleId)
      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: data.message,
          type: 'success'
        })
        article.favorite = !article.favorite
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

    async searchArticle () {
      await this.$router.replace(
        {
          name: 'client.Search',
          params: {
            'roomType': this.typeRoom,
            'city': this.citySelected,
            'district': this.districtSelected,
            'ward': this.wardSelected,
            'minAcreage': this.acreage.minAcreage,
            'maxAcreage': this.acreage.maxAcreage,
            'minPrice': this.price.minPrice,
            'maxPrice': this.price.maxPrice
          }
        })

      await this.load()
    },

    async load () {
      let typeRoom = this.$route.params.roomType === 'tat-ca' ? '' : this.$route.params.roomType
      let citySelected = this.$route.params.city === 'tat-ca' ? '' : this.$route.params.city
      let districtSelected = this.$route.params.district === 'tat-ca' ? '' : this.$route.params.district
      let wardSelected = this.$route.params.ward === 'tat-ca' ? '' : this.$route.params.ward

      this.data = await ArticleService.searchArticles(
        typeRoom,
        citySelected,
        districtSelected,
        wardSelected,
        this.acreage.minAcreage,
        this.acreage.maxAcreage,
        this.price.minPrice,
        this.price.maxPrice,
        this.email
      )

      this.dataHotNews = this.data.filter(article => article.vip)

      await this.setTitleSearch()
    },

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

    async setTitleSearch () {
      switch (this.$route.params.roomType) {
        case 'tat-ca':
          this.title_search = 'Cho thuê nhà trọ, cho thuê căn hộ, tìm người ở ghép'
          break
        case 'cho_thue_nha_tro':
          this.title_search = 'Cho thuê nhà trọ'
          break
        case 'cho_thue_can_ho':
          this.title_search = 'Cho thuê căn hộ'
          break
        case 'tim_nguoi_o_ghep':
          this.title_search = 'Tìm người ở ghép'
          break
      }
    },

    async getDistrict () {
      if (this.citySelected !== undefined) {
        // this.districtSelected = 'tat-ca'
        this.wardSelected = 'tat-ca'
        this.districts = this.districtsSave.filter(district => district.cityId === this.citySelected)
        this.wards = []
      }
    },
    async getWard () {
      if (this.districtSelected !== undefined) {
        // this.wardSelected = 'tat-ca'
        this.wards = this.wardsSave.filter(ward => ward.districtId === this.districtSelected)
      }
    },

    onChangePageHotNews (pageOfItems) {
      this.pageOfItemsHotNews = pageOfItems
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
