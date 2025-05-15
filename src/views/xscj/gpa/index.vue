<template>
  <div class="app-container">
    <el-table :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              v-loading="loading" :data="gpaList">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="学生" align="center" prop="xsName"/>
      <el-table-column label="gpa" align="center" prop="gpa"/>
    </el-table>
  </div>
</template>

<script>
import {selectGpaList} from "@/api/xscj/cjlr";

export default {
  name: "index",
  data() {
    return {
      gpaList: [],
      loading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      selectGpaList().then(res => {
        this.loading = true
        this.gpaList = res.data
        this.loading = false
      })
    },

  }
}
</script>

<style scoped>

</style>
