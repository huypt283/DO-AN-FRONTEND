<template>

  <div id="forgot-password">
    <div class="login-box">
      <loading :active.sync="isLoading"
               :can-cancel="true"
               :on-cancel="onCancel"
               :is-full-page="true"></loading>

      <div class="login-logo">
        Quên mật khẩu
      </div>
      <div class="login-box-body">

        <router-link :to="{ name: 'client.Home' }">
          <a class="navbar-brand" href="#">
            Trang chủ
          </a>
        </router-link>
        <br><br>

        <form @submit.prevent="forgotPassword">
          <div class="form-group has-feedback">
            <input type="email" class="form-control" placeholder="Email" v-model="$v.formData.email.$model">
            <span class="text-danger" v-if="!$v.formData.email.required"
                  v-html=" 'Email không được để trống<br>' "/>
            <span class="text-danger" v-if="$v.formData.email.required && !$v.formData.email.email"
                  v-html=" 'Email chưa đúng định dạng<br>' "/>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-flat" :disabled="this.$v.formData.$invalid">
            Nhận liên kết đặt lại
          </button>
        </form>

        <br><br>
        <router-link :to="{ name: 'Login'}">
          <a>Trở lại đăng nhập</a>
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

import {email, required} from 'vuelidate/lib/validators'
import {AccountService} from '../api'

export default {
  name: 'forgot-password',

  components: {
  },

  data () {
    return {
      isLoading: false,
      formData: {
        email: ''
      }
    }
  },

  computed: {},

  validations: {
    formData: {
      email: {required, email}
    }
  },

  methods: {
    showPass () {
      this.isPassword = !this.isPassword
    },

    async forgotPassword () {
      if (this.$v.formData.$invalid) {
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
          const {data, status} = await AccountService.forgotPassword(this.formData.email)

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
        }, 2000)
      } catch (e) {
        this.handleError(e)
      }
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
