<template>
  <div class="app-container">
    <fieldset class="search-fieldset" v-show="showSearch">
      <legend><span class="el-icon-search">查询条件</span></legend>
      <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="118px">

        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="原件/印章名称" prop="boName">
              <el-input
                v-model="queryParams.boName"
                placeholder="请输入原件/印章名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="借用人" prop="apPerson">
              <el-input
                v-model="queryParams.apPerson"
                placeholder="请输入借用人"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="借用单位" prop="apDept">
              <el-input
                v-model="queryParams.apDept"
                placeholder="请输入借用单位"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>


    <vxe-toolbar :print="{icon:''}" export :refresh="{query:getList}"
                 :custom="{'immediate':true,'isFooter':false}">
      <!-- 左侧按钮 -->
      <template #buttons>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd"
                   v-hasPermi="['credit:originalApply:add']">申请借用
        </el-button>
        <el-button v-if="switchVal" size="small" type="success" icon="el-icon-edit" :disabled="!submitEnabled"
                   @click="handleUpdate"
                   v-hasPermi="['credit:originalApply:edit']">修改
        </el-button>
        <el-button v-if="switchVal" size="small" type="danger" icon="el-icon-delete" :disabled="!deleteEnabled"
                   @click="handleDelete"
                   v-hasPermi="['credit:originalApply:remove']">删除
        </el-button>
        <!-- <el-button  size="small" type="success" icon="el-icon-success" :disabled="!submitEnabled" @click="handleFlowsByflwKey()">
          提交流程
        </el-button> -->
        <el-button size="small" type="warning" icon="el-icon-download" @click="handleExport"
                   v-hasPermi="['credit:originalApply:export']">导出
        </el-button>
      </template>
      <!-- 右侧按钮 -->
      <template #tools>
        <vxe-switch class="toolbar-switch" @change="onSwitchChange(switchVal)" v-model="switchVal" size="small"
                    :open-label="openLabel" :close-label="closeLabel"></vxe-switch>
        <vxe-button size="medium" icon="el-icon-picture" circle title="功能流程图" @click="openFlow"></vxe-button>
        <vxe-button size="medium" style="margin-right: 12px;" icon="el-icon-search" circle
                    @click="showSearch = !showSearch"></vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="vxeTable" :empty-render="{name: 'NoData'}"
      keep-source
      align="center"
      size="small"
      height="450"
      border
      resizable
      show-overflow
      highlight-hover-row
      :print-config="{}"
      :loading="loading"
      :data="applyList"
      :seq-config="{startIndex:(queryParams.pageNum-1)*queryParams.pageSize}"
      :row-config="{isCurrent: true, isHover: true}"
      :checkbox-config="{trigger: 'row', checkMethod: checkSelectable, highlight: true }"
      @checkbox-all="handleSelectionChange"
      @checkbox-change="handleSelectionChange">
      <vxe-column type="checkbox" width="50"></vxe-column>
      <vxe-column type="seq" width="50" title="序号" headerAlign="center"></vxe-column>
      <vxe-table-column sortable headerAlign="center" title="申请编号" align="center" field="apNumber"/>
      <vxe-table-column sortable headerAlign="center" title="原件/印章名称" align="center" field="boName"/>
      <vxe-table-column sortable headerAlign="center" title="借用人" align="center" field="apPerson"/>
      <vxe-table-column sortable headerAlign="center" title="借用单位" align="center" field="apDept"/>
      <vxe-table-column sortable headerAlign="center" title="预计归还时间" align="center" field="apReturnTime"/>
      <vxe-table-column sortable headerAlign="center" title="使用时间" align="center" field="apUseTime"/>
      <vxe-table-column sortable headerAlign="center" title="状态" align="center" field="apStatus"
                        :formatter="apStatusFormat"/>
      <vxe-table-column title="操作" align="center" width="180" class-name="">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row,true)">查看</el-button>
          <el-button v-if="scope.row.flwInstId" size="mini" type="text" @click="viewFlowImg(scope.row)">审批流程
          </el-button>
          <el-button v-if="switchVal && scope.row.flwStatus === '3'&&!scope.row.apStatus" size="mini" type="text"
                     @click="hanldeUpdateBoStatus(scope.row,'1')" v-hasPermi="['credit:originalApply:edit']">借出
          </el-button>
          <el-button v-if="switchVal && scope.row.apStatus==='1'" size="mini" type="text"
                     @click="hanldeUpdateBoStatus(scope.row,'2')" v-hasPermi="['credit:originalApply:edit']">归还
          </el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>


    <!-- 添加或修改原件印章借用申请对话框 -->
    <vxe-modal v-model="open" width="70%" min-width="700" height="65%" min-height="550" show-footer show-zoom
               size="small">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <template #default>
        <el-form ref="form" class="small-size-error" :model="form" :disabled="formDisabled" :rules="rules"
                 label-width="120px">
          <el-row :gutter="20">

            <el-col :span="12">
              <el-form-item label="申请编号" prop="apNumber">
                <el-input v-model="form.apNumber" placeholder="自动生成" disabled/>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12" >
              <el-form-item label="原件/印章名称" prop="boName" required>
                <el-input v-model="form.boName" placeholder="请选择原件/印章名称" @focus="openBorrowWin" />
              </el-form-item>
            </el-col> -->
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="原件/印章名称" prop="boName" required>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.boName"
                          placeholder="请选择原件/印章名称" @focus="openBorrowWin"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="借用单位" prop="apDept">
                <el-input v-model="form.apDept" placeholder="自动获取" disabled/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="借用人" prop="apPerson">
                <el-input v-model="form.apPerson" placeholder="自动获取" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="借用人手机" prop="apPhone" required>
                <el-input v-model="form.apPhone" placeholder="请输入借用人手机"/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用时间" prop="apUseTime" required>
                <el-date-picker clearable style="width: 100%"
                                v-model="form.apUseTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择使用时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预计归还时间" prop="apReturnTime" required>
                <el-date-picker clearable style="width: 100%"
                                v-model="form.apReturnTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择预计归还时间">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="借用事由" prop="apOrigin" required>
                <el-select v-model="form.apOrigin" placeholder="请选择借用事由" :disabled="formDisabled"
                           @change="apOriginChange" style="width: 100%" size="small">
                  <el-option v-for="dict in apOriginOptions" :key="dict.dictValue" :label="dict.dictLabel"
                             :value="dict.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="其他事由" prop="apOtherOrigin" :required="!required">
                <el-input v-model="form.apOtherOrigin" placeholder="请输入其他事由"/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目名称" prop="apProjectName" :required="required">
                <el-input :readonly="required" v-model="form.apProjectName" placeholder="请输入项目名称">
                  <el-button v-if="required" slot="append" icon="el-icon-search" @click="selectProject"></el-button>
                </el-input>
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>

      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if="!formDisabled">提 交</el-button>
          <el-button @click="cancel()">关 闭</el-button>
        </div>
      </template>
    </vxe-modal>
    <!-- 选择原件/印章名称 -->
    <selectBorrow ref="selectBorrow" @submitChecked="getBoNames"/>
    <!-- 流程提交 -->
    <flowSubmit ref="flowSubmit" @submittSuccess="submittSuccess" @submitError="submitError"/>
    <!-- 审批流程 -->
    <diaflowImg ref="diaflowImg"/>
    <diaviewImg ref="diaviewImg"/>
    <!-- 立项备案列表 -->
    <projectListWin ref="projectListWin" @selectProject="setProject"/>
    <!-- 投标评审列表 -->
    <biddingEvaluationWin1 ref="biddingEvaluationWin1" @selectProject="setProject"/>
  </div>
