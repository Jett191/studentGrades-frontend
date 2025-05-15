<template>
  <div class="app-container">
    <el-table :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              v-loading="loading" :data="cjTjList">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="排名" align="center" type="index"/>
      <el-table-column label="课程名称" align="center" prop="kcName"/>
      <el-table-column label="平均分" align="center" prop="pjf"/>
    </el-table>
  </div>
</template>

<script>
import {selectCjTjList} from "@/api/xscj/cjlr";

export default {
  name: "index",
  data() {
    return {
      loading: false,
      cjTjList: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      selectCjTjList().then(res => {
        this.cjTjList = res.data
        this.loading = false
      })
    },

  }
}
</script>

<style scoped>

</style>
