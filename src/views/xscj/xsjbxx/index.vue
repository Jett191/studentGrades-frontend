<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="姓名" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别" prop="xb">
            <el-select v-model="queryParams.xb" placeholder="请选择性别" clearable>
              <el-option
                v-for="dict in dict.type.xb"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班级" prop="bj">
            <el-input
              v-model="queryParams.bj"
              placeholder="请输入班级"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="邮箱" prop="yx">
            <el-input
              v-model="queryParams.yx"
              placeholder="请输入邮箱"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学籍状态" prop="xjZt">
            <el-select v-model="queryParams.xjZt" placeholder="请选择学籍状态" clearable>
              <el-option
                v-for="dict in dict.type.xj_zt"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
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
          v-hasPermi="['xscj:xsjbxx:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['xscj:xsjbxx:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['xscj:xsjbxx:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xscj:xsjbxx:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['xscj:xsjbxx:import']"
        >导入
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="xsjbxxList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="姓名" align="center" prop="xm"/>
      <el-table-column label="学号" align="center" prop="xh"/>
      <el-table-column label="性别" align="center" prop="xb">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.xb" :value="scope.row.xb"/>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" prop="bj"/>
      <el-table-column label="邮箱" align="center" prop="yx"/>
      <el-table-column label="学籍状态" align="center" prop="xjZt">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.xj_zt" :value="scope.row.xjZt"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xscj:xsjbxx:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xscj:xsjbxx:remove']"
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

    <!-- 添加或修改学生基本信息对话框 -->
    <vxe-modal :title="title" v-model="open" width="500px" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="学号" prop="xh">
          <el-input v-model="form.xh" placeholder="请输入学号"/>
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <el-select v-model="form.xb" placeholder="请选择性别">
            <el-option
              v-for="dict in dict.type.xb"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="bj">
          <el-input v-model="form.bj" placeholder="请输入班级"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="yx">
          <el-input v-model="form.yx" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="学籍状态" prop="xjZt">
          <el-select v-model="form.xjZt" placeholder="请选择学籍状态">
            <el-option
              v-for="dict in dict.type.xj_zt"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import {addXsjbxx, delXsjbxx, getXsjbxx, listXsjbxx, updateXsjbxx} from "@/api/xscj/xsjbxx";
import {getToken} from "@/utils/auth";

export default {
  name: "Xsjbxx",
  dicts: ['xb', 'xj_zt'],
  data() {
    return {
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
      // 学生基本信息表格数据
      xsjbxxList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xm: null,
        xh: null,
        xb: null,
        bj: null,
        yx: null,
        xjZt: null,
        userId: null,
        deptId: null,
        ssUserId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        xm: [{required: true, message: "姓名不能为空", trigger: "blur"}],
        xh: [{required: true, message: "学号不能为空", trigger: "blur"},
          { pattern: /^\d{8}$/, message: "学号必须为8位数字", trigger: "blur" }],
        xb: [{required: true, message: "性别不能为空", trigger: "change"}],
        bj: [{required: true, message: "班级不能为空", trigger: "blur"}],
        yx: [{required: true, message: "邮箱不能为空", trigger: "blur"}],
        xjZt: [{required: true, message: "学籍状态不能为空", trigger: "change"}],
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
        url: process.env.VUE_APP_BASE_API + "/xscj/xsjbxx/importData"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    /** 查询学生基本信息列表 */
    getList() {
      this.loading = true;
      listXsjbxx(this.queryParams).then(response => {
        this.xsjbxxList = response.rows;
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
        xsjbxxId: null,
        xm: null,
        xh: null,
        xb: null,
        bj: null,
        yx: null,
        xjZt: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: null,
        deptId: null,
        ssUserId: null
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
      this.ids = selection.map(item => item.xsjbxxId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const xsjbxxId = row.xsjbxxId || this.ids
      getXsjbxx(xsjbxxId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生基本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          if (this.form.createBy != null) {
            updateXsjbxx(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXsjbxx(this.form).then(response => {
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
      const xsjbxxIds = row.xsjbxxId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delXsjbxx(xsjbxxIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xscj/xsjbxx/export', {
        ...this.queryParams
      }, `xsjbxx_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('xscj/xsjbxx/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "学生基本信息导入";
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
