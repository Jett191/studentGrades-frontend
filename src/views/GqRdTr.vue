<template>
  <div id="app">
    <div>
      <el-select @change="getLists" filterable v-model="xsName" placeholder="请选择学生姓名">
        <el-option
          v-for="item in xsList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userName">
        </el-option>
      </el-select>
    </div>
    <div id="chart-container" ref="chartContainer"
         style="height: 100%; width: 100%; ">
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {selectXscjfx} from "@/api/xscj/cjlr";
import {selectXsList} from "@/api/xscj/kcxx";

export default {
  name: 'EchartsDemo',
  created() {
    this.getList()
  },
  data() {
    return {
      kcNameArray: null,
      kcCjArray: null,
      xsName: null,
      xsList: [],
    }
  },
  methods: {
    getLists() {
      console.log(this.xsName)
      selectXscjfx(this.xsName).then(res => {
        this.kcNameArray = res.data.map(item => item.kcName);
        this.kcCjArray = res.data.map(item => item.kcCj);
        this.initChart(); // 数据返回后初始化图表
      })
    },
    getList() {
      selectXsList().then(res => {
        this.xsList = res.data
        this.xsName = this.xsList[0].userName
        selectXscjfx(this.xsName).then(res => {
          this.kcNameArray = res.data.map(item => item.kcName);
          this.kcCjArray = res.data.map(item => item.kcCj);
          this.initChart(); // 数据返回后初始化图表
        })
      })

    },
    initChart() {
      const chartContainer = this.$refs.chartContainer;
      this.myChart = echarts.init(chartContainer, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.kcNameArray
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '数据',
            type: 'bar',
            data: this.kcCjArray,
            itemStyle: {
              color: '#4756fd'
            }
          }
        ]
      };

      if (option && typeof option === 'object') {
        this.myChart.setOption(option);
      }
    },
  }
};
</script>

<style scoped>

</style>
