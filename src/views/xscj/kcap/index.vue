<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="课程名称" prop="kcName">
            <el-input
              v-model="queryParams.kcName"
              placeholder="请输入课程名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程地点" prop="kcDd">
            <el-select v-model="queryParams.kcDd" placeholder="请选择课程地点" clearable>
              <el-option
                v-for="dict in dict.type.skdd"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="授课教师" prop="skJs">
            <el-input
              v-model="queryParams.skJs"
              placeholder="请输入授课教师"
              clearable
              @keyup.enter.native="handleQuery"
            />
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
          v-hasPermi="['xscj:kcap:add']"
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
<!--          v-hasPermi="['xscj:kcap:edit']"-->
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
          v-hasPermi="['xscj:kcap:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xscj:kcap:export']"
        >导出
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-upload2"-->
<!--          size="mini"-->
<!--          @click="handleImport"-->
<!--          v-hasPermi="['xscj:kcap:import']"-->
<!--        >导入-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="kcapList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="课程名称" align="center" prop="kcName"/>
      <el-table-column label="课程开始时间" align="center" prop="kcQtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kcQtime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程结束时间" align="center" prop="kcZtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kcZtime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程地点" align="center" prop="kcDd">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.skdd" :value="scope.row.kcDd"/>
        </template>
      </el-table-column>
      <el-table-column label="授课教师" align="center" prop="skJs"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['xscj:kcap:edit']"-->
<!--          >修改-->
<!--          </el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xscj:kcap:remove']"
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

    <!-- 添加或修改课程安排对话框 -->
    <vxe-modal :title="title" v-model="open" width="45%" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="110px">
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
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程开始时间" prop="kcQtime">
              <el-date-picker clearable style="width: 100%;"
                              v-model="form.kcQtime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择课程开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程结束时间" prop="kcZtime">
              <el-date-picker clearable style="width: 100%;"
                              v-model="form.kcZtime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择课程结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程地点" prop="kcDd">
              <el-select v-model="form.kcDd" placeholder="请选择课程地点">
                <el-option
                  v-for="dict in dict.type.skdd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课教师" prop="skJs">
<!--              <el-input v-model="form.skJs" placeholder="请输入授课教师"/>-->
              <el-select filterable v-model="form.skJs" placeholder="请选择授课教师" style="width: 100%">
                <el-option
                  v-for="item in jsList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import {addKcap, delKcap, getKcap, listKcap, updateKcap} from "@/api/xscj/kcap";
import {getToken} from "@/utils/auth";
import {selectJsList, selectKcList} from "@/api/xscj/kcxx";

export default {
  name: "Kcap",
  dicts: ['skdd'],
  data() {
    return {
      jsList: [], //教师列表
      kcList: [], //课程列表
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
      // 课程安排表格数据
      kcapList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kcName: null,
        kcDd: null,
        skJs: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        kcName: [{required: true, message: "课程名称不能为空", trigger: "blur"}],
        kcQtime: [{required: true, message: "课程开始时间不能为空", trigger: "blur"}],
        kcZtime: [{required: true, message: "课程结束时间不能为空", trigger: "blur"}],
        kcDd: [{required: true, message: "课程地点不能为空", trigger: "change"}],
        skJs: [{required: true, message: "授课教师不能为空", trigger: "blur"}],
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
        url: process.env.VUE_APP_BASE_API + "/xscj/kcap/importData"
      }
    };
  },
  created() {
    this.getList();
    this.selectKcList()
    this.selectJsList()
  },
  methods: {
    selectKcList() {
      selectKcList().then(res => {
        this.kcList = res.data
      })
    },
    selectJsList() {
      selectJsList().then(res => {
        this.jsList = res.data
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
    /** 查询课程安排列表 */
    getList() {
      this.loading = true;
      listKcap(this.queryParams).then(response => {
        this.kcapList = response.rows;
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
        kcapId: null,
        kcName: null,
        kcQtime: null,
        kcZtime: null,
        kcDd: null,
        skJs: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.kcapId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加课程安排";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const kcapId = row.kcapId || this.ids
      getKcap(kcapId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程安排";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          if (this.form.kcapId != null) {
            updateKcap(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKcap(this.form).then(response => {
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
      const kcapIds = row.kcapId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delKcap(kcapIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xscj/kcap/export', {
        ...this.queryParams
      }, `kcap_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('xscj/kcap/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "课程安排导入";
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
