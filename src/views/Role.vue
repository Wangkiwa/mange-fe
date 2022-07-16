<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="roleListform" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('roleListform')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="base-table">
    <div class="action">
      <el-button type="primary" @click="handleAdd">创建</el-button>
    </div>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleOpenPermission(scope.row)"
          >
            设置权限
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.row._id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      background
      layout="prev, pager ,next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- 新增Dialog -->
  <el-dialog title="用户新增" v-model="showModal">
    <el-form
      ref="dialogForm"
      :model="roleForm"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input v-model="roleForm.remark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
  <!-- 权限弹框 -->
  <el-dialog title="权限设置" v-model="showPermission">
    <el-form label-width="100px">
      <el-form-item label="角色名称">
        {{ curRoleName }}
      </el-form-item>
      <el-form-item label="选择权限">
        <el-tree
          ref="treeRef"
          :data="menuList"
          node-key="_id"
          :props="{ label: 'menuName' }"
          default-expand-all
          show-checkbox
        ></el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showPermission = false">取消</el-button>
      <el-button type="primary" @click="handPermissionSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        queryForm: {
          roleName: "",
        },
        // Dialog显示
        showModal: false,
        // 表格数据
        roleList: [],
        // 角色表单
        roleForm: {},
        // action create创建/edit编辑/delete删除
        action: "create",
        // 校验规则
        rules: {
          roleName: [
            {
              required: true,
              message: "角色名称不能为空",
              trigger: "blur",
            },
          ],
        },
        columns: [
          {
            label: "角色名称",
            prop: "roleName",
          },
          {
            label: "备注",
            prop: "remark",
          },
          {
            label: "权限列表",
            prop: "permissionList",
            formatter: (row, column, value) => {
              let names = []
              let list = value.halfCheckedKeys || []
              list.map(key => {
                let name = this.actionMap[key]
                if (key && name) names.push(name)
              })
              return names.join(",")
            },
          },
          {
            label: "修改时间",
            prop: "updateTime",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
        ],
        pager: {
          pageSize: 10,
          pageNum: 1,
          total: 0,
        },
        // 权限显示
        showPermission: false,
        curRoleId: "",
        curRoleName: "",
        menuList: [],
        // 外部权限显示
        actionMap: {},
      }
    },
    mounted() {
      this.getRoleList()
      this.getMenuList()
    },
    methods: {
      // 查询
      getRoleList() {
        this.getRoleList()
      },
      // 列表初始化
      async getRoleList() {
        let { list, page } = await this.$api.getRoleList({
          ...this.queryForm,
          ...this.pager,
        })
        this.roleList = list
        this.pager.total = page.total
      },
      // 权限初始化
      async getMenuList() {
        let list = await this.$api.getMenuList()
        this.menuList = list
        this.getActionMap(list)
      },
      // 重置按钮
      handleReset(form) {
        this.$refs[form].resetFields()
      },
      // 顶部创建
      handleAdd() {
        this.action = "create"
        this.showModal = true
      },
      // 取消Dialog
      handleClose() {
        this.showModal = false
        this.handleReset("dialogForm")
      },
      // 提交Dialog
      handleSubmit() {
        this.$refs.dialogForm.validate(async valid => {
          if (!valid) return this.$message.error("创建失败!")
          const { action, roleForm } = this
          const params = { ...roleForm, action }
          const list = await this.$api.rolesSubmit(params)
          this.showModal = false
          this.$message.success(
            `${this.action == "edit" ? "编辑" : "新建"}成功！`
          )
          this.handleReset("dialogForm")
          this.getRoleList()
        })
      },
      // 编辑
      handleEdit(row) {
        this.action = "edit"
        this.showModal = true
        this.$nextTick(() => {
          this.roleForm = {
            _id: row._id,
            roleName: row.roleName,
            remark: row.remark,
          }
        })
      },
      // 删除
      handleDel(_id) {
        this.action = "delete"
        let { action } = this
        let params = { action, _id }
        this.$api.rolesSubmit(params)
        this.getRoleList()
        this.$message.success("删除成功！")
      },
      // 编辑权限
      handleOpenPermission(row) {
        this.curRoleId = row._id
        this.curRoleName = row.roleName
        this.showPermission = true
        let { checkedKeys } = row.permissionList
        setTimeout(() => {
          // checkedKeys只负责按钮权限
          this.$refs.treeRef.setCheckedKeys(checkedKeys)
        })
      },
      // 权限Dialog提交
      async handPermissionSubmit() {
        // 返回当前选中节点的数组
        let nodes = this.$refs.treeRef.getCheckedNodes()
        //返回目前半选中的节点的 key 所组成的数组
        let halfKeys = this.$refs.treeRef.getHalfCheckedKeys()
        // 选中的节点
        let checkedKeys = []
        //  未选中
        let parentKeys = []
        // 过滤选中的数组
        nodes.map(node => {
          if (!node.children) {
            // 选中
            checkedKeys.push(node._id)
          } else {
            // 未选中
            parentKeys.push(node._id)
          }
        })
        // 定义提交的参数
        let params = {
          _id: this.curRoleId,
          permissionList: {
            checkedKeys, //选中的子菜单
            halfChecjedKeys: parentKeys.concat(halfKeys), //半选中的父菜单
          },
        }
        await this.$api.updatePermission(params)
        this.showPermission = false
        this.$message.success("设置成功")
        this.getRoleList()
      },
      // 菜单列表的递归遍历，转换为字典
      getActionMap(list) {
        // 字典
        let actionMap = {}
        const deep = arr => {
          while (arr.length) {
            let item = arr.pop()
            // 操作菜单是按钮
            if (item.children && item.action) {
              actionMap[item._id] = item.menuName
            }
            if (item.children && !item.action) {
              deep(item.children)
            }
          }
        }
        deep(JSON.parse(JSON.stringify(list)))
        this.actionMap = actionMap
      },
      //分页变化
      handleCurrentChange(current) {
        this.pager.pageNum = current
        this.getRoleList()
      },
    },
  }
</script>

<style></style>
