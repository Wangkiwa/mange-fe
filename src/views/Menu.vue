<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        ref="userListform"
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
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
      <el-button type="primary" @click="handleAdd(1)">新增</el-button>
    </div>
    <el-table :data="menuList" row-key="_id" style="width: 100%">
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
          <el-button size="small" @click="handleAdd(2, scope.row)"> 新增 </el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row._id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 新增Diaolog -->
  <el-dialog title="用户新增" v-model="showModal" append-to-body>
    <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules">
      <el-form-item label="父级菜单" prop="parentId">
        <el-cascader
          v-model="menuForm.parentId"
          :options="menuList"
          :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
          clearable
        />
        <span>不选，则直接创建一级菜单</span>
      </el-form-item>
      <el-form-item label="菜单按钮" prop="menuType">
        <el-radio-group v-model="menuForm.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
        <el-input v-model="menuForm.icon" placeholder="请输入岗位" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
        <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
        <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType == 1">
        <el-input
          v-model="menuForm.component"
          placeholder="请输入组件路径"
          v-show="menuForm.menuType == 1"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuState" v-show="menuForm.menuType == 1">
        <el-radio-group v-model="menuForm.menuState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryForm: {
        menuState: 1,
      },
      // 表格数据
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
          width: 80,
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
          width: 80,
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 100,
        },
      ],
      showModal: false,
      // Dialog表单数据
      menuForm: {
        parentId: [null],
        menuType: 1,
        menuState: 1,
      },
      action: "add",
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "字符长度保持在2-10位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 菜单列表初始化
    async getMenuList() {
      let list = await this.$api.getMenuList(this.queryForm);
      this.menuList = list;
    },
    // 查询按钮
    handleQuery() {
      this.getMenuList();
    },
    // 重置按钮
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 新增
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      // 单个新增
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter((item) => item);
      }
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.menuForm, row);
      });
    },
    // 删除
    async handleDel(_id) {
      await this.$api.menuSubmit({ _id, action: "delete" });
      this.$message.success("删除成功！");
      this.getMenuList();
    },
    // Dialog提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (!valid) return this.$message.error("校验失败");
        let { action, menuForm } = this;
        let params = { ...menuForm, action };
        console.log(params);
        const res = await this.$api.menuSubmit(params);
        this.showModal = false;
        this.$message.success(`${this.action == "edit" ? "编辑" : "新增"}菜单成功！`);
        this.handleReset("dialogForm");
        this.getMenuList();
      });
    },
    // Dialog取消
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
  },
};
</script>

<style></style>
