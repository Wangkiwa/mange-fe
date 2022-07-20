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
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('userListform')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="base-table">
    <div class="action"></div>
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
            审核
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

  <!-- 步骤弹窗 -->
  <el-dialog title="审核" v-model="showDetailModal" width="50%">
    <el-form
      ref="dialogForm"
      :model="auditForm"
      label-width="120px"
      label-suffix=":"
      :rules="rules"
    >
      <el-form-item label="申请人">
        <div>{{ detail.applyUser.userName }}</div>
      </el-form-item>
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
      <el-form-item label="备注信息" prop="remark">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入审核备注"
          v-model="auditForm.remark"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleApprove('pass')"> 审核通过 </el-button>
        <el-button @click="handleApprove('refuse')">驳回</el-button>
      </span>
    </template>
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
        label: "申请人",
        prop: "applyUser",
        formatter(row) {
          return row.applyUser.userName;
        },
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
      applyState: 1,
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
    const showDetailModal = ref(false);
    // 详情弹框
    const detail = ref({});
    const userInfo = proxy.$store.state.userInfo;
    // 休假申请数据
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    const auditForm = reactive({
      remark: "",
    });
    const rules = reactive({
      remark: [
        {
          required: true,
          message: "请输入审核备注",
          trigger: ["blur", "change"],
        },
      ],
    });
    onMounted(() => {
      getApplyList();
    });
    // 初始化申请列表
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager, type: "approve" };
      let { list, page } = await proxy.$api.getApplyList(params);
      applyList.value = list;
      pager.total = page.total;
    };
    // 顶部重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
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
    const handleClose = () => {
      showDetailModal.value = false;
      handleReset("dialogForm");
    };
    // 审核通过/驳回
    const handleApprove = (action) => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = {
            action,
            remark: auditForm.remark,
            _id: detail.value._id,
          };
          let res = await proxy.$api.leaveApprove(params);
          handleClose();
          proxy.$message.success("处理成功");
          proxy.$store.commit("saveNoticeCount", proxy.$store.state.noticeCount - 1);
          getApplyList();
        }
      });
    };
    return {
      columns,
      pager,
      queryForm,
      applyList,
      leaveForm,
      rules,
      showDetailModal,
      detail,
      userInfo,
      auditForm,
      handleReset,
      handleClose,
      getApplyList,
      handleDetail,
      handleApprove,
    };
  },
};
</script>

<style></style>
