<template>
  <div>
    <!-- 添加一个包裹层，用于控制最大宽度 -->
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="headerCellStyle">
        <el-table-column prop="year" label="年度"></el-table-column>
        <el-table-column prop="projectCount" label="研发项目数"></el-table-column>
        <el-table-column prop="inventionPatent" label="发明专利授权"></el-table-column>
        <el-table-column prop="utilityPatent" label="实用专利授权"></el-table-column>
        <el-table-column prop="softwareCopyright" label="软件著作权"></el-table-column>
        <el-table-column prop="provincialAward" label="省部科技奖"></el-table-column>
        <el-table-column prop="investment" label="研发投入（万元）" :min-width="130"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { year: '2025', projectCount: 16, inventionPatent: 0, utilityPatent: 2, softwareCopyright: 0, provincialAward: 0, investment: 0 },
        { year: '2026', projectCount: 0, inventionPatent: 0, utilityPatent: 0, softwareCopyright: 0, provincialAward: 0, investment: 0 },
        { year: '2027', projectCount: 0, inventionPatent: 0, utilityPatent: 0, softwareCopyright: 0, provincialAward: 0, investment: 0 },
        { year: '合计', projectCount: 16, inventionPatent: 0, utilityPatent: 2, softwareCopyright: 0, provincialAward: 0, investment: 0 }
      ]
    };
  },
  methods: {
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      return 'background-color: #d9ecff; color: #000;'
    }
  }
};
</script>

<style scoped>
.table-container {
  /* 确保表格不会超出容器宽度 */
  overflow-x: hidden;
  width: 100%;
}
/* 如果需要更具体的样式控制，可以在全局样式中添加 */
</style>
