<template>

  <div id="login">
    <div class="login-box">
      <loading :active.sync="isLoading"
               :can-cancel="true"
               :on-cancel="onCancel"
               :is-full-page="true"></loading>

      <div class="login-logo">
        Đăng nhập
      </div>
      <div class="login-box-body">
        <router-link :to="{ name: 'client.Home' }">
          <a class="navbar-brand" href="#">
            Trang chủ
          </a>
        </router-link>
        <br><br>

        <form @submit.prevent="signIn">
          <div class="form-group has-feedback">
            <input type="email" class="form-control" placeholder="Email" v-model="$v.form_login.email.$model">
            <span class="text-danger" v-if="!$v.form_login.email.required"
                  v-html=" 'Email không được để trống<br>' "/>
            <span class="text-danger" v-if="$v.form_login.email.required && !$v.form_login.email.email"
                  v-html=" 'Email chưa đúng định dạng<br>' "/>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Mật khẩu" v-model="$v.form_login.password.$model">
            <span class="text-danger" v-if="!$v.form_login.password.required"
                  v-html=" 'Mật khẩu không được để trống<br>' "/>
            <span class="text-danger" v-if="!$v.form_login.password.minLength && $v.form_login.password.required"
                  v-html=" 'Mật khẩu tối thiểu 6 kí tự<br>' "/>
            <span class="text-danger" v-if="!$v.form_login.password.maxLength && $v.form_login.password.required"
                  v-html=" 'Mật khẩu tối đa 30 kí tự<br>' "/>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-flat" :disabled="this.$v.form_login.$invalid">Đăng
            nhập
          </button>
        </form>

        <br><br>
        <router-link :to="{ name: 'ForgotPassword'}">
          <a href="#">Quên mật khẩu</a>
        </router-link>
        <br>
        <router-link :to="{ name: 'Register'}">
          <a>Bạn chưa có tài khoản? Đăng ký ngay</a>
        </router-link>

      </div>
    </div>
  </div>

</template>

<script>

import {email, maxLength, minLength, required} from 'vuelidate/lib/validators'
import {AccountService} from '../api'
import Cookie from 'js-cookie'

export default {
  name: 'login',

  components: {
  },

  data () {
    return {
      isLoading: false,
      form_login: {
        email: '',
        password: ''
      }
    }
  },

  computed: {},

  validations: {
    form_login: {
      email: {required, email},
      password: {required, minLength: minLength(6), maxLength: maxLength(30)}
    }
  },

  methods: {
    showPass () {
      this.isPassword = !this.isPassword
    },

    async signIn () {
      if (this.$v.form_login.$invalid) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      this.isLoading = true
      setTimeout(async () => {
        const {data, status} = await AccountService.login(this.form_login)

        if (status === 200) {
          this.$store.commit('SET_TOKEN', data.access_token)
          Cookie.set('refresh_token', data.refresh_token, {secure: true})

          this.messageType = 'alert-success'
          let role = '3Mp71MODoP'

          if (data.role === 'ADMIN') {
            role = 'nq6WrCC7BZ'
          } else if (data.role === 'SUPER_ADMIN') {
            role = 'LuB5YqE9En'
          }

          this.$store.commit('SET_ROLE', role)

          const profile = await AccountService.profile()
          this.$store.commit('SET_PROFILE', profile.data)

          this.$toast.open({
            position: 'top-right',
            message: 'Đăng nhập thành công',
            type: 'success'
          })

          if (data.role === 'SUPER_ADMIN' || data.role === 'ADMIN') {
            await this.$router.push({name: 'sysadmin/statistics.Index'})
          } else {
            await this.$router.push({name: 'client.Home'})
          }
        } else {
          this.messageType = 'alert-danger'
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

        this.isLoading = false
      }, 2000)
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
    }
  }
}
</script>
<style>
.login-box {
  border: 1px solid #d2d6de;
}
</style>
