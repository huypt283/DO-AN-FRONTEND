<template>

  <div id="reset-pasword">
    <div class="login-box">
      <loading :active.sync="isLoading"
               :can-cancel="true"
               :on-cancel="onCancel"
               :is-full-page="true"></loading>

      <div class="login-logo">
        Đặt lại mật khẩu
      </div>
      <div class="login-box-body">
        <router-link :to="{ name: 'client.Home' }">
          <a class="navbar-brand" href="#">
            Trang chủ
          </a>
        </router-link>
        <br><br>

        <form @submit.prevent="resetPassword">
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Mật khẩu mới" v-model="$v.formData.password.$model"
                   @keyup="validatePassword">
            <span class="text-danger" v-if="!$v.formData.password.required"
                  v-html=" 'Mật khẩu mới không được để trống<br>' "/>
            <span class="text-danger" v-if="!$v.formData.password.minLength && $v.formData.password.required"
                  v-html=" 'Mật khẩu mới tối thiểu 6 kí tự<br>' "/>
            <span class="text-danger" v-if="!$v.formData.password.maxLength && $v.formData.password.required"
                  v-html=" 'Mật khẩu mới tối đa 30 kí tự<br>' "/>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Nhập lại mật khẩu mới" v-model="repeatPassword"
                   @keyup="validatePassword">
            <span class="text-danger" v-if="!$v.repeatPassword.required"
                  v-html=" 'Nhập khẩu mới không được bỏ trống<br>' "/>
            <span class="text-danger" v-if="$v.repeatPassword.required && this.repeatErr"
                  v-html=" 'Nhập lại mật khẩu không trùng khớp<br>' "/>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-flat" :disabled="this.$v.formData.$invalid || this.repeatErr">
            Đặt lại mật khẩu
          </button>
        </form>

        <br><br>
        <router-link :to="{ name: 'Login'}">
          <a>Đăng nhập</a>
        </router-link>
        <br>
        <router-link :to="{ name: 'Register'}">
          <a>Đăng ký tài khoản mới</a>
        </router-link>

      </div>
    </div>
  </div>

</template>

<script>

import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import {AccountService} from '../api'

export default {
  name: 'reset-pasword',

  components: {
  },

  data () {
    return {
      isLoading: false,
      repeatErr: true,
      formData: {
        password: '',
        token: '',
        email: ''
      },
      repeatPassword: ''
    }
  },

  computed: {},

  validations: {
    formData: {
      password: {required, minLength: minLength(6), maxLength: maxLength(30)},
      token: {required},
      email: {required}
    },
    repeatPassword: {required}
  },

  async created () {
    let queryDict = {}
    location.search.substr(1).split('&').forEach(function (item) { queryDict[item.split('=')[0]] = item.split('=')[1] })

    this.formData.token = queryDict['token']
    this.formData.email = queryDict['email'] ? queryDict['email'].toString().replace('%40', '@') : ''
  },

  methods: {
    validatePassword () {
      this.repeatErr = this.$v.formData.password.$model !== this.repeatPassword
    },

    showPass () {
      this.isPassword = !this.isPassword
    },

    async resetPassword () {
      if (this.$v.formData.$invalid || this.repeatErr) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      try {
        this.isLoading = true
        setTimeout(async () => {
          const {data, status} = await AccountService.resetPassword(this.formData)
          if (status === 200) {
            this.$toast.open({
              duration: 6000,
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

          this.isLoading = false
        }, 1500)
      } catch (e) {
        this.messageType = 'alert-danger'
        this.messageContent = 'Đã có lỗi xảy ra'
      }
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
