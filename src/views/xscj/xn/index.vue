<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="开始年份" prop="ksNf">
            <el-date-picker clearable
                            v-model="queryParams.ksNf"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始年份">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束年份" prop="jsNf">
            <el-date-picker clearable
                            v-model="queryParams.jsNf"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束年份">
            </el-date-picker>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['xscj:xn:add']"
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
          v-hasPermi="['xscj:xn:edit']"
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
          v-hasPermi="['xscj:xn:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xscj:xn:export']"
        >导出
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          icon="el-icon-upload2"-->
      <!--          size="mini"-->
      <!--          @click="handleImport"-->
      <!--          v-hasPermi="['xscj:xn:import']"-->
      <!--        >导入</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableOne" v-loading="loading" :data="xnList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="开始年份" align="center" prop="ksNf" width="180"/>
      <el-table-column label="结束年份" align="center" prop="jsNf" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xscj:xn:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xscj:xn:remove']"
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

    <!-- 添加或修改学年对话框 -->
    <vxe-modal :title="title" v-model="open" width="60%" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="开始年份" prop="ksNf">
              <el-date-picker clearable
                              v-model="form.ksNf"
                              type="year"
                              value-format="yyyy"
                              placeholder="请选择开始年份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束年份" prop="jsNf">
              <el-date-picker clearable
                              v-model="form.jsNf"
                              type="year"
                              value-format="yyyy"
                              placeholder="请选择结束年份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学期" prop="xq">
              <el-select v-model="form.xq" placeholder="请选择课程类型">
                <el-option
                  v-for="dict in dict.type.xq"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">课程信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddXnKc">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteXnKc">删除</el-button>
          </el-col>
        </el-row>
        <el-table height="30vh" :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
                  :data="xnKcList" :row-class-name="rowXnKcIndex" @selection-change="handleXnKcSelectionChange"
                  ref="xnKc">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="课程号" prop="kch">
            <template slot-scope="scope">
              <el-input v-model="scope.row.kch" placeholder="请输入课程号"/>
            </template>
          </el-table-column>
          <el-table-column label="课程名" prop="kcm">
            <template slot-scope="scope">
<!--              <el-input v-model="scope.row.kcm" placeholder="请输入课程名"/>-->
              <el-select filterable v-model="form.kcm" placeholder="请选择课程名" style="width: 100%">
                <el-option
                  v-for="item in kcList"
                  :key="item.kcxxId"
                  :label="item.kcName"
                  :value="item.kcName">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="课程学分" prop="kcXf">
            <template slot-scope="scope">
              <el-input v-model="scope.row.kcXf" placeholder="请输入课程学分"/>
            </template>
          </el-table-column>
          <el-table-column label="任课老师" prop="rkLs">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rkLs"/>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import {addXn, delXn, getXn, listXn, updateXn} from "@/api/xscj/xn";
import {getToken} from "@/utils/auth";
import {selectKcList} from "@/api/xscj/kcxx";

export default {
  name: "Xn",
  dicts: ['xq'],
  data() {
    return {
      kcList: [],
      selectedRow: null, // 保存当前选中的行
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedXnKc: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学年表格数据
      xnList: [],
      // 课程表格数据
      xnKcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ksNf: null,
        jsNf: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ksNf: [
          {required: true, message: "开始年份不能为空", trigger: "blur"}
        ],
        jsNf: [
          {required: true, message: "结束年份不能为空", trigger: "blur"}
        ]
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
        url: process.env.VUE_APP_BASE_API + "/xscj/xn/importData"
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
    /** 查询学年列表 */
    getList() {
      this.loading = true;
      listXn(this.queryParams).then(response => {
        this.xnList = response.rows;
        this.total = response.total;
        this.loading = false;

        selectKcList().then(res => {
          this.kcList = res.data
        })

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
        xnId: null,
        ksNf: null,
        jsNf: null,
        xq: null,
      };
      this.xnKcList = [];
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
      this.ids = selection.map(item => item.xnId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学年";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const xnId = row.xnId || this.ids
      getXn(xnId).then(response => {
        this.form = response.data;
        this.xnKcList = response.data.xnKcList;
        this.open = true;
        this.title = "修改学年";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          this.form.xnKcList = this.xnKcList;
          if (this.form.xnId != null) {
            updateXn(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXn(this.form).then(response => {
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
      const xnIds = row.xnId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delXn(xnIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 课程序号 */
    rowXnKcIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 课程添加按钮操作 */
    handleAddXnKc() {
      let obj = {};
      obj.kch = "";
      obj.kcm = "";
      obj.kcXf = "";
      obj.rkLs = "";
      this.xnKcList.push(obj);
    },
    /** 课程删除按钮操作 */
    handleDeleteXnKc() {
      if (this.checkedXnKc.length == 0) {
        this.$modal.msgError("请先选择要删除的课程数据");
      } else {
        const xnKcList = this.xnKcList;
        const checkedXnKc = this.checkedXnKc;
        this.xnKcList = xnKcList.filter(function (item) {
          return checkedXnKc.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleXnKcSelectionChange(selection) {
      this.checkedXnKc = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xscj/xn/export', {
        ...this.queryParams
      }, `xn_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('xscj/xn/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "学年导入";
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
