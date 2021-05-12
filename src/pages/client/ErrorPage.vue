<template>

  <div id="404">
    <div class="page-wrap d-flex flex-row align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-12 text-center">
            <span class="display-1 d-block">404</span>
            <div class="mb-4 lead">Không tìm thấy dữ liệu.</div>
            <router-link :to="{ name: 'client.Home' }">
              <a href="#" class="btn btn-link">Về trang chủ</a>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  name: 'error-page',

  data () {
    return {
    }
  }

}
</script>
<style>
</style>
