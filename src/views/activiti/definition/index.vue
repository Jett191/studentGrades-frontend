<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="75px">
      <el-form-item label="流程类型:" prop="processDefinitionType">
        <el-select filterable v-model="queryParams.processDefinitionType" placeholder="请选择流程类型" clearable size="mini">
          <el-option
            v-for="dict in dict.type.process_define_type"
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

    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-row :gutter="20" class="tableOperation">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="openTypeDialog"
          >在线绘制流程(new)</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="Modeler">
        <el-table-column label="流程类型" align="center" prop="processDefinitionType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.process_define_type" :value="scope.row.processDefinitionType"/>
        </template>
      </el-table-column>
        <el-table-column label="部署ID" align="center" prop="deploymentId" />
        <el-table-column label="定义ID" align="center" prop="processDefinitionId" />
        <el-table-column label="流程名称" align="center" prop="processDefinitionName" />
        <el-table-column label="版本" align="center" prop="processDefinitionVersion" />
        <el-table-column label="部署时间" align="center" prop="deployTime" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="280"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="OnlineModificationProcess(scope.row)"
              v-hasPermi="['activiti:modeler']"
            >查看</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['activiti:modeler']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <!--bpmnjs在线流程设计器-->
    <!--    <el-dialog-->
    <!--      :visible.sync="modelVisible"-->
    <!--      title="流程图"-->
    <!--      width="1680px"-->
    <!--      @close="modelCancel"-->
    <!--      append-to-body-->
    <!--    >-->
    <!--      <div style="position:relative;height: 100%;">-->
    <!--        <iframe-->
    <!--          id="iframe"-->
    <!--          :src="modelerUrl"-->
    <!--          frameborder="0"-->
    <!--          width="100%"-->
    <!--          height="720px"-->
    <!--          scrolling="auto"-->
    <!--        ></iframe>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
    <!-- 流程设计器的弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      :fullscreen="true"
      width="98%"
    >
      <vue-bpmn
        ref="sss"
        style="overflow: hidden; height: 100%"
        @processSave="processSave"
        product="activiti"
        :processId="processId"
        :initTemplate="initTemplate"
        @closeDialogGrandFather="closeDialogGrandFather()"
      ></vue-bpmn>
    </el-dialog>
    <!-- 选择类型对话框 -->
    <el-dialog
      title="请选择绘制类型"
      :visible.sync="typeDialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form ref="form" label-width="100px" :rules="rules" :model="form">
        <el-form-item label="流程类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择流程类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFor('add')">确 定</el-button>
        <el-button @click="typeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDefinition,
  delDefinition,
  suspendOrActiveApply,
  getDefineXml,
  getProcessCompanyInfo,
  uploadStreamAndDeployment2,
  getProcessVersion
} from "@/api/activiti/definition";
import { getToken } from "@/utils/auth";
import VueBpmn from "@/components/bpmn/VueBpmn";
import templateXml from "@/components/bpmn/data/template";
// import { noPageSelectDept } from "@/api/system/dept";
// import { addAreaTemplate } from "@/api/areaTemplate/areaTemplate";

