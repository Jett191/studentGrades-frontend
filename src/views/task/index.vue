<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
<!--      <el-form-item label="业务businessId" prop="businessKey">-->
<!--        <el-input-->
<!--          v-model="queryParams.businessKey"-->
<!--          placeholder="请输入业务businessId"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable>
          <el-option
            v-for="dict in dict.type.process_define_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="businessTitle">
        <el-input
          v-model="queryParams.businessTitle"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input
          v-model="queryParams.applyUser"
          placeholder="请输入申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="processStatus">
        <el-select v-model="queryParams.processStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.process_business_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="infoRunTaskDataList">
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column label="业务模块" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.process_define_type" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" align="center" prop="businessTitle" />
      <el-table-column label="当前任务节点" align="center" prop="taskName" />
      <el-table-column label="申请人" align="center" prop="applyUser" />
      <el-table-column label="发起申请时间" align="center" prop="applyTime" />
      <el-table-column label="任务创建时间" align="center" prop="createTaskTime" />
      <el-table-column label="状态" align="center" prop="processStatus">
        <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleJinDu(scope.row)"
            >
              <el-link type="primary">
                <dict-tag :options="dict.type.process_business_status" :value="scope.row.processStatus"/>
              </el-link>
            </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleTask(scope.row)">办理</el-button>
          <el-button size="mini" v-if="scope.row.businessType == 1" type="text" icon="el-icon-edit" @click="qingJiaBJ(scope.row)">编辑</el-button>
          <el-button size="mini" v-if="scope.row.businessType == 2" type="text" icon="el-icon-edit" @click="lxSbBJ(scope.row)">编辑</el-button>
          <el-button size="mini" v-if="scope.row.businessType == 3" type="text" icon="el-icon-edit" @click="kjRyBJ(scope.row)">编辑</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="guiHuanTask(scope.row)"
            v-if="scope.row.claimTime"
          >归还任务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 编辑请假 -->
    <QingJiaBJ ref="qingJiaBJ"/>

    <!-- 编辑科研立项 -->
    <LxSbBj ref="lxSbBj"></LxSbBj>

    <!-- 编辑科技人员 -->
    <KjRyBj ref="kjRyBj"></KjRyBj>

    <!-- 查看流程状态 -->
    <JinDu ref="picture"/>

    <!--  请假  -->
    <qing-jia-dialog ref="qingJiaDialog" @ok="getList"></qing-jia-dialog>

    <!--  药品申请  -->
    <YpxxSq ref="ypSq" @ok="getList"/>

  </div>
</template>

<script>
import { selectMyTask, unClaimTask } from "@/api/activiti/task.js";

import QingJiaDialog from "@/views/infoQingJia/components/qingJia.vue";
import JinDu from "@/views/components/liuChengState/jindu";
import QingJiaBJ from "@/views/task/bj/QingJiaBJ";
import YpxxSq from "@/views/ylxt/ypxx/components/YpxxSq.vue";
export default {
  name: "InfoRunTaskData",
  dicts: ['process_business_status', 'process_define_type'],
  components: {
    YpxxSq,
    QingJiaBJ,
    QingJiaDialog,
    JinDu
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 正在运行任务的业务数据表格数据
      infoRunTaskDataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessType: this.$route.query.businessType,
        businessTitle: null,
        applyUser: null,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查询进度
    handleJinDu(row) {
      this.$refs.picture.handleOpen(row);
    },
    /** 查询正在运行任务的业务数据列表 */
    getList() {
      this.loading = true;
      selectMyTask(this.queryParams).then(response => {
        this.infoRunTaskDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 编辑请假
    qingJiaBJ(row) {
      this.$refs.qingJiaBJ.handleOpen(row);
    },
    //办理任务
    handleTask(row) {
      //根据类型弹出不同的弹窗
      // console.log(row, "====");
      switch (row.businessType) {
        case '1': // 如果是请假类型
          this.$refs.qingJiaDialog.handleOpen(row); // 调用请假弹窗
          this.getList();
          break;
        case '15': // 如果是药品申请类型
          this.$refs.ypSq.handleOpen(row); // 调用药品申请弹窗
          this.getList();
          break;
        // 更多类型的处理...
        default:
          this.$message.error('未定义的类型');
      }
    },
    //归还任务
    guiHuanTask(row) {
      unClaimTask(row.taskId).then(res => {
        this.$message.success("归还成功");
        this.getList();
      });
    }
  }
};
</script>
