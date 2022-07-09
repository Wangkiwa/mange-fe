<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    mounted() {
      // this.$storage.setItem("name", "zsd")
      // console.log(this.$storage.getItem("name"))
      this.$storage.clearItem("age")
    },
  }
</script>

<style></style>
