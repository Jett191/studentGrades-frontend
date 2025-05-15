<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="厂家名称" prop="cjName">
            <el-input
              v-model="queryParams.cjName"
              placeholder="请输入厂家名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话" prop="dh">
            <el-input
              v-model="queryParams.dh"
              placeholder="请输入电话"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字" prop="gjz">
            <el-input
              v-model="queryParams.gjz"
              placeholder="请输入关键字"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="zt">
            <el-select v-model="queryParams.zt" placeholder="请选择状态" clearable>
              <el-option
                v-for="dict in dict.type.ks_zt"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="daterangeCreateTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ylxt:sccj:add']"
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
          v-hasPermi="['ylxt:sccj:edit']"
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
          v-hasPermi="['ylxt:sccj:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ylxt:sccj:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['ylxt:sccj:import']"
        >导入
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="sccjList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="厂家名称" align="center" prop="cjName"/>
      <el-table-column label="厂家编码" align="center" prop="cjBm"/>
      <el-table-column label="联系人" align="center" prop="lxr"/>
      <el-table-column label="电话" align="center" prop="dh"/>
      <el-table-column label="关键字" align="center" prop="gjz"/>
      <el-table-column label="地址" align="center" prop="dz"/>
      <el-table-column label="状态" align="center" prop="zt">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.ks_zt" :value="scope.row.zt"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ylxt:sccj:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ylxt:sccj:remove']"
          >删除
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

    <!-- 添加或修改生产厂家对话框 -->
    <vxe-modal :title="title" v-model="open" width="500px" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="厂家名称" prop="cjName">
          <el-input v-model="form.cjName" placeholder="请输入厂家名称"/>
        </el-form-item>
        <el-form-item label="厂家编码" prop="cjBm">
          <el-input v-model="form.cjBm" placeholder="请输入厂家编码"/>
        </el-form-item>
        <el-form-item label="联系人" prop="lxr">
          <el-input v-model="form.lxr" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="电话" prop="dh">
          <el-input v-model="form.dh" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="关键字" prop="gjz">
          <el-input v-model="form.gjz" placeholder="请输入关键字"/>
        </el-form-item>
        <el-form-item label="地址" prop="dz">
          <el-input v-model="form.dz" placeholder="请输入地址"/>
        </el-form-item>
        <el-form-item label="状态" prop="zt">
          <el-radio-group v-model="form.zt">
            <el-radio
              v-for="dict in dict.type.ks_zt"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
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
import {addSccj, delSccj, getSccj, listSccj, updateSccj} from "@/api/ylxt/sccj";
import {getToken} from "@/utils/auth";

export default {
  name: "Sccj",
  dicts: ['ks_zt'],
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
      // 生产厂家表格数据
      sccjList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门ID时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sccjId: null,
        cjName: null,
        dh: null,
        gjz: null,
        zt: null,
        idWhere: null,
        createTime: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cjName: [
          {required: true, message: "厂家名称不能为空", trigger: "blur"}
        ],
        dh: [
          {required: true, message: "电话不能为空", trigger: "blur"}
        ],
        gjz: [
          {required: true, message: "关键字不能为空", trigger: "blur"}
        ],
        dz: [
          {required: true, message: "地址不能为空", trigger: "blur"}
        ],
        zt: [
          {required: true, message: "状态不能为空", trigger: "change"}
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
        url: process.env.VUE_APP_BASE_API + "/ylxt/sccj/importData"
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
    /** 查询生产厂家列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listSccj(this.queryParams).then(response => {
        this.sccjList = response.rows;
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
        sccjId: null,
        cjName: null,
        cjBm: null,
        lxr: null,
        dh: null,
        gjz: null,
        dz: null,
        zt: '正常',
        idWhere: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: null,
        deptId: null
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
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sccjId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加生产厂家";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sccjId = row.sccjId || this.ids
      getSccj(sccjId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改生产厂家";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          if (this.form.sccjId != null) {
            updateSccj(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSccj(this.form).then(response => {
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
      const sccjIds = row.sccjId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delSccj(sccjIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ylxt/sccj/export', {
        ...this.queryParams
      }, `sccj_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('ylxt/sccj/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "生产厂家导入";
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
