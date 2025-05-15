<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" v-show="showSearch" label-width="68px">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="药品名称" prop="ypName">
            <el-input
              v-model="queryParams.ypName"
              placeholder="请输入药品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="药品编码" prop="ypBm">
            <el-input
              v-model="queryParams.ypBm"
              placeholder="请输入药品编码"
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
          <el-form-item label="药品类型" prop="ypLx">
            <el-select v-model="queryParams.ypLx" placeholder="请选择药品类型" clearable>
              <el-option
                v-for="dict in dict.type.yp_lx"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="处方类型" prop="cfLx">
            <el-select v-model="queryParams.cfLx" placeholder="请选择处方类型" clearable>
              <el-option
                v-for="dict in dict.type.cf_lx"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="流程状态:" prop="processStatus">
            <el-select v-model="queryParams.processStatus" placeholder="请选择流程状态" clearable size="mini">
              <el-option
                v-for="dict in dict.type.process_business_status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ylxt:ypxx:add']"
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
          v-hasPermi="['ylxt:ypxx:edit']"
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
          v-hasPermi="['ylxt:ypxx:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ylxt:ypxx:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['ylxt:ypxx:import']"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="!selectedRow || (selectedRow.processStatus !== 1 && selectedRow.processStatus !== 4)"
          @click="handleStartTask"
        >发起申请
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-delete"
          @click="handleRevokeProcess"
          :disabled="!selectedRow || selectedRow.processStatus !== 2"
        >撤销流程
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table @row-click="clickRow" ref="table" highlight-current-row
              :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              height="300" class="fixedTableTwo" v-loading="loading" :data="ypxxList"
              @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index" :index="indexMethod"/>
      <el-table-column label="药品名称" align="center" prop="ypName"/>
      <el-table-column label="药品编码" align="center" prop="ypBm"/>
      <el-table-column label="关键字" align="center" prop="gjz"/>
      <el-table-column label="单位" align="center" prop="dw"/>
      <el-table-column label="换算量" align="center" prop="hsl"/>
      <el-table-column label="处方价格" align="center" prop="cfJg"/>
      <el-table-column label="库存量" align="center" prop="kcl"/>
      <el-table-column label="预警值" align="center" prop="yjz"/>
      <el-table-column label="状态" align="center" prop="zt">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.ks_zt" :value="scope.row.zt"/>
        </template>
      </el-table-column>
      <el-table-column label="药品类型" align="center" prop="ypLx">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.yp_lx" :value="scope.row.ypLx"/>
        </template>
      </el-table-column>
      <el-table-column label="处方类型" align="center" prop="cfLx">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.cf_lx" :value="scope.row.cfLx"/>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家" align="center" prop="scCj"/>
      <el-table-column label="状态" align="center" prop="processStatus" width="120">
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
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.processStatus==1 || scope.row.processStatus==4"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleJinDu(scope.row)"
            v-if="scope.row.processStatus !== 1"
          >查询进度
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

    <!-- 添加或修改药品信息对话框 -->
    <vxe-modal :title="title" v-model="open" width="50%" showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="药品名称" prop="ypName">
              <el-input v-model="form.ypName" placeholder="请输入药品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品编码" prop="ypBm">
              <el-input v-model="form.ypBm" placeholder="请输入药品编码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="关键字" prop="gjz">
              <el-input v-model="form.gjz" placeholder="请输入关键字"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="dw">
              <el-input v-model="form.dw" placeholder="请输入单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="换算量" prop="hsl">
              <el-input v-model="form.hsl" placeholder="请输入换算量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方价格" prop="cfJg">
              <el-input-number style="width: 100%;" v-model="form.cfJg" placeholder="请输入处方价格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="库存量" prop="kcl">
              <el-input v-model="form.kcl" placeholder="请输入库存量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警值" prop="yjz">
              <el-input-number style="width: 100%;" v-model="form.yjz" placeholder="请输入预警值"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品类型" prop="ypLx">
              <el-select v-model="form.ypLx" placeholder="请选择药品类型">
                <el-option
                  v-for="dict in dict.type.yp_lx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="处方类型" prop="cfLx">
              <el-select v-model="form.cfLx" placeholder="请选择处方类型">
                <el-option
                  v-for="dict in dict.type.cf_lx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="scCj">
              <!--              <el-input v-model="form.scCj" placeholder="请输入生产厂家"/>-->
              <el-select filterable v-model="form.scCj" placeholder="请选择生产厂家" style="width: 100%">
                <el-option
                  v-for="item in sccjList"
                  :key="item.sccjId"
                  :label="item.cjName"
                  :value="item.cjName">
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

    <!-- 查询进度 -->
    <Jindu ref="picture"/>
  </div>
