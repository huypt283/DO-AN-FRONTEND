<template>
  <!-- Info boxes -->
  <!--  <va-alert/>-->
  <section class="content">
    <loading :active.sync="isLoading"
             :can-cancel="true"
             :on-cancel="onCancel"
             :is-full-page="true"></loading>

    <div class="row">
      <form @submit.prevent="editStaff" class="form-horizontal w-100">
        <column :classCustom=" 'col-md-12' ">
          <va-box
            title="Cập nhật nhân viên"
            theme="box-info"
            :isBorder="true"
            widgetType="">

            <div slot="content">
              <va-input
                :isHorizontal="true"
                title="Họ tên"
                placeholder="Họ tên"
                type="text"
                v-model="$v.formData.name.$model"
                vaId="horizontal-name"
              ></va-input>
              <span class="ml-3 text-danger" v-if="!$v.formData.name.required" v-html=" 'Tên không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.name.minLength && $v.formData.name.required"
                    v-html=" 'Tên tối phải thiểu có 3 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.name.maxLength && $v.formData.name.required"
                    v-html=" 'Tên có tối đa có 50 kí tự<br>' "/>

              <va-input
                :isHorizontal="true"
                title="CMND"
                placeholder="CMND"
                type="text"
                v-model="$v.formData.cardId.$model"
                vaId="horizontal-cardId"
              ></va-input>
              <span class="ml-3 text-danger" v-if="!$v.formData.cardId.required"
                    v-html=" 'Số CMND không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.cardId.minLength && $v.formData.cardId.required"
                    v-html=" 'Số CMND phải tối thiểu có 9 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.cardId.maxLength && $v.formData.cardId.required"
                    v-html=" 'Số CMND có tối đa có 12 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.cardId.integer && $v.formData.cardId.required"
                    v-html=" 'Số CMND phải là số<br>' "/>

              <va-input
                :isHorizontal="true"
                title="Ngày sinh"
                placeholder="Ngày sinh"
                type="date"
                v-model="$v.formData.birthday.$model"
                vaId="horizontal-birthday"
              ></va-input>
              <span class="ml-3 text-danger" v-if="!$v.formData.birthday.required"
                    v-html=" 'Ngày sinh không được trống<br>' "/>

              <va-textarea
                :isHorizontal="true"
                title="Địa chỉ"
                placeholder="Địa chỉ"
                type="textarea"
                v-model="$v.formData.address.$model"
                vaId="horizontal-address"
              ></va-textarea>
              <span class="ml-3 text-danger" v-if="!$v.formData.address.required"
                    v-html=" 'Địa chỉ không được trống<br>' "/>

              <div class="form-group col-sm-10">
                <label for="inputState1">Quyền truy cập</label>
                <select id="inputState1" class="form-control" v-model="$v.formData.role.$model">
                  <option selected value="true">Super Admin</option>
                  <option value="false">Admin</option>
                </select>
              </div>
              <span class="ml-3 text-danger" v-if="!$v.formData.role.required"
                    v-html=" 'Vai trò không được trống<br>' "/>

              <div class="form-group col-sm-10">
                <label for="inputState">Giới tính</label>
                <select id="inputState" class="form-control" v-model="$v.formData.gender.$model">
                  <option selected value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <span class="ml-3 text-danger" v-if="!$v.formData.gender.required"
                    v-html=" 'Giới tính không được trống<br>' "/>

              <va-input
                :isHorizontal="true"
                title="Số điện thoại"
                placeholder="Số điện thoại"
                type="text"
                v-model="$v.formData.phone.$model"
                vaId="horizontal-phone"
              ></va-input>
              <span class="ml-3 text-danger" v-if="!$v.formData.phone.required"
                    v-html=" 'Số điện thoại không được trống<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.phone.minLength && $v.formData.phone.required"
                    v-html=" 'Số điện thoại phải tối thiểu có 9 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.phone.maxLength && $v.formData.phone.required"
                    v-html=" 'Số điện thoại có tối đa có 11 kí tự<br>' "/>
              <span class="ml-3 text-danger" v-if="!$v.formData.phone.integer && $v.formData.phone.required"
                    v-html=" 'Số điện thoại phải là số<br>' "/>

            </div>

            <div slot="footer">
              <router-link :to="{ name: 'sysadmin/staffs.Index' }">
                <va-button :isBlock="false" name="Trở lại"></va-button>
              </router-link>
              <va-button type="submit" :isBlock="false" theme="info" align="right" name="Cập nhật"
                         :disabled="this.$v.formData.$invalid"></va-button>
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
import {integer, maxLength, minLength, required} from 'vuelidate/lib/validators'
import {StaffService} from '../../../api/index'
import moment from 'moment'

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
    'va-textarea': VaTextarea
  },

  data () {
    return {
      isLoading: false,
      formData: {
        name: '',
        cardId: '',
        birthday: '',
        address: '',
        role: false,
        gender: true,
        phone: ''
      }
    }
  },

  validations: {
    formData: {
      name: {required, minLength: minLength(3), maxLength: maxLength(50)},
      cardId: {required, integer, minLength: minLength(9), maxLength: maxLength(12)},
      birthday: {required},
      address: {required},
      role: {required},
      gender: {required},
      phone: {required, integer, minLength: minLength(9), maxLength: maxLength(11)}
    }
  },

  async created () {
    const {data, status} = await StaffService.detail(this.$route.params.id)
    if (status === 200) {
      this.collection = data
    } else {
      this.$toast.open({
        position: 'top-right',
        message: data.message,
        type: 'error'
      })
      await this.$router.push({name: 'sysadmin/staffs.Index'})
    }

    this.$v.formData.name.$model = this.collection.name
    this.$v.formData.cardId.$model = this.collection.cardId
    this.$v.formData.birthday.$model = moment(this.collection.birthday).format('YYYY-MM-DD')
    this.$v.formData.address.$model = this.collection.address
    this.$v.formData.role.$model = this.collection.role === 'SUPER_ADMIN' ? 'true' : 'false'
    this.$v.formData.gender.$model = this.collection.gender
    this.$v.formData.phone.$model = this.collection.phone
  },

  computed: {},

  methods: {
    async editStaff () {
      if (this.$v.formData.$invalid) {
        this.$toast.open({
          position: 'top-right',
          message: 'Dữ liệu không hợp lệ',
          type: 'error'
        })
        return
      }

      this.isLoading = true
      setTimeout(async () => {
        try {
          const {data, status} = await StaffService.edit(this.formData, this.$route.params.id)

          if (status === 200) {
            this.$toast.open({
              position: 'top-right',
              message: data.message,
              type: 'success'
            })

            await this.$router.push({name: 'sysadmin/staffs.Index'})
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
