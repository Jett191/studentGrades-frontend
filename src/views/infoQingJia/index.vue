<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="请假标题" prop="qingJiaTitle">
        <el-input
          v-model="queryParams.qingJiaTitle"
          placeholder="请输入请假标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['infoQingJia:infoQingJia:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['infoQingJia:infoQingJia:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['infoQingJia:infoQingJia:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['infoQingJia:infoQingJia:export']"
        >导出</el-button>
      </el-col>


      <el-col :span="1.5">

        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="!selectedRow || (selectedRow.processStatus !== 1 && selectedRow.processStatus !== 4)"
          @click="handleStartTask"
        >发起申请</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          size="mini"
          plain
          type="danger"
          icon="el-icon-delete"
          @click="handleRevokeProcess"
          :disabled="!selectedRow || selectedRow.processStatus !== 2"
        >撤销流程</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table @row-click="clickRow" ref="table"
              highlight-current-row
              v-loading="loading"
              :data="infoQingJiaList"
              @selection-change="handleSelectionChange">
      <el-table-column label="请假标题" align="center" prop="qingJiaTitle" />
      <el-table-column label="请假原因" align="center" prop="qingJiaReason" />
      <el-table-column label="请假天数" align="center" prop="qingJiaDay" />
      <el-table-column label="请假状态" align="center" prop="processStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.process_business_status" :value="scope.row.processStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.processStatus==1 || scope.row.processStatus==4"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.processStatus==1 || scope.row.processStatus==4"
          >删除</el-button>

<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleStartTask(scope.row)"-->
<!--            v-if="scope.row.processStatus==1 || scope.row.processStatus==4"-->
<!--          >发起申请</el-button>-->

<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleRevokeProcess(scope.row)"-->
<!--            v-if="scope.row.processStatus==2"-->
<!--          >撤销流程</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleJinDu(scope.row)"
            v-if="scope.row.processStatus !== 1"
          >查询进度</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="openHistoryDialog(scope.row)"
            v-if="scope.row.processStatus !== 1"
          >追踪过程</el-button>
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

    <!-- 添加或修改请假对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="请假标题" prop="qingJiaTitle">
          <el-input v-model="form.qingJiaTitle" placeholder="请输入请假标题" />
        </el-form-item>
        <el-form-item label="请假原因" prop="qingJiaReason">
          <el-input v-model="form.qingJiaReason" placeholder="请输入请假原因" />
        </el-form-item>
        <el-form-item label="请假天数" prop="qingJiaDay">
          <el-input v-model="form.qingJiaDay" placeholder="请输入请假天数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <JinDu ref="picture" />

    <!-- 追踪过程弹窗 -->
    <el-dialog
      :visible.sync="historyDialogVisible"
      width="50%">
          <span slot="title">
            <i class="el-icon-document-copy"></i> 追踪过程
          </span>
      <el-table
        :data="historyList"
        style="width: 100%"
        border>
        <el-table-column label="序号" align="center" type="index" :index="indexMethod" />
        <el-table-column align="center" prop="taskName" label="节点名称" width="180"></el-table-column>
        <el-table-column align="center" prop="endTime" label="执行时间">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.endTime || scope.row.startTime) }}</span>
          </template>

        </el-table-column>
        <el-table-column align="center"  prop="nickName" label="执行人" width="180"></el-table-column>
        <el-table-column align="center"  prop="comment" label="审核意见"></el-table-column>
      </el-table>

      <div slot="footer">
        <el-button type="primary" @click="historyDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {startTask, revokeProcess, selectHistory} from "@/api/activiti/task";

import JinDu from "../components/liuChengState/jindu";

import {
  listInfoQingJia,
  getInfoQingJia,
  delInfoQingJia,
  addInfoQingJia,
  updateInfoQingJia
} from "@/api/infoQingJia/infoQingJia.js";

export default {
  dicts: ["process_business_status"],
  name: "InfoQingJia",
  components: {
    JinDu
  },
  data() {
    return {
      selectedRow: null, // 保存当前选中的行
      //历史信息
      historyList: [],
      // 是否显示追踪过程弹窗
      historyDialogVisible: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 请假表格数据
      infoQingJiaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qingJiaTitle: null,
        qingJiaReason: null,
        qingJiaDay: null,
        userId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        qingJiaTitle: [
          { required: true, message: "请假标题不能为空", trigger: "blur" }
        ],
        qingJiaReason: [
          { required: true, message: "请假原因不能为空", trigger: "blur" }
        ],
        qingJiaDay: [
          { required: true, message: "请假天数不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    clickRow(row) {
      this.selectedRow = row; // 更新选中的行
      const table = this.$refs.table;
      const selectedRows = table.selection;

      // 如果点击的行已经被选中，则取消选中
      if (selectedRows.includes(row)) {
        table.toggleRowSelection(row);
      } else {
        // 否则取消之前选中的行，并选中当前点击的行
        selectedRows.forEach(selectedRow => {
          table.toggleRowSelection(selectedRow);
        });
        table.toggleRowSelection(row);
      }
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    openHistoryDialog(row) {
      // 根据行数据获取历史记录，这里使用您之前的方法获取历史记录的数据
      selectHistory({ processInstanceId: row.processInstanceId }).then(res => {
        this.historyList = res.data;
        this.historyDialogVisible = true; // 打开历史记录的对话框
      }).catch(error => {
        console.error('获取历史记录时出错:', error);
      });
    },
    /** 自定义编号 */
    indexMethod(index){
      let pageNum = this.queryParams.pageNum - 1;
      if((pageNum!==-1 && pageNum!==0)){
        return (index + 1) + (pageNum  * this.queryParams.pageSize);
      }else{
        return (index + 1)
      }
    },
    /** 查询请假列表 */
    getList() {
      this.loading = true;
      listInfoQingJia(this.queryParams).then(response => {
        this.infoQingJiaList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        qingJiaTitle: null,
        qingJiaReason: null,
        qingJiaDay: null,
        userId: null
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加请假";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row, 'asdads')
      this.reset();
      const id = row.id || this.ids;
      getInfoQingJia(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改请假";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfoQingJia(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfoQingJia(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除请假编号为"' + ids + '"的数据项？')
        .then(function() {
          return delInfoQingJia(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "infoQingJia/infoQingJia/export",
        {
          ...this.queryParams
        },
        `infoQingJia_${new Date().getTime()}.xlsx`
      );
    },
    //发起任务
    handleStartTask() {
      const row = this.selectedRow; // 获取当前选中的行
      if (!row) {
        this.$message.error("请先选择一行数据");
        return;
      }
      this.$confirm("是否确认发起申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          startTask({ businessKey: row.id, businessType: 1 }).then(res => {
            this.getList();
            this.$modal.msgSuccess("发起成功");
            this.selectedRow = null
          });
        })
        .catch(() => {});
    },
    //撤销流程
    handleRevokeProcess() {
      const row = this.selectedRow; // 获取当前选中的行
      if (!row) {
        this.$message.error("请先选择一行数据");
        return;
      }
      this.$confirm("是否确撤销申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            businessKey: row.id,
            businessType: 1,
            processInstanceId: row.processInstanceId
          };
          revokeProcess(params).then(res => {
            this.getList();
            this.$modal.msgSuccess("撤销成功");
            this.selectedRow = null
          });
        })
        .catch(() => {});
    },
    //查询进度
    handleJinDu(row) {
      this.$refs.picture.handleOpen(row);
    }
  }
};
</script>