</template>

<script>
import {addYpxx, delYpxx, getYpxx, listYpxx, updateYpxx} from "@/api/ylxt/ypxx";
import {getToken} from "@/utils/auth";
import {selectScCjList} from "@/api/ylxt/sccj";
import Jindu from "@/views/components/liuChengState/jindu.vue";
import {revokeProcess, startTask} from "@/api/activiti/task";

export default {
  name: "Ypxx",
  components: {Jindu},
  dicts: ['ks_zt', 'cf_lx', 'yp_lx', 'process_business_status'],
  data() {
    return {
      sccjList: [], //生产厂家列表
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
      // 药品信息表格数据
      ypxxList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ypName: null,
        ypBm: null,
        gjz: null,
        zt: null,
        ypLx: null,
        cfLx: null,
        idWhere: null,
        userId: null,
        deptId: null,
        processStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ypName: [
          {required: true, message: "药品名称不能为空", trigger: "blur"}
        ],
        gjz: [
          {required: true, message: "关键字不能为空", trigger: "blur"}
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
        url: process.env.VUE_APP_BASE_API + "/ylxt/ypxx/importData"
      }
    };
  },
  created() {
    this.getList();

  },
  methods: {
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
          this.$modal.loading("正在发起申请，请稍后...");
          startTask({businessKey: row.ypxxId, businessType: 15}).then(res => {
            this.getList();
            this.$modal.msgSuccess("发起成功");
            this.selectedRow = null
            // 关闭遮罩层
            this.$modal.closeLoading();
          });
        })
        .catch(() => {
        });
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
          this.$modal.loading("正在撤销申请，请稍后...");
          let params = {
            businessKey: row.ypxxId,
            businessType: 15,
            processInstanceId: row.processInstanceId
          };
          revokeProcess(params).then(res => {
            this.getList();
            this.$modal.msgSuccess("撤销成功");
            this.selectedRow = null
            // 关闭遮罩层
            this.$modal.closeLoading();
          });
        })
        .catch(() => {
        });
    },
    //查询进度
    handleJinDu(row) {
      this.$refs.picture.handleOpen(row);
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
    /** 查询药品信息列表 */
    getList() {
      this.loading = true;
      listYpxx(this.queryParams).then(response => {
        this.ypxxList = response.rows;
        this.total = response.total;
        this.loading = false;

        selectScCjList().then(res => {
          this.sccjList = res.data
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
        ypxxId: null,
        ypName: null,
        ypBm: null,
        gjz: null,
        dw: null,
        hsl: null,
        cfJg: null,
        kcl: null,
        yjz: null,
        zt: '正常',
        ypLx: null,
        cfLx: null,
        scCj: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ypxxId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加药品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ypxxId = row.ypxxId || this.ids
      getYpxx(ypxxId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改药品信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          if (this.form.ypxxId != null) {
            updateYpxx(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addYpxx(this.form).then(response => {
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
      const ypxxIds = row.ypxxId || this.ids;
      this.$modal.confirm('确定删除选中记录？').then(function () {
        return delYpxx(ypxxIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ylxt/ypxx/export', {
        ...this.queryParams
      }, `ypxx_${new Date().getTime()}.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('ylxt/ypxx/importTemplate', {}, `template_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "药品信息导入";
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