export default {
  components: {
    VueBpmn
  }, dicts: ['process_define_type'],
  name: "ActIdGroup",
  data() {
    return {
      isShowFileTip: true, //是否展示文件为空的提示
      dialogVisible: false,
      modelerUrl: "",
      modelVisible: false,
      // 类型对话框
      typeDialogVisible: false,
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // VIEW表格数据
      Modeler: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      src: "",
      // 表单参数
      form: {},
      // 状态字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        rev: null,
        name: null,
        processDefinitionType: null,
        type: null
      },
      rules: {
        type: [
          { required: true, message: "请选择流程类型", trigger: "change" }
        ],
        companyId: [
          { required: true, message: "请选择合伙人", trigger: "change" }
        ]
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          "/processDefinition/uploadStreamAndDeployment"
      },
      processId: "",
      initTemplate: "",
      processCategoryDits: [], //流程类型字典集合
      companyList: [], //合伙人数据集合
      fileList: []
    };
  },

  created() {
    this.getList();
    this.getDicts("process_define_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("process_define_type").then(response => {
      this.processCategoryDits = response.data;
    });
    // this.getAllCommpanyList();
  },
  methods: {
    /**
     * 获取合伙人列表
     */
    getAllCommpanyList() {
      var query = {
        deptType: 2
      };
      noPageSelectDept(query).then(res => {
        this.companyList = res.data;
      });
    },
    /**
     * 流程类型字典转换
     */
    processCategoryFormatter(row) {
      return this.selectDictLabel(this.processCategoryDits, row.category);
    },
    closeDialogGrandFather() {
      this.dialogVisible = false;
      this.getList();
    },
    /** 查询Definition列表 */
    getList() {
      this.loading = true;
      listDefinition(this.queryParams).then(response => {
        this.Modeler = response.rows;
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

    suspendOrActiveApply(row) {
      var suspendOrActive = row.suspendState === "2" ? "激活" : "挂起";
      this.$confirm("确认要" + suspendOrActive + "流程定义吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          var data = { id: row.id, suspendState: row.suspendState };
          return suspendOrActiveApply(data);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("转换成功");
        })
        .catch(function() {});
    },
    handleImport() {
      //清空表单数据
      this.resetForm("form");
      // 清空文件列表
      this.$nextTick(function() {
        this.$refs.upload.clearFiles();
      });
      this.fileList = [];
      this.upload.title = "上传模型图";
      this.upload.open = true;
    },
    // 选择类型对话框
    typeDialog() {
      this.typeDialogVisible = true;
    },
    // 绘制流程对话框
    submitFor(operation) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (valid) {
            localStorage.setItem("flowbale_type_value", this.form.type);
            this.typeDialogVisible = false;
            // this.modelVisible = true;
            this.dialogVisible = true;
            localStorage.setItem(
              "VUE_APP_BASE_API",
              process.env.VUE_APP_BASE_API
            );
            this.modelerUrl = "/bpmnjs/index.html?type=addBpmn";
          } else {
            this.msgError("失败，请重新提交！");
            return false;
          }
        }
      });
    },
    OnlineModificationProcess(data) {
      console.log(data,"====")
      localStorage.setItem("flowbale_type_value", data.processDefinitionType);
      var query = {
        deploymentId: data.deploymentId,
        resourceName: data.resourceName
      };
       getDefineXml(query).then(res => {
          this.processId = data.key;
          this.initTemplate = res;
          this.dialogVisible = true;
        });
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.fileList.length == 0) {
            this.isShowFileTip = true;
            return;
          } else {
            // this.$refs.upload.submit();
            let param = new FormData();
            console.log(this.fileList, "this.fileList");
            this.fileList.forEach(file => {
              param.append("file", file.raw); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              param.append("type", this.form.type); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
              param.append("companyId", this.form.companyId); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
            });
            uploadStreamAndDeployment2(param).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.getList();
                this.upload.open = false;
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          }
        }
      });
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },

    onChange(file, fileList) {
      this.fileList = fileList;
      if (fileList.length != 0) {
        this.isShowFileTip = false;
      } else {
        this.isShowFileTip = true;
      }
    },
    handleRemove(file, fileList) {
      if (fileList.length != 0) {
        this.isShowFileTip = false;
      } else {
        this.isShowFileTip = true;
      }
      this.fileList = fileList;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delDefinition(row.deploymentId, row.processDefinitionType);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    modelCancel() {
      this.getList();
    },
    /* new start */
    processSave(data) {
      console.log(data, "---------");
    },
    // 类型对话框
    openTypeDialog() {
      this.resetForm("form");
      this.processId = "";
      this.initTemplate = "";
      this.processId = "process" + new Date().getTime();
      this.initTemplate = templateXml.initTemplate(this.processId);
      this.typeDialogVisible = true;
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (valid) {
            localStorage.setItem("type_value", this.form.type);
            this.typeDialogVisible = false;
            this.dialogVisible = true;
          } else {
            this.msgError("失败，请重新提交！");
            return false;
          }
        }
      });
    },
    //打开流程设计器
    openVueBpmn() {}
    /* new end */
  }
};
</script>
