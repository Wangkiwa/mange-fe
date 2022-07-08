<template>
  <div id="login">
    <h1>我是Login组件</h1>
    <router-link to="/welcome">去首页</router-link>
  </div>
</template>

<script>
  export default {
    mounted() {
      // this.$request({
      //   method: "get",
      //   url: "/login",
      //   data: {
      //     name: "jack",
      //   },
      // }).then(res => {
      //   console.log(res)
      // })
      this.$request
        .get("./login", {
          data: {
            name: "jack",
          },
        })
        .then(res => {
          console.log(res)
        })
    },
  }
</script>

<style></style>
