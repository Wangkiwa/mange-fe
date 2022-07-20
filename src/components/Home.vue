<template>
  <div id="home">
    <div class="basic-layout">
      <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
        <!-- 系统LOGO -->
        <div class="logo">
          <img src="./../assets/logo.png" />
          <span>Manager</span>
        </div>
        <!-- 导航菜单 -->
        <el-menu
          :default-active="activeMenu"
          background-color="#001529"
          text-color="#fff"
          router
          :collapse="isCollapse"
          class="nav-menu"
        >
          <TreeMenu :userMenu="userMenu"></TreeMenu>
        </el-menu>
      </div>
      <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
        <div class="nav-top">
          <div class="nav-left">
            <div class="menu-fold" @click="toggle">
              <el-icon><Fold /></el-icon>
            </div>
            <div class="bread">
              <BreadCrumd></BreadCrumd>
            </div>
          </div>
          <div class="user-info">
            <el-badge
              :value="noticeCount"
              class="notice"
              type="danger"
              @click="$router.push('/audit/approve')"
            >
              <!--:is-dot="noticeCount > 0 ? true : false" -->
              <el-icon><Bell /></el-icon>
            </el-badge>
            <el-dropdown class="dropUserInfo" @command="handleLogout">
              <span class="user-link">
                {{ userInfo.userName }}
                <i class="el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="email">
                    邮箱：{{ userInfo.userEmail }}
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import BreadCrumd from "./BreadCrumd.vue";
export default {
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo || {},
      userMenu: [],
      activeMenu: location.hash.slice(1),
    };
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount;
    },
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    // 折叠
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    // 下拉菜单钩子
    handleLogout(key) {
      if (key == "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = {};
      this.$router.push("/login");
    },
    // 通知数量
    async getNoticeCount() {
      let count = await this.$api.noticeCount();
      // 将count提交到Vuex里面
      this.$store.commit("saveNoticeCount", count);
    },
    // 菜单数据
    async getMenuList() {
      const { menuList, actionList } = await this.$api.getPermissionList();
      this.userMenu = menuList;
      this.$store.commit("saveUserMenu", menuList);
      this.$store.commit("saveUserAction", actionList);
    },
  },
  components: { TreeMenu, BreadCrumd },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
        .dropUserInfo {
          line-height: 50px;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
