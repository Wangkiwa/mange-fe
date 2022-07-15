<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        ref="userListform"
        :inline="true"
        :model="user"
        class="demo-form-inline"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" placeholder="请选择职位">
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('userListform')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="base-table">
    <div class="action">
      <el-button type="primary" @click="handleCreate">新增</el-button>
      <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
    </div>
    <el-table
      :data="userList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="item.formatter"
      />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">
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
  <!-- 新增Diaolog -->
  <el-dialog title="用户新增" v-model="showModal" append-to-body>
    <el-form
      ref="dialogForm"
      :model="userForm"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="userForm.userName"
          :disabled="action === 'edit'"
          placeholder="请输入用户名称"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input
          v-model="userForm.userEmail"
          :disabled="action === 'edit'"
          placeholder="请输入用户邮箱"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input v-model="userForm.job" placeholder="请输入岗位" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="userForm.state">
          <el-option :value="1" label="在职"></el-option>
          <el-option :value="2" label="离职"></el-option>
          <el-option :value="3" label="试用期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色" prop="roleList">
        <el-select
          v-model="userForm.roleList"
          multiple
          style="width: 100%"
          placeholder="请选择用户系统角色"
        >
          <el-option
            v-for="role in roleList"
            :key="role._id"
            :label="role.roleName"
            :value="role._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="userForm.deptId"
          placeholder="请选择所属部门"
          :options="deptList"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          clearable
          style="width: 100%"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getCurrentInstance, ref, reactive, onMounted, toRaw } from "vue"
  export default {
    // setup语法糖---Composition API
    setup() {
      const { proxy } = getCurrentInstance()
      // 用户信息
      const user = reactive({
        state: 1,
      })
      // 用户数据
      const userList = ref([])
      // 新增用户表单数据
      const userForm = reactive({
        userName: "",
        state: 3,
      })
      let showModal = ref(false)
      // 表格列数据
      const columns = reactive([
        {
          label: "用户ID",
          prop: "userId",
        },
        {
          label: "用户名",
          prop: "userName",
        },
        {
          label: "用户邮箱",
          prop: "userEmail",
        },
        {
          label: "用户角色",
          prop: "role",
          formatter(row, column, value) {
            return {
              0: "管理员",
              1: "普通用户",
            }[value]
          },
        },
        {
          label: "用户状态",
          prop: "state",
          formatter(row, column, value) {
            return {
              1: "在职",
              2: "离职",
              3: "试用期",
            }[value]
          },
        },
        {
          label: "注册时间",
          prop: "createTime",
          width: 180,
          // formatter: (row, column, value) => {
          //   return column
          // },
        },
        {
          label: "最后登录时间",
          prop: "lastLoginTime",
          width: 180,
          // formatter: (row, column, value) => {
          //   return utils.formateDate(new Date(value))
          // },
        },
      ])
      // 角色列表数据
      let roleList = reactive([])
      // 部门列表数据
      const deptList = ref([])
      // 定义用户操作行为
      let action = ref("add")
      // 多选数据
      let checkedUserIds = reactive([])
      // 定义表单校验规则
      const rules = reactive({
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        userEmail: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
        ],
        mobile: [
          {
            pattern: /1\d{10}/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
      })
      // 页码
      const pager = reactive({
        pageNum: 1,
        pageSize: 10,
      })
      onMounted(() => {
        getUserList()
        getRoleAllList()
        getDeptList()
      })
      // 获取用户列表
      const getUserList = async () => {
        try {
          let params = { ...user, ...pager }
          const { list, page } = await proxy.$api.getUserList(params)
          userList.value = list
          pager.total = page.total
        } catch (error) {
          throw error
        }
      }
      // 查询列表
      const handleQuery = () => {
        getUserList()
      }
      // 顶部重置
      const handleReset = form => {
        proxy.$refs[form].resetFields()
      }
      // 分页条件
      const handleCurrentChange = current => {
        pager.pageNum = current
        getUserList()
      }
      // 删除单个用户
      const handleDel = async row => {
        await proxy.$api.userDel({ userIds: [row.userId] })
        proxy.$message.success("删除成功！")
        getUserList()
      }
      // 批量删除
      const handlePatchDel = async () => {
        if (checkedUserIds.length == 0) {
          proxy.$message.error("请选择要删除的用户!")
          return
        } else {
          await proxy.$api.userDel({ userIds: checkedUserIds })
          proxy.$message.success("删除成功！")
          getUserList()
        }
      }
      // 表格多选
      const handleSelectionChange = list => {
        let arr = []
        list.map(item => {
          arr.push(item.userId)
        })
        checkedUserIds = arr
      }
      // 新增按钮
      const handleCreate = () => {
        action.value = "add"
        showModal.value = true
      }
      // 部门列表
      const getDeptList = async () => {
        let list = await proxy.$api.getDeptList()
        deptList.value = list
      }
      // 角色列表查询
      const getRoleAllList = async () => {
        let res = await proxy.$api.getRoleAllList()
        roleList.push(...res)
      }
      // Dislog取消
      const handleClose = () => {
        showModal.value = false
        handleReset("dialogForm")
      }
      // Dialog确定按钮
      const handleSubmit = () => {
        proxy.$refs.dialogForm.validate(async valid => {
          if (valid) {
            let params = toRaw(userForm)
            params.userEmail += "@imooc.com"
            params.action = action.value
            let res = await proxy.$api.userSubmit(params)
            if (res) {
              showModal.value = false
              proxy.$message.success("新增用户成功！")
              handleReset("dialogForm")
              getUserList()
            } else {
              proxy.$message.error("新增用户失败！")
              return
            }
          }
        })
      }
      // 用户编辑
      const handleEdit = row => {
        action.value = "edit"
        showModal.value = true
        /* ui组件重置功能会重置为初始值
          如果初始值为 Object.assign(userForm, row)的值那么重置之后的值也会是该值。所以需要异步执行，弹框弹出之后再赋值
       */
        proxy.$nextTick(() => {
          Object.assign(userForm, row)
        })
      }
      return {
        user,
        columns,
        userList,
        pager,
        checkedUserIds,
        userForm,
        showModal,
        rules,
        roleList,
        deptList,
        action,
        getUserList,
        handleQuery,
        handleReset,
        handleCurrentChange,
        handleDel,
        handlePatchDel,
        handleSelectionChange,
        handleCreate,
        getRoleAllList,
        getDeptList,
        handleClose,
        handleSubmit,
        handleEdit,
      }
    },
  }
</script>

<style></style>
