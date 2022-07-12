<template>
  <div>
    <template v-for="menu in userMenu" :key="menu._id">
      <el-sub-menu
        v-if="
          menu.children &&
          menu.children.length > 0 &&
          menu.children[0].menuType == 1
        "
        :index="menu.path"
      >
        <template #title>
          <el-icon v-if="menu.icon"><Setting /></el-icon>
          <span>{{ menu.menuName }}</span>
        </template>
        <TreeMenu :userMenu="menu.children"></TreeMenu>
      </el-sub-menu>
      <el-menu-item
        v-else-if="menu.menuType == 1"
        :index="menu.path"
        :key="menu._id"
      >
        {{ menu.menuName }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      userMenu: {
        type: Array,
        default() {
          return []
        },
      },
    },
  }
</script>

<style></style>
