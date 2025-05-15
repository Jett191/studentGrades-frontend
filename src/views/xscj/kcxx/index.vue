<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
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
          <el-form-item label="课程代码" prop="kcDm">
            <el-input
              v-model="queryParams.kcDm"
              placeholder="请输入课程代码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学分" prop="xf">
            <el-input
              v-model="queryParams.xf"
              placeholder="请输入学分"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="课程类型" prop="kcLx">
            <el-select v-model="queryParams.kcLx" placeholder="请选择课程类型" clearable>
              <el-option
                v-for="dict in dict.type.kc_lx"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
          v-hasPermi="['xscj:kcxx:add']"
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
          v-hasPermi="['xscj:kcxx:edit']"
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
          v-hasPermi="['xscj:kcxx:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['xscj:kcxx:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['xscj:kcxx:import']"
        >导入
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="kcxxList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="课程名称" align="center" prop="kcName"/>
      <el-table-column label="课程代码" align="center" prop="kcDm"/>
      <el-table-column label="学分" align="center" prop="xf"/>
      <el-table-column label="课程类型" align="center" prop="kcLx">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.kc_lx" :value="scope.row.kcLx"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['xscj:kcxx:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['xscj:kcxx:remove']"
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

    <!-- 添加或修改课程信息对话框 -->
    <vxe-modal :title="title" v-model="open" width="55%" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="课程名称" prop="kcName">
              <el-input v-model="form.kcName" placeholder="请输入课程名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程代码" prop="kcDm">
              <el-input v-model="form.kcDm" placeholder="请输入课程代码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="学分" prop="xf">
              <el-input-number style="width: 100%;" v-model="form.xf" placeholder="请输入学分"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="kcLx">
              <el-select v-model="form.kcLx" placeholder="请选择课程类型">
                <el-option
                  v-for="dict in dict.type.kc_lx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">课程附件信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <!-- 上传按钮 -->
            <el-button size="mini" icon="el-icon-upload" type="primary" @click="kcxxFileUpload">上传</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteKcxxFj">删除</el-button>
          </el-col>
        </el-row>
        <el-table :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
                  :data="kcxxFjList" :row-class-name="rowKcxxFjIndex" @selection-change="handleKcxxFjSelectionChange"
                  ref="kcxxFj" height="30vh">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="文件名称" align="center" prop="fileName" :formatter="getFileNames"/>
          <el-table-column label="文件大小" align="center" prop="fileSize"/>
          <el-table-column width="120" align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDownload(scope.row)"
              >下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </vxe-modal>

    <!-- 课程信息附件上传弹窗 -->
    <vxe-modal title="附件上传" v-model="fjUpload" width="25%" showFooter show-zoom resize @close="fjClose">
      <el-upload
        align="center"
        class="upload-demo"
        multiple
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :limit="20"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :headers="headers"
        ref="fileUpload"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          请上传
          <template> 大小不超过 <b style="color: #f56c6c">{{ 50 }}MB</b></template>
          <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
          的文件
        </div>
      </el-upload>

      <div slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
        <el-button v-if="allFilesUploaded === false" size="mini" type="primary" @click="fjUpload = false">关 闭
        </el-button>
        <el-button v-if="allFilesUploaded === true" size="mini" type="primary" @click="fjClose">上传完成, 关闭
        </el-button>
      </div>

    </vxe-modal>
  </div>
</template>

<script>
import {
  addKcxx, deleteKcxxFjByFjs,
  delKcxx,
  getKcxx,
  getKcXxId,
  insertKcxxFjByKcxxId,
  listKcxx,
  selectKcxxFjList,
  updateKcxx
} from "@/api/xscj/kcxx";
import {getToken} from "@/utils/auth";

