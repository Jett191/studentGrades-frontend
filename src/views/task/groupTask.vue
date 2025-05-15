<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item label="业务businessId" prop="businessKey">
        <el-input
          v-model="queryParams.businessKey"
          placeholder="请输入业务businessId"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="infoRunTaskDataList">
      <el-table-column label="业务标题" align="center" prop="businessTitle"/>
      <el-table-column label="业务类型" align="center" prop="businessType"/>
      <el-table-column label="任务节点" align="center" prop="taskName"/>
      <el-table-column label="申请人" align="center" prop="applyUser"/>
      <el-table-column label="发起申请时间" align="center" prop="applyTime"/>
      <el-table-column label="任务创建时间" align="center" prop="createTaskTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleTask(scope.row)"
          >拾取任务
          </el-button>
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

   

  </div>
</template>

<script>
import {selectGroupTask,claimTask} from "@/api/activiti/task.js";


export default {
  name: "GroupTask",
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
        pageSize: 10
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询正在运行任务的业务数据列表 */
    getList() {
      this.loading = true;
      selectGroupTask(this.queryParams).then(response => {
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
    },//办理任务
    handleTask(row) {
      //根据类型弹出不同的弹窗
      console.log(row, "====")
     claimTask(row.taskId).then(res=>{
          this.$message.success("拾取成功")
          this.getList()
     })
    }
  }
};
</script>
