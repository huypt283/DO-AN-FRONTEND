<template>
  <header class="main-header">
    <!-- Logo -->
    <router-link :to="{ name: 'sysadmin/statistics.Index' }">
      <a href="#" class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini"><b>283</b></span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg"><b>Quản lý</b> phòng trọ 283</span>
      </a>
    </router-link>


    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <span class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
      </span>
      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li class="dropdown user user-menu">
            <a class="dropdown-toggle" data-toggle="dropdown">
              <span class="hidden-xs">{{ profile.name }}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img :src="profile.image" class="img-circle" @error="replaceByDefault" alt="Ảnh đại diện">
                <p>
                  {{ profile.role }}
                </p>
              </li>
              <!-- Menu Body -->
              <li class="user-body">
                <!-- /.row -->
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <router-link :to="{ name: 'Profile' }">
                    <a href="#" class="btn btn-default btn-flat">Thông tin cá nhân</a>
                  </router-link>
                </div>
                <div class="pull-right">
                  <a href="#" class="btn btn-default btn-flat" @click="logout">Đăng xuất</a>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import {mapGetters} from 'vuex'
import {AccountService} from './api'
import img from './assets/default-avatar.jpg'

export default {
  name: 'va-navibar',

  methods: {
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
    },

    replaceByDefault (e) {
      e.target.src = img
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
