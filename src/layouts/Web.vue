<template>
  <div>

    <div class="bg-light">
      <div class="container">
        <!-- <div> -->
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 px-0">
            <div class="admin__header bg-light">
              <nav class="navbar navbar-expand-md navbar-light bg-light px-4">
                <router-link :to="{ name: 'client.Home' }">
                  <a class="navbar-brand" href="#" style="font-size: 30px">
                    <img src="../assets/web-icon.png" alt="logo" class="img img-fluid" width="60px">
                    PHONGTRO283
                  </a>
                </router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                  <ul class="navbar-nav ml-auto align-items-center">
                    <li class="nav-item mr-2">
                      <span v-if="profile && role === '3Mp71MODoP'"> Số dư tài khoản: {{profile.accountBalance}} VNĐ</span>
                      <span v-if="!profile">Phongtro283 xin chào!</span>
                    </li>
                    <li class="nav-item mr-2" v-if="!profile">
                      <router-link :to="{ name: 'Login'}">
                        <a class="btn btn-primary" href="/">
                          <span>Đăng nhập</span>
                        </a>
                      </router-link>
                    </li>
                    <li class="nav-item mr-2" v-if="!profile">
                      <router-link :to="{ name: 'Register'}">
                        <a class="btn btn-primary" href="/">
                          <span>Đăng ký</span>
                        </a>
                      </router-link>
                    </li>
                    <li class="nav-item mr-2" v-if="profile">
                      <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          {{ profile.name }}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <router-link :to="{ name: 'client.CreateArticle'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-if="role === '3Mp71MODoP'">
                              Đăng tin cho thuê</a>
                          </router-link>
                          <router-link :to="{ name: 'client.ManageArticle'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-if="role === '3Mp71MODoP'">
                              Quản lý bài đăng</a>
                          </router-link>
                          <router-link :to="{ name: 'client.Payment'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-if="role === '3Mp71MODoP'">Nạp tiền</a>
                          </router-link>
                          <router-link :to="{ name: 'client.TransactionHistory'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-if="role === '3Mp71MODoP'">
                              Lịch sử giao dịch</a>
                          </router-link>
                          <router-link :to="{ name: 'Profile'}">
                            <a class="dropdown-item" href="javascript:void(0)">Thông tin cá nhân</a>
                          </router-link>
                          <router-link :to="{ name: 'client.FavoriteArticle'}">
                            <a class="dropdown-item" href="javascript:void(0)" v-if="role === '3Mp71MODoP'">Bài đăng đã lưu</a>
                          </router-link>
                          <a
                            href="javascript:void(0)"
                            class="dropdown-item"
                            @click="logout"
                            v-text="'Đăng xuất' "
                          />
                        </div>
                      </div>
                    </li>
                    <li class="nav-item mr-2" >
                      <router-link :to="{ name: 'client.CreateArticle' }" v-if="role === '3Mp71MODoP'">
                        <a class="btn btn-danger" href="/">
                          <span>Đăng tin mới</span>
                        </a>
                      </router-link>
                      <router-link :to="{ name: 'sysadmin/statistics.Index' }" v-if="role === 'nq6WrCC7BZ' || role === 'LuB5YqE9En'">
                        <a class="btn btn-danger" href="/">
                          <span>Về trang quản lí</span>
                        </a>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-primary">
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-dark">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active mr-3">
                <router-link :to="{ name: 'client.Home' }">
                  <a class="nav-link text-white" href="#">Trang chủ</a>
                </router-link>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Loại tin
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" @click="searchArticleByRoomType('cho_thue_nha_tro')">Cho thuê phòng trọ</a>
                  <a class="dropdown-item" @click="searchArticleByRoomType('cho_thue_can_ho')">Cho thuê căn hộ</a>
                  <a class="dropdown-item" @click="searchArticleByRoomType('tim_nguoi_o_ghep')">Tìm người ở ghép</a>
                </div>
              </li>
              <li class="nav-item mr-3">
                <router-link :to="{ name: 'client.News' }">
                  <a class="nav-link text-white" href="#">Tin tức</a>
                </router-link>
              </li>
              <li class="nav-item mr-3" v-if="role === '3Mp71MODoP'">
                <router-link :to="{ name: 'client.Payment' }">
                  <a class="nav-link text-white" href="#">Nạp tiền</a>
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <div class="container content">
      <router-view></router-view>
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center text-lg-start mt-5">
      <!-- Grid container -->
      <div class="container p-4">
        <!--Grid row-->
        <div class="row">
          <!--Grid column-->
          <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 class="text-uppercase">Website tìm phòng trọ</h5>

            <p>
              Cảm ơn bạn đã sử dụng!
            </p>
          </div>
          <!--Grid column-->

          <!--Grid column-->
          <div class="col-lg-3 col-md-6 mb-4 mb-md-0">

            <h5 class="text-uppercase">Liên hệ</h5>
            <ul class="list-unstyled mb-0">
              <li>
                <a href="https://www.facebook.com/huypt283/" target="_blank" class="text-dark">Facebook</a>
              </li>
              <li>
                <a href="mailto:phamthehuy283@gmail.com" class="text-dark">Mail</a>
              </li>
            </ul>
          </div>
          <!--Grid column-->

          <!--Grid column-->
          <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 class="text-uppercase mb-0">Follow me</h5>

            <ul class="list-unstyled">
              <li>
                <a href="https://www.instagram.com/huypt283/" target="_blank" class="text-dark">Instagram</a>
              </li>
              <li>
                <a href="https://github.com/huypt283" target="_blank" class="text-dark">Github</a>
              </li>
            </ul>
          </div>
          <!--Grid column-->
        </div>
        <!--Grid row-->
      </div>
      <!-- Grid container -->

      <!-- Copyright -->
      <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
        © 2021 Copyright:
        <a class="text-dark" target="_blank" href="https://fb.com/huypt283">Lynx</a>
      </div>
      <!-- Copyright -->
    </footer>
    <!-- Footer -->

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {AccountService} from '../api'

export default {
  name: 'Web',
  data () {
    return {
      dateCategory: [
        {
          id: 1,
          name: 'Cho thuê phòng trọ'
        },
        {
          id: 2,
          name: 'Cho thuê căn hộ'
        },
        {
          id: 3,
          name: 'Tìm người ở ghép'
        }
      ]
    }
  },
  created () {
  },
  components: {},
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

    async logout () {
      const {data, status} = await AccountService.logout()
      if (status === 200) {
        this.$toast.open({
          duration: 6000,
          position: 'top-right',
          message: data.message,
          type: 'success'
        })
      } else {
        this.$toast.open({
          position: 'top-right',
          message: data.message,
          type: 'error'
        })
      }
      this.$store.commit('LOG_OUT')

      this.$router.push({name: 'Login'})
    }
  },
  computed: {
    ...mapGetters([
      'profile',
      'role'
    ])
  }
}
</script>

<style scoped>
.content{
  min-height: 593px;
}
</style>
