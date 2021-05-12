<template>
  <aside id="slider" class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul data-widget="tree" class="sidebar-menu">
        <va-slide-item
          v-for="(item,index) in slideMenuItems"
          :data="item"
          :key="index"
          :type="item.type"
          :isHeader="item.isHeader"
          :icon="item.icon"
          :name="item.name"
          :badge="item.badge"
          :items="item.items"
          :router="item.router"
          :link="item.link"
          v-if="checkAuth(item.auth)"
        >
        </va-slide-item>
      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import VASlideItem from './components/VASlideItem'
import {mapGetters} from 'vuex'

export default {
  name: 'va-slider',
  props: {
    slideMenuItems: {
      type: Array,
      default: []
    }
  },

  created () {
  },

  components: {
    'va-slide-item': VASlideItem
  },

  mounted () {

  },

  methods: {
    test () {
    },
    checkAuth (val) {
      if (val === undefined) return true
      if (val === this.profile.role) return true
    }
  },

  computed: {
    ...mapGetters([
      'profile',
      'role'
    ])
  }

}
</script>
