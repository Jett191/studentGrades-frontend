<template>
  <div class="app-container">
    <el-table :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}"
              v-loading="loading" :data="bjCjPmList">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="排名" align="center" type="index"/>
      <el-table-column label="班级" align="center" prop="bj"/>
      <el-table-column label="平均分" align="center" prop="pjf"/>
    </el-table>
  </div>
</template>

<script>
import {selectBjCjList} from "@/api/xscj/cjlr";

export default {
  name: "index",
  data() {
    return {
      bjCjPmList: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      selectBjCjList().then(res => {
        this.loading = true
        this.bjCjPmList = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
