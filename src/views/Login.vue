<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="user" status-icon :rules="userRules">
        <div class="title">后台管理系统</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            v-model="user.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            prefix-icon="el-icon-view"
            v-model="user.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          userName: "admin",
          userPwd: "admin",
        },
        userRules: {
          userName: [
            {
              required: true,
              message: "请输入用户名",
              tigger: "blur",
            },
          ],
          userPwd: [
            {
              required: true,
              message: "请输入密码",
              tigger: "blur",
            },
          ],
        },
      }
    },
    methods: {
      login() {
        this.$refs.userForm.validate(valid => {
          if (!valid) return
          // 调用登录接口
          this.$api.login(this.user).then(res => {
            this.$store.commit("saveUserInfo", res)
            this.$router.push("/welcome")
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  .login-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .modal {
      width: 500px;
      padding: 50px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    }
    .title {
      font-size: 30px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
</style>
