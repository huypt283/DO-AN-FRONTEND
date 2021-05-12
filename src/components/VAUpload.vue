<template>

  <div v-if="isHorizontal"
       class="form-group"
  >

    <label :for="vaId" class="col-sm-2 control-label">{{ title }}</label>

    <div class="col-sm-10">

      <input
        :type="type"
        :class="[formControl, getSize]"
        :id="vaId"
        :placeholder="placeholder"
        @change="onFileChange"
      >
      <div class="img-review">
        <img v-if="value" :src.sync="value" alt="#" class="img img-responsive img-fluid"/>
      </div>
    </div>
  </div>

  <input v-else
         :type="type"
         :class="[formControl, getSize]"
         :id="vaId"
         :placeholder="placeholder"
         @change="onFileChange"
         :disabled="isDisabled"
  >


</template>

<script>
export default {
  name: 'va-input',

  props: {
    type: {
      type: String,
      default: 'file'
    },

    vaId: {
      type: String
    },

    placeholder: {
      type: String,
      default: 'Enter Text...'
    },

    size: {
      type: String
    },

    url: {
      type: String, default: ''
    },

    value: {
      type: String, default: null
    },

    isFormControl: {
      type: Boolean,
      default: true
    },

    isHorizontal: {
      type: Boolean,
      default: false
    },

    title: {
      type: String
    },

    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {

    getSize () {
      if (!this.size) {
        return ''
      }
      return 'input-' + this.size
    },

    formControl () {
      return this.isFormControl ? 'form-control' : ''
    }
  },
  methods: {

    onFileChange (e) {
      const file = e.target.files[0]
      let reader = new FileReader()
      this.$emit('update:url', this.url)
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
        this.$emit('update:value', {name: file.name, size: file.size, type: file.type, value: reader.result})
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .img-review{
    margin: 15px 0;
    width: 200px;
    height: 200px;
    background-color: #f5f5f5;
  }
</style>
