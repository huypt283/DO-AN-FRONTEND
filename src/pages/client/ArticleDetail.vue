<template>
  <div class="article-detail">
    <div class="row mt-4">
      <div class="col-8">
        <hooper style="height: 500px" class="bg-light border">
          <slide v-if="data.images" class="text-center" v-for="item in data.images">
            <img :src="item" @error="replaceByDefault" class="img img-fluid h-100">
          </slide>
          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>

        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
          <ol class="breadcrumb mt-3 pl-0 bg-white">
            <li class="breadcrumb-item">
              <span style="color: #2d8cf0" v-if="data.roomType === 'cho_thue_nha_tro'"
                    @click="searchArticleByTypeAndCity('cho_thue_nha_tro')">Cho thuê phòng trọ</span>
              <span style="color: #2d8cf0" v-if="data.roomType === 'cho_thue_can_ho'"
                    @click="searchArticleByTypeAndCity('cho_thue_can_ho')">Cho thuê căn hộ</span>
              <span style="color: #2d8cf0" v-if="data.roomType === 'tim_nguoi_o_ghep'"
                    @click="searchArticleByTypeAndCity('tim_nguoi_o_ghep')">Tìm người ở ghép</span>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ data.location.cityName }}</li>
            <li class="breadcrumb-item active" aria-current="page">{{ data.location.districtName }}</li>
          </ol>
        </nav>

        <h3 class="text-danger font-weight-bold">{{ data.title.toUpperCase() }}</h3>

        <p>Chuyên mục:
          <span style="color: #2d8cf0" v-if="data.roomType === 'cho_thue_nha_tro'"
                @click="searchArticleByTypeAndCity('cho_thue_nha_tro', data.location.cityId)">Cho thuê phòng trọ {{
              data.location.cityName
            }}</span>
          <span style="color: #2d8cf0" v-if="data.roomType === 'cho_thue_can_ho'"
                @click="searchArticleByTypeAndCity('cho_thue_can_ho', data.location.cityId)">Cho thuê căn hộ {{
              data.location.cityName
            }}</span>
          <span style="color: #2d8cf0" v-if="data.roomType === 'tim_nguoi_o_ghep'"
                @click="searchArticleByTypeAndCity('tim_nguoi_o_ghep', data.location.cityId)">Tìm người ở ghép {{
              data.location.cityName
            }}</span>
        </p>
        <p>Địa chỉ: {{ data.location.wardName }}, {{ data.location.districtName }}, {{ data.location.cityName }}</p>

        <h4>Thông tin mô tả</h4>
        <p v-if="data.description">{{ data.description }}</p>
        <p v-if="!data.description">Không có mô tả</p>

        <h4 class="mb-3">Đặc điểm tin đăng</h4>

        <div class="card">
          <div class="card-body">
            <table class="table">
              <tbody>
              <tr>
                <th scope="row">Mã tin:</th>
                <td>#{{ data.articleId }}</td>
              </tr>
              <tr>
                <th scope="row">Khu vực</th>
                <td v-if="data.roomType === 'cho_thue_nha_tro'">Cho thuê phòng trọ {{ data.location.cityName }}</td>
                <td v-if="data.roomType === 'cho_thue_can_ho'">Cho thuê căn hộ {{ data.location.cityName }}</td>
                <td v-if="data.roomType === 'tim_nguoi_o_ghep'">Tìm người ở ghép {{ data.location.cityName }}</td>
              </tr>
              <tr>
                <th scope="row">Loại tin rao:</th>
                <td v-if="data.roomType === 'cho_thue_nha_tro'">Phòng trọ, nhà trọ</td>
                <td v-if="data.roomType === 'cho_thue_can_ho'">Căn hộ</td>
                <td v-if="data.roomType === 'tim_nguoi_o_ghep'">Ở ghép</td>
              </tr>
              <tr>
                <th scope="row">Đối tượng thuê:</th>
                <td>{{ data.roommate ? (data.roommate.gender ? 'Nam' : 'Nữ') : 'Tất cả' }}
                </td>
              </tr>
              <tr>
                <th scope="row">Gói tin:</th>
                <td v-if="data.vip">Tin VIP</td>
                <td v-if="!data.vip">Tin thường</td>
              </tr>
              <tr>
                <th scope="row">Giá phòng:</th>
                <td>{{ data.roomPrice }} VNĐ</td>
              </tr>
              <tr>
                <th scope="row">Giá điện:</th>
                <td>{{ data.roomService.electricPrice }} VNĐ</td>
              </tr>
              <tr>
                <th scope="row">Giá nước:</th>
                <td>{{ data.roomService.waterPrice }} VNĐ</td>
              </tr>
              <tr>
                <th scope="row">Giá internet:</th>
                <td>{{ data.roomService.wifiPrice }} VNĐ</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h4 class="mt-3 mb-3">Thông tin liên hệ</h4>

        <div class="card">
          <div class="card-body">
            <table class="table">
              <tbody>
              <tr>
                <th scope="row">Liên hệ:</th>
                <td>{{ data.customer.name }}</td>
              </tr>
              <tr>
                <th scope="row">Điện thoại:</th>
                <td>{{ data.customer.phone }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h4 class="mt-3 mb-3">Địa chỉ</h4>
        <p class="mb-3">{{ data.location.address }}</p>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7864040.63808311!2d101.41520319550216!3d15.758353733355111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2zVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1617724419730!5m2!1svi!2s"
          width="100%"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
        ></iframe>

      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-body text-center">
            <img src="../../assets/default-user.png" alt="default-user" class="img img-fluid rounded-circle"
                 width="50%">
            <h5 class="card-title font-weight-bold">{{ data.customer.name }}</h5>
            <a class="btn btn-lg btn-success w-100 mb-3"
               :href="'tel:'+data.customer.phone">{{ data.customer.phone }}</a>
            <a class="btn btn-lg btn-outline-dark w-100 border" :href="'https://zalo.me/'+data.customer.phone"
               target="_blank">Nhắn Zalo</a>
            <span class="btn btn-lg btn-outline-dark w-100 border" @click="favoriteArticle">
              <span class="fa fa-heart wl" :class="{'wl-active': data.favorite}"/> Lưu bài đăng
            </span>
          </div>
        </div>

        <h2>Danh mục cho thuê</h2>
        <ul class="list-group">
          <li class="list-group-item" @click="searchArticleByTypeAndCity('cho_thue_nha_tro')">Cho thuê phòng trọ</li>
          <li class="list-group-item" @click="searchArticleByTypeAndCity('cho_thue_can_ho')">Cho thuê căn hộ</li>
          <li class="list-group-item" @click="searchArticleByTypeAndCity('tim_nguoi_o_ghep')">Tìm người ở ghép</li>
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
        <div class="border p-3" v-for="item in newsSuggestion" :key="item.id">
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
    <div class="fb-comments" :data-href="'https://fb.com/lynx/'+data.slug" data-width="" data-numposts="5"></div>
    <div id="fb-root"></div>
  </div>

</template>

<script>
import {Hooper, Slide, Navigation as HooperNavigation} from 'hooper'
import 'hooper/dist/hooper.css'
import {ArticleService, CustomerService, NewsService} from '../../api/index'
import img from '../../assets/default.jpg'
import {mapGetters} from 'vuex'

export default {
  name: 'article-detail',

  components: {
    Hooper,
    Slide,
    HooperNavigation
  },

  data () {
    return {
      email: '',
      articleSuggestion: [],
      newsSuggestion: [],
      data: {}
    }
  },

  async beforeRouteEnter (to, from, next) {
    const {data, status} = await ArticleService.detailArticle(to.params.slug, '')

    if (status === 200) {
      to.meta.collection = data
      next()
    } else {
      next({name: 'ErrorPage'})
    }
  },

  async beforeRouteUpdate (to, from, next) {
    const {data, status} = await ArticleService.detailArticle(to.params.slug, this.email)
    if (status === 200) {
      this.data = data
      next()
    } else {
      next({name: 'ErrorPage'})
    }
  },

  async created () {
    this.data = this.$route.meta.collection
    if (this.profile) {
      this.email = this.profile.email
      const {data} = await ArticleService.detailArticle(this.data.slug, this.email)
      this.data = data
    }

    this.newsSuggestion = await NewsService.news()
    this.articleSuggestion = await ArticleService.articlesSuggestion(this.email)
  },

  beforeUpdate () {
    this.$loadScript(
      'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=620736825090744&autoLogAppEvents=1'
    )
      .then(() => {
        this.$nextTick(() => {
          window.FB.XFBML.parse()
        })
      })
      .catch(() => {
        console.log('SCRIPT LAODING ERROR')
      })
  },

  methods: {
    async favoriteArticle () {
      const {data, status} = await CustomerService.customersFavorite(this.data.articleId)
      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: data.message,
          type: 'success'
        })
        this.data.favorite = !this.data.favorite
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

    async searchArticleByTypeAndCity (typeRoom, city = 'tat-ca') {
      await this.$router.push(
        {
          name: 'client.Search',
          params: {
            'roomType': typeRoom,
            'city': city,
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
.wl {
  font-size: 20px;
}

.wl-active {
  color: #ff0000;
}
</style>
