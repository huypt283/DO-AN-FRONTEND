<template>

  <section class="content">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>

    <div class="row">
      <form @submit.prevent="editNews" class="form-horizontal w-100">

        <column :classCustom=" 'col-md-12' ">
          <va-box
            title="Cập nhật tin tức"
            theme="box-info"
            :isBorder="true"
            widgetType="">

            <div slot="content">

              <va-input
                :isHorizontal="true"
                title="Tiêu đề "
                placeholder="Tiêu đề "
                type="text"
                v-model="$v.formData.title.$model"
                vaId="horizontal-email"
              ></va-input>
              <span class="ml-3 text-danger" v-if="!$v.formData.title.required"
                    v-html=" 'Tiêu đề không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.title.required && !$v.formData.title.minLength"
                    v-html=" 'Tiêu đề tối thiểu có 3 kí tự<br>' "/>


              <div class="col-sm-10">
                <quill-editor v-model="$v.formData.content.$model">
                </quill-editor>
              </div>
              <span class="ml-3 text-danger" v-if="!$v.formData.content.required"
                    v-html=" 'Nội dung không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="$v.formData.content.required && !$v.formData.content.minLength"
                    v-html=" 'Nội dung tối thiểu có 100 kí tự<br>' "/>
              <br>
              <br>
              <div class="col-sm-10">
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

                <div>Hình ảnh sẽ xuất hiện trong tin tức<label style="color: red">*</label></div>
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

              </div>
            </div>

            <div slot="footer">
              <router-link :to="{ name: 'sysadmin/news.Index' }">
                <va-button :isBlock="false" name="Trở lại"></va-button>
              </router-link>
              <va-button type="submit" :isBlock="false" theme="info" align="right" name="Cập nhật"
                         :disabled="this.$v.formData.$invalid || !validImages"></va-button>

            </div>

          </va-box>

        </column>
      </form>
    </div>
  </section>
</template>

<script>
import VABox from '../../../widgets/VABox'
import VAInputGroup from '../../../components/VAInputGroup'
import VACheckBox from '../../../components/VACheckBox'
import VAInput from '../../../components/VAInput'
import VAButton from '../../../components/VAButton'
import VATextareaGroup from '../../../components/VATextareaGroup'
import VAFormGroup from '../../../components/VAFormGroup'
import VARadio from '../../../components/VARadio'
import VASelect from '../../../components/VASelect'
import VAAlert from '../../../components/VAAlert'
import VaTextarea from '../../../components/VATextarea'
import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import VAUpload from '../../../components/VAUpload'
import {NewsService} from '../../../api/index'
import fire from '../../../store/fire'

export default {
  name: 'sample',

  components: {
    'va-box': VABox,
    'va-input-group': VAInputGroup,
    'va-checkbox': VACheckBox,
    'va-input': VAInput,
    'va-button': VAButton,
    'va-textarea-group': VATextareaGroup,
    'va-form-group': VAFormGroup,
    'va-radio': VARadio,
    'va-select': VASelect,
    'va-alert': VAAlert,
    'va-textarea': VaTextarea,
    'va-upload': VAUpload
  },

  data () {
    return {
      isLoading: false,
      file: [],
      validImages: false,
      uploadImageList: [],
      imageList: [],
      formData: {
        title: '',
        content: '',
        images: null
      }
    }
  },

  validations: {
    formData: {
      title: {required, minLength: minLength(3), maxLength: maxLength(225)},
      content: {required, minLength: minLength(100)}
    }
  },

  async created () {
    const {data, status} = await NewsService.adminNewsDetail(this.$route.params.id)
    if (status === 200) {
      this.collection = data
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'sysadmin/news.Index'})
    }

    this.$v.formData.title.$model = this.collection.title
    this.$v.formData.content.$model = this.collection.content
    this.uploadImageList = this.collection.images
    this.validImages = this.uploadImageList.length > 0
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

    async editNews () {
      if (this.$v.formData.$invalid) {
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
          const {data, status} = await NewsService.editNews(this.formData, this.$route.params.id)

          if (status === 200) {
            this.$toast.open({
              position: 'top-right',
              message: data.message,
              type: 'success'
            })

            await this.$router.push({name: 'sysadmin/news.Index'})
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

        this.isLoading = false
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
  },

  fieldState (validation) {
    return {
      'is-invalid is-invalid-lite': validation.$error && validation.$dirty,
      'is-valid is-valid-lite': !validation.$invalid
    }
  }
}
</script>
