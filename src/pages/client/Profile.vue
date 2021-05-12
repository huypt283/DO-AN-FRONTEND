<template>
  <div class="profile">

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mt-4">
        <li class="breadcrumb-item"><a href="#">Phongtro283</a></li>
        <li class="breadcrumb-item"><a href="#">Quản lý</a></li>
        <li class="breadcrumb-item active" aria-current="page">Thông tin cá nhân</li>
      </ol>
    </nav>

    <h1 class="mb-3">Thông tin cá nhân</h1>

    <hr class="mb-3"/>

    <form @submit.prevent="updateProfile">
      <div class="row">
        <div class="col-3">

          <!-- Modal -->
          <div class="modal fade show" id="exampleModal1" tabindex="-1" role="dialog"
               aria-labelledby="exampleModalLabel1" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel1">Modal title</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <img :src="imageNew" class="img-fluid img" width="100%"/>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" @click="uploadImage" data-dismiss="modal">Thay ảnh
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div>
            <label for="upload" class="position-absolute">
              <img v-if="!this.image" src="../../assets/default-avatar.jpg"
                   alt="Ảnh đại diện"
                   class="img img-fluid img-thumbnail"
                   width="100%">
              <img
                v-if="this.image"
                :src="this.image"
                @error="replaceByDefault"
                alt="Ảnh đại diện"
                class="img img-fluid img-thumbnail"
                width="100%"/>
            </label>
            <div class="position-absolute btn btn-danger m-2"><i class="fa fa-trash"></i></div>
            <input type="file"
                   id="upload"
                   class="d-none"
                   @change="upload($event)"
                   name="picture"
                   accept="image/jpeg,image/jpg"
                   aria-label="picture"
            />

          </div>

        </div>
        <div class="col-9">
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Mã khách hàng</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="accountId" readonly>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="email" readonly>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Số ĐT</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="$v.formData.phone.$model">
              <span class="ml-3 text-danger" v-if="!$v.formData.phone.required"
                    v-html=" 'Số điện thoại không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.phone.required && !$v.formData.phone.minLength"
                    v-html=" 'Số điện thoại phải tối thiểu 9 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.phone.required && !$v.formData.phone.maxLength"
                    v-html=" 'Số điện thoại có tối đa 11 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.phone.required && !$v.formData.phone.integer"
                    v-html=" 'Số điện thoại không đúng định dạng<br>' "/>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Họ và tên</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="$v.formData.name.$model">
              <span class="ml-3 text-danger" v-if="!$v.formData.name.required"
                    v-html=" 'Tên không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.name.required && !$v.formData.name.minLength"
                    v-html=" 'Tên phải tối thiểu 3 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.name.required && !$v.formData.name.maxLength"
                    v-html=" 'Tên có tối đa 50 kí tự<br>' "/>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">CMND</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="$v.formData.cardId.$model">
              <span class="ml-3 text-danger" v-if="!$v.formData.cardId.required"
                    v-html=" 'Số CMND không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.cardId.required && !$v.formData.cardId.minLength"
                    v-html=" 'Số CMND phải tối thiểu 9 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.cardId.required && !$v.formData.cardId.maxLength"
                    v-html=" 'Số CMND có tối đa 12 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.cardId.required && !$v.formData.cardId.integer"
                    v-html=" 'Số CMND không đúng định dạng<br>' "/>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Ngày sinh</label>
            <div class="col-sm-10">
              <input type="date" class="form-control" v-model="$v.formData.birthday.$model" min="1900-01-01"
                     :max="maxBirthday">
              <span class="ml-3 text-danger" v-if="!$v.formData.birthday.required"
                    v-html=" 'Ngày sinh không được trống<br>' "/>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Địa chỉ</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="$v.formData.address.$model">
              <span class="ml-3 text-danger" v-if="!$v.formData.address.required"
                    v-html=" 'Địa chỉ không được trống<br>' "/>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Mật khẩu</label>
            <div class="col-sm-10">
              <a href="#" class="nav-link" v-text=" 'Đổi mật khẩu' " data-toggle="modal" data-target="#exampleModal"/>
            </div>
          </div>
        </div>
      </div>

      <input type="submit" class="btn btn-primary w-100" value="Cập nhật" :disabled="this.$v.formData.$invalid">
    </form>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Đổi mật khẩu</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Mật khẩu cũ</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="$v.formChangePassword.oldPass.$model">
                  <span class="text-danger" v-if="!$v.formChangePassword.oldPass.required"
                        v-html=" 'Mật khẩu không được bỏ trống<br>' "/>
                </div>
              </div>

              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Mật khẩu mới</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="$v.formChangePassword.newPass.$model"
                         @keyup="validatePassword">
                  <span class="text-danger" v-if="!$v.formChangePassword.newPass.required"
                        v-html=" 'Mật khẩu mới không được bỏ trống<br>' "/>
                  <span class="text-danger"
                        v-if="$v.formChangePassword.newPass.required && !$v.formChangePassword.newPass.minLength"
                        v-html=" 'Mật khẩu mới tối thiểu 6 kí tự<br>' "/>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Nhập lại mật khẩu mới</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="repeatPassword" @keyup="validatePassword">
                  <span class="text-danger" v-if="!$v.repeatPassword.required"
                        v-html=" 'Mật khẩu mới không được bỏ trống<br>' "/>
                  <span class="text-danger" v-if="$v.repeatPassword.required && this.repeatErr"
                        v-html=" 'Nhập lại mật khẩu không trùng khớp<br>' "/>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Trở lại</button>
              <button type="submit" class="btn btn-primary"
                      :disabled="$v.formChangePassword.$invalid || this.repeatErr" @click="changePassword" data-dismiss="modal">Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import fire from '../../store/fire'