export default {
  name: "Kcxx",
  dicts: ['kc_lx'],
  data() {
    return {
      xg: false, //判断是新增还是修改 (false新增 true修改)
      allFilesUploaded: false, // 添加这个来追踪所有文件是否上传完成
      fjUpload: false, //附件上传弹窗
      //要修改的 课程信息id
      kcxxIdEdit: "",
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传文件服务器地址
      fileList: [],
      headers: {Authorization: "Bearer " + getToken()},
      number: 0,
      uploadList: [],
      fileType: ["doc", "xls", "ppt", "txt", "pdf", "docx", "zip"],
      selectedRow: null, // 保存当前选中的行
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedKcxxFj: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 课程信息表格数据
      kcxxList: [],
      // 课程附件表格数据
      kcxxFjList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        kcName: null,
        kcDm: null,
        xf: null,
        kcLx: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        kcName: [{required: true, message: "课程名称不能为空", trigger: "blur"}],
        kcDm: [{required: true, message: "课程代码不能为空", trigger: "blur"}],
        xf: [{required: true, message: "学分不能为空", trigger: "blur"}],
        kcLx: [{required: true, message: "课程类型不能为空", trigger: "change"}],
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
        url: process.env.VUE_APP_BASE_API + "/xscj/kcxx/importData"
      },
      getKcXxId: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 文件下载处理
    handleDownload(row) {
      const resource = row.fileName;
      // 默认方法
      this.$download.resource(resource);
    },
    // 获取文件名原名
    getFileNames(row) {
      // 从路径中提取文件名
      return row.fileName.split('/').pop(); // 返回文件名部分
    },
    //关闭上传附件弹窗后
    fjClose() {
      this.fileList = []
      this.allFilesUploaded = false
      this.fjUpload = false
    },
    //上传文件之前的钩子
    handleBeforeUpload(file){
      let that = this;
      // 校检文件类型
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
        // 校检文件大小
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.$modal.loading("正在上传文件，请稍候...");
        this.number++;
        return true;
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs !== '' ? strs.substr(0, strs.length - 1) : '';
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading();
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功
    handleUploadSuccess(res, file) {
      let that = this;
      if (res.code === 200) {
        this.uploadList.push({name: res.fileName, url: res.fileName, size: that.formatFileSize(file.size)});
        let xzItemFile = {
          "kcxxId": that.getKcXxId,
          "fileName": res.fileName,
          "fileSize": that.formatFileSize(file.size)
        };
        let xgItemFile = {
          "kcxxId": that.kcxxIdEdit,
          "fileName": res.fileName,
          "fileSize": that.formatFileSize(file.size)
        };
        if (this.xg === false) {
          // 点击新增按钮的上传
          insertKcxxFjByKcxxId(xzItemFile).then(resFil => {
            that.getKcxxFjList();
          })
        } else if (this.xg === true){
          // 点击修改按钮的上传
          insertKcxxFjByKcxxId(xgItemFile).then(resFil => {
            that.getKcxxFjList();
          })
        }
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
      this.allFilesUploaded = true
      this.$modal.msgSuccess("上传成功")
      // this.fjShangChuan = false
    },
    getKcxxFjList() {
      let that = this;
      if (this.xg === false) {
        //点击新增 上传文件后的文件列表
        selectKcxxFjList(that.getKcXxId).then(resFileList => {
          that.kcxxFjList = resFileList.data;
        })
      } else {
        //点击修改 上传文件后的文件列表
        selectKcxxFjList(that.kcxxIdEdit).then(resFileList => {
          that.kcxxFjList = resFileList.data;
        })
      }
    },
    // 显示文件大小为KB, MB, GB, TB
    formatFileSize(size) {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return name;
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.fileList = this.fileList.map(item => {
          // 使用split方法去除name中的特定前缀
          item.name = item.name.split('/').pop();
          return item;
        });
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    //课程信息附件上传按钮
    kcxxFileUpload() {
      this.fjUpload = true;
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
    /** 查询课程信息列表 */
    getList() {
      this.loading = true;
      listKcxx(this.queryParams).then(response => {
        this.kcxxList = response.rows;
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
        kcxxId: this.getKcXxId,
        kcName: null,
        kcDm: null,
        xf: null,
        kcLx: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: null,
        deptId: null
      };
      this.kcxxFjList = [];
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
      let ids = selection.map(item => item.kcxxId)
      if (ids.length === 1) {
        this.ids = ids[0]
      }else {
        this.ids = ids
      }
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.xg = false
      getKcXxId().then(res => {
        this.getKcXxId = res.msg
        this.reset();
      })
      this.open = true;
      this.title = "添加课程信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      this.xg = true
      const kcxxId = row.kcxxId || this.ids
      this.kcxxIdEdit = row.kcxxId || this.ids
      getKcxx(kcxxId).then(response => {
        this.form = response.data;
        this.kcxxFjList = response.data.kcxxFjList;
        this.open = true;
        this.title = "修改课程信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          this.form.kcxxFjList = this.kcxxFjList;
          if (this.form.createBy != null) {
            updateKcxx(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.xg = false
            });
          } else {
            addKcxx(this.form).then(response => {
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
      const kcxxIds = row.kcxxId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delKcxx(kcxxIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 课程附件序号 */
    rowKcxxFjIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 课程附件删除按钮操作 */
    handleDeleteKcxxFj() {
      if (this.checkedKcxxFj.length == 0) {
        this.$modal.msgError("请先选择要删除的课程附件数据");
      } else {
        const fjs = this.checkedKcxxFj;
        this.$modal.confirm('确定删除选中记录？').then(function() {
          return deleteKcxxFjByFjs(fjs);
        }).then(() => {
          if (this.xg == false) {
            selectKcxxFjList(this.getKcXxId).then(resFileList => {
              this.kcxxFjList = resFileList.data;
            })
          } else {
            getKcxx(this.kcxxIdEdit).then(response => {
              this.kcxxFjList = response.data.kcxxFjList;
            });
          }
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    },
    /** 复选框选中数据 */
    handleKcxxFjSelectionChange(selection) {
      this.checkedKcxxFj = selection.map(item => item.fj)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('xscj/kcxx/export', {
        ...this.queryParams
      }, `kcxx_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('xscj/kcxx/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "课程信息导入";
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
