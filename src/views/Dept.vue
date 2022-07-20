<template>
  <div class="dept-manage">
    <!-- 头部搜索 -->
    <div class="query-form">
      <el-form :inline="true" ref="queryFormRef" :model="queryForm">
        <el-form-item>
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查询</el-button>
          <el-button @click="handleRest('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreateOpen">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button type="danger" @click="handleDel(scope.row._id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- Dialog对话框 -->
  <el-dialog :title="action == 'create' ? '创建部门' : '编辑部门'" v-model="showModal">
    <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader
          placeholder="请选择上级部门"
          v-model="deptForm.parentId"
          :options="deptList"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          show-all-levels
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="user">
        <el-select
          placeholder="请选择部门负责人"
          v-model="deptForm.user"
          @change="handleUser"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="`${item.userId}/${item.userName}/${item.userEmail}`"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人邮箱" prop="userEmail">
        <el-input
          placeholder="请输入负责人邮箱"
          v-model="deptForm.userEmail"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleSubmit" type="primary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryForm: {
        deptName: "",
      },
      // 表格列
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          // formatter(row, column, value) {
          //   return utils.formateDate(new Date(value))
          // },
        },
        {
          label: "创建时间",
          prop: "createTime",
          // formatter(row, column, value) {
          //   return utils.formateDate(new Date(value))
          // },
        },
      ],
      // create创建/edit编辑/delete删除
      action: "create",
      // 表格数据
      deptList: [],
      // 页码
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      // Dialog对话框
      showModal: false,
      userList: [],
      // Dialog数据
      deptForm: {
        parentId: [null],
      },
      rules: {
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    // 部门列表
    async getDeptList() {
      let list = await this.$api.getDeptList(this.queryForm);
      this.deptList = list;
    },
    //  用户列表
    async getAllUserList() {
      this.userList = await this.$api.getAllUserList();
    },
    // 重置按钮
    handleRest(form) {
      this.$refs[form].resetFields();
    },
    //  创建
    handleCreateOpen() {
      this.action = "create";
      this.showModal = true;
    },
    // 编辑
    handleEdit(row) {
      console.log(row);
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        });
      });
    },
    // 删除
    handleDel(_id) {
      this.action = "delete";
      let res = this.$api.deptOperate({ _id, action: this.action });
      this.$message.success("删除成功！");
      this.getDeptList();
    },
    // Dialog取消
    handleClose() {
      this.showModal = false;
      this.handleRest("dialogForm");
    },
    // Dialog确定
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm, action: this.action };
          console.log(this.action);
          console.log(params);
          delete params.user;
          let res = this.$api.deptOperate(params);
          if (res) {
            this.$message.success("操作成功");
            this.handleClose();
            this.getDeptList();
          }
        }
      });
    },
    handleUser(value) {
      const [userId, userName, userEmail] = value.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
  },
};
</script>

<style></style>
