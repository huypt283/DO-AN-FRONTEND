<template>
  <div class="payment">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mt-4">
        <li class="breadcrumb-item"><a href="#">Phongtro283</a></li>
        <li class="breadcrumb-item active" aria-current="page">Nạp tiền</li>
      </ol>
    </nav>

    <h1>Nạp tiền</h1>

    <hr class="mb-3"/>

    <form @submit.prevent="submit">

      <div class="row">
        <div class="col-6">
          <h3>Hình thức thanh toán</h3>
        </div>
        <div class="col-6 text-right">
          <p>Mệnh giá quy đổi</p>
          <p>$1 = 23100 VNĐ</p>
        </div>
        <div class="col-12">
          <strong>Thanh toán với Paypal:</strong>
        </div>
        <div class="col-12">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1"
                   v-model="$v.formData.price.$model">
            <label class="form-check-label" for="inlineRadio1">1$</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2"
                   v-model="$v.formData.price.$model">
            <label class="form-check-label" for="inlineRadio2">2$</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="5"
                   v-model="$v.formData.price.$model">
            <label class="form-check-label" for="inlineRadio3">5$</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="10"
                   v-model="$v.formData.price.$model">
            <label class="form-check-label" for="inlineRadio4">10$</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="20"
                   v-model="$v.formData.price.$model">
            <label class="form-check-label" for="inlineRadio5">20$</label>
          </div>
        </div>
        <br>
        <br>
        <div class="col-2">
          <div class="form-group">
            <label>Tùy chỉnh số tiền cần nạp</label>
            <input
              type="number"
              class="form-control"
              v-model="$v.formData.price.$model"
              min="1">
            <span class="text-danger" v-if="!$v.formData.price.required" v-html=" 'Số tiền không được trống<br>' "/>
            <span class="text-danger" v-if="$v.formData.price.required && !$v.formData.price.minValue"
                  v-html=" 'Số tiền cần nạp ít nhất 1 đô<br>' "/>
          </div>
        </div>
      </div>
      <input type="submit" class="btn btn-success w-100 btn-lg" :disabled="this.$v.formData.$invalid"
             value="Xác nhận nạp tiền">
    </form>
    <br><br>
    <h5 class="mb-3" v-text="'Hoặc có thể thanh toán bằng hình thức chuyển khoản cho chúng tôi với nội dung:'"></h5>
    <h4 class="mb-3" v-text="'<sodienthoai> chuyen tien'"></h4>
    <p class="mb-3" v-text="'Với <sodienthoai> chính là số điện thoại đang được liên kết với tài khoản của bạn'"></p>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th scope="col">Loại tài khoản</th>
        <th scope="col">Chủ tài khoản</th>
        <th scope="col">Tài khoản</th>
        <th scope="col">Chi nhánh (ngân hàng)</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Ngân hàng Á Châu (ACB)</th>
        <td>PHAM THE HUY</td>
        <td>18251587</td>
        <td>CN HÀ NỘI</td>
      </tr>
      <tr>
        <th scope="row">Ví điện tử Momo</th>
        <td>PHAM THE HUY</td>
        <td>0979859283</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Uploader from 'vux-uploader-component'
import {CustomerService} from '../../api/index'
import {minValue, required} from 'vuelidate/lib/validators'

export default {
  name: 'payment',
  components: {
    Uploader
  },
  data () {
    return {
      isLoading: false,
      activeOptionOther: false,
      isSubmit: false,
      formData: {
        price: 1
      }
    }
  },

  validations: {
    formData: {
      price: {required, minValue: minValue(1)}
    }
  },

  async created () {
    let queryDict = {}
    location.search.substr(1).split('&').forEach(function (item) {
      queryDict[item.split('=')[0]] = item.split('=')[1]
    })

    if (queryDict.status === 'success') {
      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await CustomerService.paymentSuccess({
            'paymentId': queryDict['paymentId'],
            'payerId': queryDict['PayerID'],
            'token': queryDict['payment-token']
          })
          this.handleStatus(data, status)
        } catch (e) {
          this.handleError(e)
        }
        this.isLoading = false
      }, 1500)
    } else if (queryDict.status === 'cancel') {
      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await CustomerService.paymentError(queryDict['payment-token'])
          this.handleStatus(data, status)
        } catch (e) {
          this.handleError(e)
        }
        this.isLoading = false
      }, 1500)
    }
  },

  methods: {
    async submit () {
      if (this.$v.formData.$invalid) {
        this.$toast.open({
          position: 'top-right',
          message: 'Số tiền không hợp lệ',
          type: 'error'
        })
        return
      }

      const {data, status} = await CustomerService.payment(this.formData)
      this.handleStatus(data, status)
      if (status === 200) {
        window.location.href = data.openLink
      }
    },

    handleStatus (data, status) {
      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: data.message ? data.message : 'Chuyển hướng sang cổng thanh toán',
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

<style scoped>
</style>
