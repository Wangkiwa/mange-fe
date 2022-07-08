<template>
  <div id="welcome">
    <h1>我是welcome组件</h1>
    <el-button type="primary" @click="goLogin">去登录</el-button>
  </div>
</template>

<script>
  import { useRouter } from "vue-router"

  export default {
    setup() {
      const router = useRouter()
      function goLogin() {
        router.push("/login")
      }
      return {
        goLogin,
      }
    },
  }
</script>

<style></style>
