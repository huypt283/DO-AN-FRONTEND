<template>
  <div class="edit-article">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mt-4">
        <li class="breadcrumb-item"><a href="#">Phongtro283</a></li>
        <li class="breadcrumb-item"><a href="#">Quản lý</a></li>
        <li class="breadcrumb-item active" aria-current="page">Cập nhật bài đăng</li>
      </ol>
    </nav>

    <h1>Cập nhật bài đăng</h1>

    <hr/>

    <form @submit.prevent="submit">

      <h3>Thông tin chi tiết</h3>

      <div class="row">

        <div class="col-4">
          <div class="form-group">
            <label>Tỉnh thành</label><label style="color: red">*</label>
            <select
              class="form-control"
              @change="getDistrict"
              v-model="citySelected"
            >
              <option
                v-for="city in cities"
                :key="city.cityId"
                v-bind:value="{'cityId': city.cityId, 'cityName': city.cityName}"
              >
                {{ city.cityName }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-4">
          <div class="form-group">
            <label>Quận huyện</label><label style="color: red">*</label>
            <select
              class="form-control"
              @change="getWard"
              v-model="districtSelected"
            >
              <option
                v-for="district in districts"
                :key="district.districtId"
                v-bind:value="{'districtId': district.districtId, 'districtName': district.districtName}"
              >
                {{ district.districtName }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-4">
          <div class="form-group">
            <label>Phường xã</label><label style="color: red">*</label>
            <select class="form-control" v-model="wardSelected">
              <option v-for="ward in wards" :key="ward.wardId"
                      v-bind:value="{'wardId': ward.wardId, 'wardName': ward.wardName }">{{ ward.wardName }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Địa chỉ</label><label style="color: red">*</label>
            <input type="text" class="form-control" v-model="numberHouse">
            <span class="text-danger" v-if="!$v.numberHouse.required"
                  v-html=" 'Địa chỉ không được trống<br>' "/>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Địa chỉ chính xác</label><label style="color: red">*</label>
            <input type="text" class="form-control" v-model="$v.formData.address.$model = formatAddress()" disabled>
            <span class="text-danger" v-if="!validAddress"
                  v-html=" 'Địa chỉ chính xác chưa hợp lệ. Vui lòng điền đầy đủ địa chỉ, phường xã, quận huyện, tỉnh thành<br>' "/>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Tiêu đề</label><label style="color: red">*</label>
            <input type="text" class="form-control" v-model="$v.formData.title.$model">
            <span class="text-danger" v-if="!$v.formData.title.required"
                  v-html=" 'Tiêu đề không được trống<br>' "/>
            <span class="text-danger" v-if="!$v.formData.title.minLength && $v.formData.title.required"
                  v-html=" 'Tiêu đề phải có 5-220 ký tự<br>' "/>
            <span class="text-danger" v-if="!$v.formData.title.maxLength && $v.formData.title.required"
                  v-html=" 'Tiêu đề phải có 5-220 ký tự<br>' "/>
          </div>
        </div>
        <div class="col-3">
          <div class="form-group">
            <label>Giá cho thuê</label><label style="color: red">*</label>
            <input type="number" class="form-control" v-model="$v.formData.roomPrice.$model" min="100000">
            <span class="text-danger" v-if="!$v.formData.roomPrice.required"
                  v-html=" 'Giá phòng không được trống<br>' "/>
            <span class="text-danger"
                  v-if="!$v.formData.roomPrice.minValue && $v.formData.roomPrice.required"
                  v-html=" 'Giá phòng nhỏ nhất là 100000 VNĐ<br>' "/>
          </div>
        </div>
        <div class="col-3">
          <div class="form-group">
            <label>Giá tiền điện</label><label style="color: red">*</label>
            <input type="number" class="form-control" v-model="$v.formData.electricPrice.$model" min="1000">
            <span class="text-danger" v-if="!$v.formData.electricPrice.required"
                  v-html=" 'Giá điện không được trống<br>' "/>
            <span class="text-danger" v-if="!$v.formData.electricPrice.minValue && $v.formData.electricPrice.required"
                  v-html=" 'Giá điện nhỏ nhất là 1000 VNĐ<br>' "/>
          </div>
        </div>
        <div class="col-3">
          <div class="form-group">
            <label>Giá tiền nước</label><label style="color: red">*</label>
            <input type="number" class="form-control" v-model="$v.formData.waterPrice.$model" min="1000">
            <span class="text-danger" v-if="!$v.formData.waterPrice.required"
                  v-html=" 'Giá nước không được trống<br>' "/>
            <span class="text-danger" v-if="!$v.formData.waterPrice.minValue && $v.formData.waterPrice.required"
                  v-html=" 'Giá nước nhỏ nhất là 1000 VNĐ<br>' "/>
          </div>
        </div>
        <div class="col-3">
          <div class="form-group">
            <label>Giá tiền wifi</label>
            <input type="number" class="form-control" v-model="$v.formData.wifiPrice.$model" min="1000">
            <span class="text-danger" v-if="!$v.formData.wifiPrice.minValue"
                  v-html=" 'Giá wifi nhỏ nhất là 1000 VNĐ<br>' "/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Loại tin</label><label style="color: red">*</label>
            <select class="form-control" v-model="formData.roomType">
              <option value="cho_thue_nha_tro">Cho thuê nhà trọ</option>
              <option value="cho_thue_can_ho">Cho thuê căn hộ</option>
              <option value="tim_nguoi_o_ghep">Tìm người ở ghép</option>
            </select>
          </div>
        </div>
        <div class="col-6" v-if="formData.roomType === 'tim_nguoi_o_ghep'">
          <div class="form-group">
            <label>Số lượng</label><label style="color: red">*</label>
            <input type="number" class="form-control" v-model="formData.roommateRequest.quantity" min="1">
          </div>
        </div>
        <div class="col-12" v-if="formData.roomType === 'tim_nguoi_o_ghep'">
          <div class="form-group">
            <label>Giới tính</label><label style="color: red">*</label>
            <div class="custom-control custom-radio">
              <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input"
                     v-model="formData.roommateRequest.gender" :value="true">
              <label class="custom-control-label" for="customRadio1">Nam</label>
            </div>
            <div class="custom-control custom-radio">
              <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input"
                     v-model="formData.roommateRequest.gender" :value="false">
              <label class="custom-control-label" for="customRadio2">Nữ</label>
            </div>
          </div>
        </div>
        <div class="col-12" v-if="formData.roomType === 'tim_nguoi_o_ghep'">
          <div class="form-group">
            <label>Mô tả</label>
            <textarea class="form-control" v-model="formData.roommateRequest.description"/>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Diện tích</label><label style="color: red">*</label>
            <input type="number" class="form-control" v-model="$v.formData.acreage.$model" min="5">
            <span class="text-danger" v-if="!$v.formData.acreage.minValue"
                  v-html=" 'Diện tích nhỏ nhất là 5 m2<br>' "/>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Nội dung mô tả</label>
            <textarea rows="5" class="form-control" v-model="formData.description"></textarea>
          </div>
        </div>
      </div>

      <h3>Hình ảnh</h3>
      <p>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</p>

      <div class="custom-file">
        <input @change="upload($event)"
               type="file"
               name="picture"
               accept="image/jpeg,image/jpg"
               class="custom-file-input"
               id="customFile"
               aria-label="picture"
               multiple
        >
        <label class="custom-file-label" for="customFile">Choose file</label>
      </div>

      <div v-if="imageList.length > 0">Hình ảnh đang chờ bạn tải lên</div>
      <div class="d-flex flex-wrap">
        <div class="p-3 position-relative" v-for="(item, index) in imageList">
          <img :src="item" class="img img-fluid img-thumbnail m-1" width="100px" height="100px"/>
          <span class="position-absolute top-0 right-0">
          <i class="fa fa-times-circle text-danger" @click="removeImage(index)"></i>
        </span>
        </div>
      </div>
      <div class="p-3">
        <div @click="uploadImage" class="btn btn-primary">Tải ảnh lên</div>
      </div>

      <div>Hình ảnh sẽ xuất hiện trong bài đăng của bạn<label style="color: red">*</label></div>
      <span class="text-danger" v-if="!validImages"
            v-html=" 'Tải lên ít nhất 1 hình ảnh<br>' "/>
      <div class="d-flex flex-wrap">
        <div class="p-3 position-relative" v-for="(item, index) in uploadImageList">
          <img :src="item" class="img img-fluid img-thumbnail m-1" width="100px" height="100px"/>
          <span class="position-absolute top-0 right-0">
          <i class="fa fa-times-circle text-danger" @click="removeUploadImage(item, index)"></i>
        </span>
        </div>
      </div>

      <h3>Video</h3>

      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Video Link (Youtube)</label>
            <input type="text" class="form-control" v-model="formData.video">
          </div>
        </div>
      </div>
      <input type="submit" class="btn btn-success w-100 btn-lg" value="Cập nhật bài đăng"
             :disabled="this.$v.formData.$invalid || !validImages || !validAddress">
    </form>
  </div>
</template>
<script>
import fire from '../../store/fire'
import Uploader from 'vux-uploader-component'
import {AddressService, CustomerService} from '../../api/index'
import {maxLength, minLength, minValue, required} from 'vuelidate/lib/validators'

export default {
  name: 'edit-article',
  components: {
    Uploader
  },
  data () {
    return {
      isLoading: false,
      file: [],
      imageList: [],
      uploadImageList: [],
      validAddress: false,
      validImages: false,
      citySelected: {'cityId': '', 'cityName': ''},
      districtSelected: {'districtId': '', 'districtName': ''},
      wardSelected: {'wardId': '', 'wardName': ''},
      numberHouse: '',
      imagesArr: [],
      cities: [],
      districts: [],
      wards: [],
      districtsSave: [],
      wardsSave: [],
      formData: {
        title: null,
        roomPrice: 0,
        description: null,
        roomType: '',
        images: null,
        address: null,
        acreage: 0,
        wardId: 0,
        vip: false,
        video: null,
        roommateRequest: {
          gender: true,
          quantity: 1,
          description: null
        },
        waterPrice: 0,
        electricPrice: 0,
        wifiPrice: 0
      }
    }
  },

  validations: {
    formData: {
      title: {required, minLength: minLength(5), maxLength: maxLength(220)},
      roomPrice: {required, minValue: minValue(100000)},
      roomType: {required},
      address: {required},
      acreage: {required, minValue: minValue(5)},
      wardId: {required},
      vip: {required},
      waterPrice: {required, minValue: minValue(1000)},
      electricPrice: {required, minValue: minValue(1000)},
      wifiPrice: {minValue: minValue(1000)}
    },
    numberHouse: {required}
  },

  async created () {
    const {data, status} = await CustomerService.customersArticlesDetail(this.$route.params.id)
    if (status === 200) {
      this.collection = data
      await this.fillData()
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'client.ManageArticle'})
    }
  },

  methods: {
    async removeImage (index) {
      this.imageList.splice(index, 1)
      this.file.splice(index, 1)
    },
    async removeUploadImage (item, index) {
      let image = fire.storage().refFromURL(item)
      this.uploadImageList.splice(index, 1)
      this.validImages = this.uploadImageList.length > 0
      await image.delete()
    },
    async upload (event) {
      for (let file of event.target.files) {
        this.imageList.push(URL.createObjectURL(file))
        this.file.push(file)
      }
    },
    async uploadImage () {
      try {
        const fs = fire.storage()
        const metadata = {
          contentType: 'image/jpeg'
        }
        this.file.forEach((val, idx) => {
          let task = fs.ref(`images/${new Date().getTime() + val.name}`).put(val, metadata)
          task.on('state_changed', (
            () => {
            }, () => {
            }, () => {
              task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.uploadImageList.push(downloadURL)
                this.validImages = true
              })
            }))
        })
      } catch (e) {
        this.handleError(e)
      } finally {
        this.file = []
        this.imageList = []
      }
    },

    formatAddress () {
      let arr = []
      if (this.numberHouse && this.numberHouse !== '') {
        arr.push(this.numberHouse)
      }
      if (this.wardSelected && this.wardSelected['wardName'] !== '') {
        arr.push(this.wardSelected['wardName'])
      }
      if (this.districtSelected && this.districtSelected['districtName'] !== '') {
        arr.push(this.districtSelected['districtName'])
      }
      if (this.citySelected && this.citySelected['cityName'] !== '') {
        arr.push(this.citySelected['cityName'])
      }
      this.validAddress = arr.length === 4
      return arr.length > 1 ? arr.join(', ') : arr
    },

    async fillData () {
      this.cities = await AddressService.cities()
      this.districtsSave = await AddressService.districts()
      this.wardsSave = await AddressService.wards()
      this.citySelected = {'cityId': this.collection.location.cityId, 'cityName': this.collection.location.cityName}
      this.districts = await AddressService.districtDetail(this.collection.location.cityId)
      this.districtSelected = {
        'districtId': this.collection.location.districtId,
        'districtName': this.collection.location.districtName
      }
      this.wards = await AddressService.wardDetail(this.collection.location.districtId)
      this.wardSelected = {
        'wardId': this.collection.location.wardId,
        'wardName': this.collection.location.wardName
      }
      this.numberHouse = this.collection.location.homeAddress
      this.$v.formData.title.$model = this.collection.title
      this.$v.formData.roomPrice.$model = this.collection.roomPrice
      this.formData.description = this.collection.description
      this.$v.formData.roomType.$model = this.collection.roomType
      this.uploadImageList = this.collection.images
      this.validImages = this.uploadImageList.length > 0
      this.$v.formData.address.$model = this.collection.address
      this.$v.formData.acreage.$model = this.collection.acreage
      this.$v.formData.vip.$model = this.collection.vip
      this.$v.formData.roomType.$model = this.collection.roomType
      this.$v.formData.waterPrice.$model = this.collection.roomService.waterPrice
      this.$v.formData.electricPrice.$model = this.collection.roomService.electricPrice
      this.$v.formData.wifiPrice.$model = this.collection.roomService.wifiPrice
      if (this.collection.roommate !== undefined) {
        this.$v.formData.roommateRequest.gender = this.collection.roommate.gender
        this.$v.formData.roommateRequest.quantity = this.collection.roommate.quantity
        this.$v.formData.roommateRequest.description = this.collection.roommate.description
      }
    },

    async getDistrict () {
      let cityId = this.citySelected ? this.citySelected.cityId : null
      if (cityId !== null) {
        this.districtSelected = {'districtId': '', 'districtName': ''}
        this.wardSelected = {'wardId': '', 'wardName': ''}
        this.districts = this.districtsSave.filter(district => district.cityId === cityId)
        this.wards = []
      }
    },
    async getWard () {
      let districtId = this.districtSelected ? this.districtSelected.districtId : null
      if (districtId !== null) {
        this.wardSelected = {'wardId': '', 'wardName': ''}
        this.wards = this.wardsSave.filter(ward => ward.districtId === districtId)
      }
    },

    async submit () {
      if (this.$v.formData.$invalid || !this.validAddress) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      if (this.uploadImageList.length > 0 && this.validImages) {
        this.formData.images = this.uploadImageList.join(',@')
      } else {
        this.$toast.open({
          position: 'top-right',
          message: 'Hãy tải lên ít nhất một hình ảnh',
          type: 'error'
        })
        return
      }

      this.isLoading = true
      setTimeout(async () => {
        try {
          this.formData.wardId = this.wardSelected.wardId

          if (this.formData.roomType !== 'tim_nguoi_o_ghep') {
            this.formData.roommateRequest = null
          }

          const {data, status} = await CustomerService.customersArticlesUpdate(this.$route.params.id, this.formData)
          if (status === 200) {
            this.$toast.open({
              position: 'top-right',
              message: data.message,
              type: 'success'
            })

            await this.$router.push({name: 'client.ManageArticle'})
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
        } catch (e) {
          this.handleError(e)
        }
      }, 1500)
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
