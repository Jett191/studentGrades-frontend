<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="学生姓名" prop="xsName">
            <el-input
              v-model="queryParams.xsName"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="课程名称" prop="kcName">
            <el-input
              v-model="queryParams.kcName"
              placeholder="请输入课程名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 顶部按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['xscj:cjlr:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['xscj:cjlr:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['xscj:cjlr:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xscj:cjlr:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['xscj:cjlr:import']"
        >导入
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="cjlrList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="学生姓名" align="center" prop="xsName"/>
      <el-table-column label="课程名称" align="center" prop="kcName">
      </el-table-column>
      <el-table-column label="课程成绩" align="center" prop="kcCj">
        <template slot-scope="scope">
          <span v-if="scope.row.kcCj < 60" style="color: red">{{ scope.row.kcCj }}</span>
          <span v-if="scope.row.kcCj >= 60">{{ scope.row.kcCj }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="xgCj(scope.row)"
            v-hasPermi="['xscj:cjlr:edit']"
          >修改成绩
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xscj:cjlr:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 导入对话框 -->
    <vxe-modal :title="upload.title" v-model="upload.open" width="400px" showFooter show-zoom resize>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </vxe-modal>

    <!-- 添加或修改成绩录入对话框 -->
    <vxe-modal :title="title" v-model="open" width="500px" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生姓名" prop="xsName">
          <!--          <el-input v-model="form.xsName" placeholder="请输入学生姓名"/>-->
          <el-select filterable v-model="form.xsName" placeholder="请选择学生姓名" style="width: 100%">
            <el-option
              v-for="item in xsList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="kcName">
          <!--          <el-input v-model="form.kcName" placeholder="请输入课程名称"/>-->
          <el-select filterable v-model="form.kcName" placeholder="请选择课程名称" style="width: 100%">
            <el-option
              v-for="item in kcList"
              :key="item.kcxxId"
              :label="item.kcName"
              :value="item.kcName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程成绩" prop="kcCj">
          <el-input-number style="width: 100%;" v-model="form.kcCj" placeholder="请输入课程成绩"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>

    <!-- 添加或修改成绩录入对话框 -->
    <vxe-modal :title="title" v-model="xgOpen" width="500px" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="修改后成绩" prop="xghCj">
          <el-input-number style="width: 100%;" v-model="form.xghCj" placeholder="请输入修改后成绩"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="xgCjTj">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import {addCjlr, delCjlr, getCjlr, listCjlr, updateCjlr, updateXgCj} from "@/api/xscj/cjlr";
import {getToken} from "@/utils/auth";
import {selectKcList, selectXsList} from "@/api/xscj/kcxx";

export default {
  name: "Cjlr",
  data() {
    return {
      xgOpen: false,
      xsList: [], //学生列表
      selectedRow: null, // 保存当前选中的行
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
      // 成绩录入表格数据
      cjlrList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xsName: null,
        kcName: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        xsName: [
          {required: true, message: "学生姓名不能为空", trigger: "blur"}
        ],
        kcName: [
          {required: true, message: "课程名称不能为空", trigger: "blur"}
        ],
        kcCj: [
          {required: true, message: "课程成绩不能为空", trigger: "blur"}
        ],
      },
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/xscj/cjlr/importData"
      },
      kcList: [],
    };
  },
  created() {
    this.getList();
    this.selectKcList();
  },
  methods: {
    selectKcList() {
      selectKcList().then(res => {
        this.kcList = res.data
      })
      selectXsList().then(res => {
        this.xsList = res.data
      })
    },
    //点击行 获取行
    clickRow(row) {
      this.selectedRow = row; // 更新选中的行
      const table = this.$refs.table;
      const selectedRows = table.selection;

      // 否则取消之前选中的行，并选中当前点击的行
      selectedRows.forEach(selectedRow => {
        table.toggleRowSelection(selectedRow);
      });
      table.toggleRowSelection(row);
    },
    /** 自定义序号 */
    indexMethod(index) {
      let pageNum = this.queryParams.pageNum - 1;
      if ((pageNum !== -1 && pageNum !== 0)) {
        return (index + 1) + (pageNum * this.queryParams.pageSize);
      } else {
        return (index + 1)
      }
    },
    /** 查询成绩录入列表 */
    getList() {
      this.loading = true;
      listCjlr(this.queryParams).then(response => {
        this.cjlrList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.xgOpen = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cjlrId: null,
        xsName: null,
        kcName: null,
        kcCj: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: null,
        deptId: null,
        xghCj: null,
      };
      this.resetForm("formDialog");
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
      this.ids = selection.map(item => item.cjlrId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加成绩录入";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cjlrId = row.cjlrId || this.ids
      getCjlr(cjlrId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改成绩录入";
      });
    },
    xgCj(row) {
      this.reset();
      const cjlrId = row.cjlrId || this.ids
      getCjlr(cjlrId).then(response => {
        this.form = response.data;
        this.xgOpen = true;
        this.title = "修改成绩";
      });
    },
    /** 修改成绩提交 */
    xgCjTj() {
      console.log(this.form, 'ascasdasdasd')
      updateXgCj(this.form).then(response => {
        // this.$modal.msgSuccess("修改成绩已提交, 需要在成绩修改审批页面审批!");
        this.$modal.alertSuccess("修改成绩已提交, 需要在成绩修改审批页面审批!");
        this.xgOpen = false
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          if (this.form.cjlrId != null) {
            updateCjlr(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCjlr(this.form).then(response => {
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
      const cjlrIds = row.cjlrId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delCjlr(cjlrIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xscj/cjlr/export', {
        ...this.queryParams
      }, `cjlr_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('xscj/cjlr/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "成绩录入导入";
      this.upload.open = true;
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
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
