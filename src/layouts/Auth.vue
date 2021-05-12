<template>
  <section>
    <transition name="page" mode="out-in">
        <router-view></router-view>
    </transition>
  </section>
</template>

<script>

export default {
  name: 'Auth',
  components: {}
}
</script>


<style lang="scss" scoped>

</style>
