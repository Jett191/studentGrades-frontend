<template>
  <div id="app">
    <div id="chart-container" ref="chartContainer" style="height: 100%; width: 100%; position: absolute; top: 10%; left: 0;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {selectCjTjList} from "@/api/xscj/cjlr";

export default {
  name: 'EchartsDemo',
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
  },
  created() {
    this.getList()
  },
  data() {
    return {
      transformedArray: []
    }
  },
  methods: {
    getList() {
      this.loading = true
      selectCjTjList().then(res => {
        this.transformedArray = res.data.map(item => ({
          value: item.pjf,
          name: item.kcName
        }));
        this.initChart(); // 数据返回后初始化图表
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
          confine: true,          // 强制提示框限制在图表区域内
          position: 'right',      // 优先右侧显示（根据实际情况调整）
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '预算分配',
            type: 'pie',
            radius: '50%',
            data: this.transformedArray,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      if (option && typeof option === 'object') {
        this.myChart.setOption(option);
      }
    },
    resizeChart() {
      this.myChart.resize();
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#chart-container {
  position: relative;
  height: 400px;
  overflow: hidden;
}
</style>
