<template>

  <div id="register">
    <div class="login-box">
      <loading :active.sync="isLoading"
               :can-cancel="true"
               :on-cancel="onCancel"
               :is-full-page="true"></loading>

      <div class="login-logo">
        <a href="#">Đăng ký tài khoản</a>
      </div>
      <div class="login-box-body">
        <router-link :to="{ name: 'client.Home' }">
          <a class="navbar-brand" href="#">
            Trang chủ
          </a>
        </router-link>
        <br><br>

        <form @submit.prevent="signUp">
          <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Email" v-model="$v.form_register.email.$model">
            <span class="text-danger" v-if="!$v.form_register.email.required"
                  v-html=" 'Email không được trống<br>' "/>
            <span class="text-danger" v-if="$v.form_register.email.required && !$v.form_register.email.email"
                  v-html=" 'Email không đúng định dạng<br>' "/>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Mật khẩu"
                   v-model="$v.form_register.password.$model">
            <span class="text-danger" v-if="!$v.form_register.password.required"
                  v-html=" 'Mật khẩu không được trống<br>' "/>
            <span class="text-danger" v-if="$v.form_register.password.required && !$v.form_register.password.minLength"
                  v-html=" 'Mật khẩu phải tối thiểu 6 kí tự<br>' "/>
            <span class="text-danger" v-if="$v.form_register.password.required && !$v.form_register.password.maxLength"
                  v-html=" 'Mật khẩu có tối đa 30 kí tự<br>' "/>
          </div>
          <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Tên" v-model="$v.form_register.name.$model">
            <span class="text-danger" v-if="!$v.form_register.name.required"
                  v-html=" 'Tên không được trống<br>' "/>
            <span class="text-danger" v-if="$v.form_register.name.required && !$v.form_register.name.minLength"
                  v-html=" 'Tên không phải tối thiếu 3 kí tự<br>' "/>
            <span class="text-danger" v-if="$v.form_register.name.required && !$v.form_register.name.maxLength"
                  v-html=" 'Tên không có tối đa 50 kí tự<br>' "/>
          </div>
          <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Số điện thoại" v-model="$v.form_register.phone.$model">
            <span class="text-danger" v-if="!$v.form_register.phone.required"
                  v-html=" 'Số điện thoại không được trống<br>' "/>
            <span class="text-danger" v-if="$v.form_register.phone.required && !$v.form_register.phone.minLength"
                  v-html=" 'Số điện thoại phải tối thiểu 9 kí tự<br>' "/>
            <span class="text-danger" v-if="$v.form_register.phone.required && !$v.form_register.phone.maxLength"
                  v-html=" 'Số điện thoại có tối đa 11 kí tự<br>' "/>
            <span class="text-danger" v-if="$v.form_register.phone.required && !$v.form_register.phone.integer"
                  v-html=" 'Số điện thoại không đúng định dạng<br>' "/>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="true"
                   v-model="$v.form_register.gender.$model">
            <label class="form-check-label" for="inlineRadio1">Nam</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="false"
                   v-model="$v.form_register.gender.$model">
            <label class="form-check-label" for="inlineRadio2">Nữ</label>
          </div>
          <span v-if="!$v.form_register.gender.required"
                v-html=" 'Phải lựa chọn giới tính của bạn<br>' "/>
          <button type="submit" class="btn btn-primary btn-block btn-flat" :disabled="this.$v.form_register.$invalid">
            Đăng ký
          </button>
        </form>

        <br><br>
        <router-link :to="{ name: 'ForgotPassword'}">
          <a href="#">Quên mật khẩu</a>
        </router-link>
        <br>
        <router-link :to="{ name: 'Login'}">
          <a>Bạn đã có tài khoản? Đăng nhập</a>
        </router-link>

      </div>
    </div>
  </div>

</template>

<script>

import {integer, maxLength, minLength, required, email} from 'vuelidate/lib/validators'
import {AccountService} from '../api'

export default {
  name: 'register',

  components: {},

  data () {
    return {
      isLoading: false,
      isPassword: false,
      form_register: {
        name: '',
        gender: true,
        email: '',
        password: '',
        phone: ''
      }
    }
  },

  validations: {
    form_register: {
      name: {required, minLength: minLength(3), maxLength: maxLength(50)},
      gender: {required},
      email: {required, email},
      password: {required, minLength: minLength(6), maxLength: maxLength(30)},
      phone: {required, minLength: minLength(9), maxLength: maxLength(11), integer}
    }
  },

  methods: {
    showPass () {
      this.isPassword = !this.isPassword
    },

    async signUp () {
      if (this.$v.form_register.$invalid) {
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
          const {data, status} = await AccountService.register(this.form_register)
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
