<template>
  <div class="main_app" style="width:300px;height:400px;">
    <div class="flex flex-col items-center">
      <h1 class="font-bold text-2xl">{{msg}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      msg: 'EveryPost'
    }
  }
}

</script>

<style>
.main_app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