import Uploader from 'vux-uploader-component'
import {mapGetters} from 'vuex'
import {integer, maxLength, minLength, required} from 'vuelidate/lib/validators'
import {AccountService} from '../../api'
import moment from 'moment'
import img from '../../assets/default-avatar.jpg'

export default {
  name: 'profile',

  components: {
    Uploader
  },

  data () {
    return {
      repeatErr: true,
      maxBirthday: null,
      imageNew: null,
      file: null,
      messageType: '',
      messageContent: '',
      accountId: '',
      email: '',
      role: '',
      image: null,
      accountBalance: 0,
      deleted: false,
      formData: {
        name: '',
        phone: '',
        cardId: '',
        birthday: '',
        gender: true,
        address: ''
      },
      formChangePassword: {
        oldPass: '',
        newPass: ''
      },
      repeatPassword: ''
    }
  },

  validations: {
    formData: {
      name: {required, minLength: minLength(3), maxLength: maxLength(50)},
      phone: {required, minLength: minLength(9), maxLength: maxLength(11), integer},
      cardId: {required, minLength: minLength(9), maxLength: maxLength(12), integer},
      birthday: {required},
      gender: {required},
      address: {required}
    },
    formChangePassword: {
      oldPass: {required},
      newPass: {required, minLength: minLength(6)}
    },
    repeatPassword: {required}
  },

  async created () {
    const profile = await AccountService.profile()
    this.$store.commit('SET_PROFILE', profile.data)

    this.collection = profile.data

    this.fillData()
  },

  methods: {
    async upload (event) {
      this.imageNew = URL.createObjectURL(event.target.files[0])
      this.file = event.target.files[0]
      $('#exampleModal1').modal('show')
    },

    async uploadImage () {
      try {
        const fs = fire.storage()
        const metadata = {
          contentType: 'image/jpeg'
        }
        let task = fs.ref(`images/${new Date().getTime() + this.file.name}`).put(this.file, metadata)
        task.on('state_changed', (
          () => {
          }, () => {
          }, () => {
            task.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
              this.image = downloadURL
              console.log(downloadURL)
              try {
                // await AccountService.updateAvatar({image: downloadURL})
              } catch (e) {

              }
            })
          }))
      } catch (e) {
        console.log(e)
      }
    },

    async updateProfile () {
      if (this.$v.formData.$invalid) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      const {data, status} = await AccountService.updateProfile(this.formData)

      if (status === 200) {
        this.$toast.open({
          position: 'top-right',
          message: 'Cập nhật thông tin thành công',
          type: 'success'
        })
        this.$store.commit('SET_PROFILE', data)
      } else {
        this.$toast.open({
          position: 'top-right',
          message: 'Cập nhật thông tin thất bại',
          type: 'error'
        })
      }
    },

    validatePassword () {
      this.repeatErr = this.$v.formChangePassword.newPass.$model !== this.repeatPassword
    },

    async changePassword () {
      // if (this.$v.formChangePassword.$invalid || this.repeatErr) {
      //   return false
      // }

      const {data, status} = await AccountService.changePassword(this.formChangePassword)

      if (status === 200) {
        this.$toast.open({
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

      // window.location.href = '/thong-tin-ca-nhan'
    },

    fillData () {
      this.maxBirthday = moment(new Date()).format('YYYY-MM-DD')
      this.accountId = '#' + this.collection.accountId
      this.email = this.collection.email
      this.role = this.collection.role
      this.accountBalance = this.collection.accountBalance + ' VNĐ'
      this.$v.formData.name.$model = this.collection.name
      this.$v.formData.phone.$model = this.collection.phone
      this.$v.formData.cardId.$model = this.collection.cardId
      this.$v.formData.birthday.$model = moment(this.collection.birthday).format('YYYY-MM-DD')
      this.$v.formData.gender.$model = this.collection.gender
      this.$v.formData.address.$model = this.collection.address
      this.image = this.collection.image
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
