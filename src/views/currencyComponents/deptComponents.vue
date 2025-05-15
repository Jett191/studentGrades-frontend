<template>
  <el-table
    @row-click="clickRow" ref="table"
    highlight-current-row
    :border="false"
    style="min-height: 60vh"
    v-loading="loading"
    :data="deptList"
    row-key="deptId"
    :default-expand-all="isExpandAll"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
  >
    <el-table-column prop="deptName" label="部门名称"></el-table-column>
  </el-table>
</template>

<script>
import {listDept} from "@/api/system/dept";

export default {
  name: "deptComponents",
  data(){
    return{
      selectedRow: null, // 保存当前选中的行
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 是否展开，默认全部展开
      isExpandAll: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clickRow(row) {
      this.selectedRow = row; // 更新选中的行
      console.log(this.selectedRow.deptName, 'dasddasad')
      const table = this.$refs.table;
      const selectedRows = table.selection;

        // 否则取消之前选中的行，并选中当前点击的行
        selectedRows.forEach(selectedRow => {
          table.toggleRowSelection(selectedRow);
        });
        table.toggleRowSelection(row);
    },
    // 查询部门列表
    getList() {
      this.loading = true;
      listDept().then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },

  }
}
</script>

<style scoped>

</style>
