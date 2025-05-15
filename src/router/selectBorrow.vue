<template>
  <!-- 导入表 -->
  <el-dialog title="选择原件/印章名称" :visible.sync="visible" width="850px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" label-width="100px" size="small">
      <el-row :gutter="2">
        <el-col :span="8">
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
        <el-col :span="8">
          <el-form-item label="原件/印章类型" prop="boType">
            <el-select v-model="queryParams.boType" filterable clearable style="width: 100%" placeholder="请选择原件/印章类型" size="small" >
              <el-option v-for="dict in boTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue"></el-option>
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
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="原件/印章名称" prop="boName" />
        <el-table-column label="原件/印章类型" prop="boType" :formatter="boTypeFormat" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listBorrow } from "@/api/credit/originalBorrow";
export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      ids: [],
      boNames:[],
      // 总条数
      total: 0,
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boName: undefined,
        boType: undefined,
        boStatus: '1',
      },
      boTypeOptions: [
        {dictValue:'1',dictLabel:'人员资质原件'},
        {dictValue:'2',dictLabel:'单位资质原件'},
        {dictValue:'3',dictLabel:'企业业绩原件'},
        {dictValue:'4',dictLabel:'一级建造师执业印章'},
        {dictValue:'5',dictLabel:'其他执业印章'},
      ],
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.boNames = selection.map(item => item.boName);
    },
    // 查询表数据
    getList() {
      listBorrow(this.queryParams).then(res => {
        if (res.code === 200) {
          this.dbTableList = res.rows;
          this.total = res.total;
        }
      });
    },
    boTypeFormat(row) {
      let diclabe = this.selectDictLabel(this.boTypeOptions, row.boType)
      return diclabe;
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
    /** 导入按钮操作 */
    handleSubmit() {
      this.visible = false;
      this.resetQuery();
      if(this.ids.length > 0){
        this.$emit('submitChecked',{'ids':this.ids.join(","),'boNames':this.boNames.join(",")} );
        this.ids = [];
      }
    }
  }
};
</script>
