<template>
<!--  <textarea-->
<!--    class="form-control"-->
<!--    :rows="rowCount"-->
<!--    :placeholder="placeholder"-->
<!--    :disabled="isDisabled"-->
<!--  ></textarea>-->

  <div v-if="isHorizontal"
       class="form-group"
  >

    <label :for="vaId" class="col-sm-2 control-label">{{ title }}</label>
    <div class="col-sm-10">
      <textarea
        :type="type"
        class="form-control"
        :id="vaId"
        :placeholder="placeholder"
        v-model="takeValue"
        :rows="rowCount" />
    </div>

  </div>
  <textarea v-else
         :type="type"
            class="form-control"
         :id="vaId"
         :placeholder="placeholder"
            v-model="takeValue"
         :disabled="isDisabled"
            :rows="rowCount"/>
</template>

<script>
export default {
  name: 'va-textarea',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    type: {
      type: String,
      default: 'textarea'
    },
    vaId: {
      type: String
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
    placeholder: {
      type: String,
      default: ''
    },
    rowCount: {
      type: Number,
      default: 3
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
    }
  },

  created () {

  }
}
</script>
