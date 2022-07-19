<!--
 * @Descripttion: 审批
 * @Author: WangRunZhi
 * @Date: 2022-07-18 21:40:49
-->
<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form
        ref="userListform"
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item label="审批状态" prop="state">
          <el-select v-model="queryForm.applyState">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
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
      <el-button type="primary" @click="handleApply">申请休假</el-button>
    </div>
    <el-table :data="applyList" style="width: 100%">
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
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">
            查看
          </el-button>
          <el-button
            v-if="[1, 2].includes(scope.row.applyState)"
            type="danger"
            size="small"
            @click="handleDelete(scope.row._id)"
          >
            作废
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
  <!-- 休假申请DiaLog -->
  <el-dialog title="申请休假" v-model="showModal" width="70%">
    <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
      <el-form-item label="休假申请" prop="applyType" required>
        <el-select v-model="leaveForm.applyType">
          <el-option :value="1" label="事假"></el-option>
          <el-option :value="2" label="调休"></el-option>
          <el-option :value="3" label="年假"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="休假时间" required>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="选择开始时间"
                @change="(val) => handleDateChange('startTime', val)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1">-</el-col>
          <el-col :span="7">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="选择结束时间"
                @change="(val) => handleDateChange('endTime', val)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="休假时长" prop="leaveTime" required>
        {{ leaveForm.leaveTime }}
      </el-form-item>
      <el-form-item label="休假原因" prop="reasons" required>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入休假原因"
          v-model="leaveForm.reasons"
        />
      </el-form-item>
    </el-form>
    <!-- 弹框按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 步骤弹窗 -->
  <el-dialog title="申请休假详情" v-model="showDetailModal" width="50%">
    <el-steps :active="detail.applyState > 2 ? 3 : detail.applyState" align-center>
      <el-step title="待审批"></el-step>
      <el-step title="审批中"></el-step>
      <el-step title="审批拒绝/通过"></el-step>
    </el-steps>
    <el-form label-width="120px" label-suffix=":">
      <el-form-item label="休假类型">
        <div>{{ detail.applyTypeName }}</div>
      </el-form-item>
      <el-form-item label="休假时间">
        <div>{{ detail.time }}</div>
      </el-form-item>
      <el-form-item label="休假时长">
        <div>{{ detail.leaveTime }}</div>
      </el-form-item>
      <el-form-item label="休假原因">
        <div>{{ detail.reasons }}</div>
      </el-form-item>
      <el-form-item label="审批状态">
        <div>{{ detail.applyStateName }}</div>
      </el-form-item>
      <el-form-item label="审批人">
        <div>{{ detail.curAuditUserName }}</div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, ref, reactive, onMounted } from "vue";
import util from "../utils/util";
export default {
  // setup语法糖---Composition API
  setup() {
    const { proxy } = getCurrentInstance();
    // 表格列数据
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        prop: "",
        width: 180,
        // formatter: (row, column, value) => {
        //   return (
        //     utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        //     "到" +
        //     utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
        //   )
        // },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        // formatter: (row, column, value) => {
        //   return utils.formateDate(new Date(row.createTime), "yyyy-MM-dd")
        // },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter(row, column, value) {
          // 1 待审批 2 审批中 3 审批拒绝 4 审批通过 5 作废、
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);
    const queryForm = reactive({
      applyState: "",
    });
    // 页码
    const pager = reactive({
      pageNum: 1,
      pageSize: 10, //每页10条
      total: 0, //总页数})
    });
    // 申请列表数据
    const applyList = ref([]);
    // 显示Dialog对话框
    const showModal = ref(false);
    const showDetailModal = ref(false);
    // create编辑/delete作废
    const action = ref("create");
    // 步骤条数据
    const detail = ref({});
    // 休假申请数据
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    const rules = reactive({
      applyType: [
        {
          required: true,
          trigger: "blur",
        },
      ],
      startTime: [
        {
          type: "date",
          required: true,
          message: "请选择开始时间",
          trigger: "change",
        },
      ],
      endTime: [
        {
          type: "date",
          required: true,
          message: "请选择结束时间",
          trigger: "change",
        },
      ],
      reasons: [
        {
          required: true,
          message: "请输入休假原因",
          trigger: ["blur", "change"],
        },
      ],
    });
    onMounted(() => {
      getApplyList();
    });
    // 初始化申请列表
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager };
      let { list, page } = await proxy.$api.getApplyList(params);
      applyList.value = list;
      pager.total = page.total;
    };
    // 顶部重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };
    // 点击申请休假
    const handleApply = () => {
      showModal.value = true;
      action.value = "create";
    };
    // 申请休假Dialog关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    // 申请休假提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const params = { ...leaveForm, action: action.value };
          const res = await proxy.$api.leaveOperate(params);
          handleClose();
          getApplyList();
          proxy.$message.success("申请成功！");
        }
      });
    };
    //  休假时长
    const handleDateChange = (time, val) => {
      const { startTime, endTime } = leaveForm;
      if (!startTime || !endTime) return;
      if (startTime > endTime) {
        proxy.$message.error("申假时间必须大于1天");
        leaveForm.leaveTime = "0天";
        setTimeout(() => {
          leaveForm[time] = "";
        }, 0);
      } else {
        leaveForm.leaveTime = (endTime - startTime) / 24 / 60 / 60 / 1000 + 1 + "天";
      }
    };
    // 查看休假申请
    const handleDetail = (row) => {
      let data = { ...row };
      data.applyTypeName = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[data.applyType];
      data.time =
        util.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
        " 至 " +
        util.formateDate(new Date(data.endTime), "yyyy-MM-dd");
      data.applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[data.applyState];
      detail.value = data;
      showDetailModal.value = true;
    };
    // 休假作废
    const handleDelete = async (_id) => {
      const params = { _id, action: "delete" };
      const res = await proxy.$api.leaveOperate(params);
      proxy.$message.success("删除成功！");
      getApplyList();
    };
    return {
      columns,
      pager,
      queryForm,
      applyList,
      showModal,
      leaveForm,
      action,
      rules,
      showDetailModal,
      detail,
      handleApply,
      handleReset,
      getApplyList,
      handleClose,
      handleSubmit,
      handleDateChange,
      handleDetail,
      handleDelete,
    };
  },
};
</script>

<style></style>
