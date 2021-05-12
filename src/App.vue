<template>
  <div id="app">
    <component :is="layout" v-if="layout"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',

  components: {
    'auth': () => import('layouts/Auth.vue'),
    'default': () => import('layouts/Default.vue'),
    'web': () => import('layouts/Web.vue')
  },

  computed: {
    ...mapGetters([
      'layout'
    ])
  }
}
</script>

<style>

</style>
