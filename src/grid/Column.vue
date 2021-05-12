<template>
  <div :class="classCustom">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'column',
  props: {
    classCustom: {
      type: String,
      default: ''
    }
  },
  created () {

  }
}
</script>