</template>

<script>
import {
  listApply,
  getApply,
  delApply,
  addApply,
  updateApply,
  exportApply,
  editBoStatus
} from "@/api/credit/originalApply";
import FileList from '@/components/FileList'
import selectBorrow from "./selectBorrow";
import {getFlwProcessConfigByEntity} from "@/api/flowable/definition";
import flowSubmit from '@/components/hkrflow/flowSubmit.vue'
import diaflowImg from "@/components/hkrflow/dialog-flowImg.vue";
import diaviewImg from "@/components/hkrflow/dialog-viewImg";
import projectListWin from "@/views/review/project/listWin.vue";
import biddingEvaluationWin1 from "@/views/bidding/biddingEvaluation/biddingEvaluationWin1.vue";

export default {
  name: "Apply",
  components: {
    FileList, selectBorrow, flowSubmit, diaflowImg, diaviewImg, projectListWin, biddingEvaluationWin1
  },
  data() {
    return {
      submitEnabled: false,
      deleteEnabled: false,
      fileType: ["doc", "xls", "ppt", "txt", "pdf", "png", "jpg"],
      //附件列表参数
      filedata: {groupid: 'originalApplyFile', relationid: ''},
      //修改或新增add、update
      etype: '',
      //是否必填
      required: true,

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //表单禁用
      formDisabled: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 原件印章借用申请表格数据
      applyList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //只看自己
      switchVal: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        dataScope: '5',
        userId: null,
        deptId: null,
        apNumber: null,
        boId: null,
        boName: null,
        apPerson: null,
        apPhone: null,
        apDept: null,
        apDeptId: null,
        apReturnTime: null,
        apUseTime: null,
        apOrigin: null,
        apOtherOrigin: null,
        apProjectId: null,
        apProjectName: null,
        apType: null,
        apStatus: null,
        flwInstId: null,
        flwStatus: null,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        boName: [{required: true, message: "原件/印章名称不能为空", trigger: "blur"}],
        apPhone: [{required: true, message: "借用人手机不能为空", trigger: "blur"}],
        apUseTime: [{required: true, message: "使用时间不能为空", trigger: "blur"}],
        apReturnTime: [{required: true, message: "预计归还时间不能为空", trigger: "blur"}],
        apOrigin: [{required: true, message: "借用事由不能为空", trigger: "blur"}],
        apOtherOrigin: [{required: false, message: "其他事由不能为空", trigger: "blur"}],
        apProjectName: [{required: true, message: "项目名称不能为空", trigger: "blur"}],
        file: [{required: false, message: "附件不能为空", trigger: "blur"}],
      },
      // 借用事由字典
      apOriginOptions: [
        {dictValue: '1', dictLabel: '报名时'},
        {dictValue: '2', dictLabel: '投标时'},
        {dictValue: '3', dictLabel: '其它时'},
      ],
      // 流程状态字典
      flwStatusOptions: [
        {dictValue: '1', dictLabel: '编辑'},
        {dictValue: '2', dictLabel: '审批中'},
        {dictValue: '3', dictLabel: '审批通过'},
        {dictValue: '4', dictLabel: '退回'},
      ],
    };
  },
  created() {

    this.getList();
  },
  watch: {},
  methods: {
    onSwitchChange(val) {
      this.queryParams.dataScope = val ? '5' : null
      this.handleQuery();
    },
    /** 查询原件印章借用申请列表 */
    getList() {
      this.loading = true;
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    apOriginChange(apOrigin, bool) {
      if (apOrigin == "3") {
        this.required = false
      } else {
        this.required = true
      }
      this.rules.apOtherOrigin[0].required = !this.required
      this.rules.apProjectName[0].required = this.required
      if (!bool) {
        this.form.apProjectId = ''
        this.form.apProjectName = ''
        this.form.apOtherOrigin = ''
        this.$nextTick(() => {
          this.$refs["form"].clearValidate()
        })
      }
    },

    openBorrowWin() {
      this.$refs.selectBorrow.show();
    },

    getBoNames(obj) {
      if (obj != '') {
        //获取选中行
        this.form.boId = obj.ids;
        this.form.boName = obj.boNames;
      }
    },
    apStatusFormat(e) {
      let ret = ""
      if (e.cellValue) {
        ret = e.cellValue == 1 ? "借出" : "归还";
      } else {
        ret = this.selectDictLabel(this.flwStatusOptions, e.row.flwStatus);
      }
      return ret || "编辑"
    },

    selectProject() {
      let value = this.form.apOrigin
      if (value == '1') {
        this.$refs.projectListWin.title = '请选择立项申请信息';
        this.$refs.projectListWin.queryParams.flwStatus = '3';
        this.$refs.projectListWin.openWin = true;
        this.$refs.projectListWin.getList();
      } else if (value == '2') {
        this.$refs.biddingEvaluationWin1.title = '请选择投标评审信息';
        this.$refs.biddingEvaluationWin1.queryParams.flwStatus = '3';
        this.$refs.biddingEvaluationWin1.openWin = true;
        this.$refs.biddingEvaluationWin1.getList();
      }

    },
    setProject(data) {
      this.form.apProjectId = data.id
      this.form.apProjectName = data.projectName
    },

    // 表单重置
    reset() {
      this.form = {
        file: null,
        id: null,
        userId: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        apNumber: null,
        boId: null,
        boName: null,
        apPerson: null,
        apPhone: null,
        apDept: null,
        apDeptId: null,
        apReturnTime: null,
        apUseTime: null,
        apOrigin: null,
        apOtherOrigin: null,
        apProjectId: null,
        apProjectName: null,
        apType: null,
        apStatus: null,
        flwInstId: null,
        flwStatus: null,
        remark: null
      };


      this.resetForm("form");
    },
    closedfunc() {
      this.reset();
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
    handleSelectionChange(e) {
      let selection = e.records;
      this.ids = selection.map(item => item.id)
      this.single = selection.length == 1
      this.multiple = selection.length > 1;

      this.deleteEnabled = false;
      this.submitEnabled = false;
      if (!this.switchVal) return;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].flwStatus != '1') {
          this.deleteEnabled = false;
          break;
        }
        this.deleteEnabled = true;
      }

      if (this.single) {
        this.submitEnabled = selection[0].flwStatus != '1' ? false : true;
      }
    },
    //返回附件列表
    loadSuccess(e) {
      var arr = [];
      for (var obj of e) {
        arr.push(obj.fileid);
      }
      this.form.file = arr.join(',');
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.formDisabled = false;
      this.etype = 'add';
      this.reset();
      this.open = true;
      this.title = "添加原件印章借用申请";
      this.filedata.relationid = '';
      this.handleGetkeyId().then(response => {
        this.form.apDeptId = this.$store.state.user.deptId
        this.form.apDept = this.$store.state.user.deptName
        this.form.apPerson = this.$store.state.user.nickName;
        this.form.id = response.data;
        this.form.flwStatus = '1';
        this.filedata.relationid = response.data;

      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, bool) {

      this.formDisabled = bool || false;
      this.etype = 'update';
      this.reset();
      this.filedata.relationid = '';
      const id = row.id || this.ids
      getApply(id).then(response => {
        let data = response.data;
        data.file = '';//附件必传校验字段
        this.form = data;
        this.apOriginChange(this.form.apOrigin, true)
        let title = "修改原件印章借用申请";
        if (bool) {
          title = "查看原件印章借用申请";
        }
        this.title = title;
        this.open = true;
        this.filedata.relationid = response.data.id;

      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delApply(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },

    hanldeUpdateBoStatus(row, type) {
      let typename = type == '1' ? "借出" : "归还";
      this.$confirm('确定要' + typename + '吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        row.apStatus = type
        return editBoStatus(row);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      })
    },

    //复选框禁用
    checkSelectable(e) {
      let row = e.row;
      //根据字段值判断是否禁用复选框
      return true;
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有原件印章借用申请数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportApply(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.handleFlowsByflwKey(this.form);
        }
      });
    },
    //流程提交弹出框
    handleFlowsByflwKey(row) {
      let params = {'busiEntity': 'com.hkr.service.domain.OriginalApply'}
      //1：市场部，2：二级企业:
      let apScbDept = this.$store.state.user.orgType;
      getFlwProcessConfigByEntity(params).then(res => {
        if (res.data) {
          var flwInfo = {
            procByKey: "P_1548155315181060096",
            businessKey: row.id,
            businessName: row.boName,
            apOrigin: row.apOrigin,
            apScbDept: apScbDept,
          };
          this.$refs.flowSubmit.flwInfo = flwInfo;
          this.$refs.flowSubmit.preSubmitFun = this.saveForm;
          this.$refs.flowSubmit.isOrnotShowThis(true);
        } else {
          this.submitError();
          this.$message({message: '功能未配置流程，请在管理流程定义功能进行配置！', type: 'warning'});
        }
      });
    },
    //流程参与者选择成功回调
    saveForm(callback) {
      addApply(this.form).then(response => {
        if (response.code == 200) {
          callback(true);
        } else {
          callback(false);
        }
      });
    },
    //流程提交成功回调
    submittSuccess() {
      this.msgSuccess("提交成功");
      this.open = false;
      this.getList();
    },
    //流程提交失败回调
    submitError() {
      delApply(this.form.id);
    },
    //审批流程
    viewFlowImg(row) {
      this.$refs.diaflowImg.flwInstId = row.flwInstId;
      this.$refs.diaflowImg.openActImg = true;
    },
    openFlow() {
      let prockeyId = 'P_1548155315181060096';
      let proTitle = '原件印章借用';
      this.$refs.diaviewImg.openActImg(prockeyId, proTitle);
    },
  }
};
</script>
