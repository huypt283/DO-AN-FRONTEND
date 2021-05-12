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
        v-model="takeValue"
      >
      </input>
    </div>

  </div>
  <input v-else
         :type="type"
         :class="[formControl, getSize]"
         :id="vaId"
         :placeholder="placeholder"
         v-model="takeValue"
         :disabled="isDisabled"
  >
  </input>


</template>

<script>
export default {
  name: 'va-input',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    type: {
      type: String,
      default: 'text'
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
    value: {
      type: String, default: ''
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
    takeValue: {
      get () {
        return this.$props.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },

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
  created () {

  }
}
</script>
