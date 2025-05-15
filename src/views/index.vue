<template>
  <div class="wraps">
    <!-- 左上 省部级立项趋势图 -->
    <div class="upperleft">
      <el-card class="box-card" shadow="hover" style="height: 83vh">
        <div slot="header" class="clearfix">
          <span style="font-size: 16px; color: #1890ff; font-weight: 550">平均分分析</span>
        </div>
        <div style="font-size: 16px">
          <SbjLxQst></SbjLxQst>
        </div>
      </el-card>
    </div>

    <!-- 左下 当前年份高企认定 -->
<!--    <div class="lowerLeft">-->
<!--      <el-card class="box-card" shadow="hover" style="height: 44.2vh">-->
<!--        <div slot="header" class="clearfix">-->
<!--          <span style="font-size: 16px; color: #1890ff; font-weight: 550">1212</span>-->
<!--        </div>-->
<!--        <div style="font-size: 16px">-->
<!--          <GqRd></GqRd>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </div>-->

    <!-- 右上 学生成绩分析 -->
    <div class="upperRight">
      <el-card class="box-card" shadow="hover" style="height: 83vh">
        <div slot="header" class="clearfix">
          <span style="font-size: 16px; color: #1890ff; font-weight: 550">学生成绩分析</span>
        </div>
        <GqRdTr/>
      </el-card>
    </div>

    <!-- 右下 未来第三年高企认定(计划认定) -->
<!--    <div class="lowerRight">-->
<!--      <el-card class="box-card" shadow="hover" style="height: 43.2vh">-->
<!--        <div slot="header" class="clearfix">-->
<!--          <span style="font-size: 16px; color: #1890ff; font-weight: 550">{{ futureThirdYear }}年高企认定(计划认定)</span>-->
<!--        </div>-->
<!--        <GqRdWl/>-->
<!--      </el-card>-->
<!--    </div>-->
  </div>
</template>

<script>
import SbjLxQst from "@/views/SbjLxQst";
import GqRdTr from "@/views/GqRdTr";
import GqRd from "@/views/GqRd";
import GqRdWl from "@/views/GqRdWl";
export default {
  components: {SbjLxQst, GqRdTr, GqRd, GqRdWl},
  data() {
    return {
      // 如果需要其他数据绑定，可以在这里添加
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    futureThirdYear() {
      return this.currentYear + 3;
    }
  },
  created() {

  }
}
</script>

<style scoped>
.wraps {
  position: relative;
  background-size: cover;
  width: 100%;
  height: calc(100vh - 134px);
  border: 2px dashed #aaa;
  overflow: hidden; /* 防止 leftpart 超出 wrap */
}

/* 左上 */
.upperleft {
  position: absolute;
  top: 1%; /* 距离上面 6% */
  bottom: 1%; /* 距离下面 60% */
  left: 1%; /* 距离左侧1% */
  width: 48%;
  border: 1px solid #D9EDF7;
  /*background-color: rgba(9, 37, 59, 0.5); !* 模块背景颜色 并透明显示 *!*/
}

/* 左下 */
.lowerLeft {
  position: absolute;
  top: 50%; /* 距离上面 43% */
  bottom: 1%; /* 距离下面 50% */
  left: 1%; /* 距离左侧1% */
  width: 48%;
  border: 1px solid #D9EDF7;
  /*background-color: rgba(9, 37, 59, 0.5);*/
}


/* 右上 */
.upperRight {
  position: absolute;
  top: 1%; /* 距离上面 6% */
  bottom: 1%; /* 距离下面 60% */
  left: 50%; /* 距离左侧1% */
  width: 50%;
  border: 1px solid #D9EDF7;
  /*background-color: rgba(9, 37, 59, 0.5);*/
}

/* 右下 */
.lowerRight {
  position: absolute;
  top: 50%; /* 距离上面 43% */
  bottom: 1%; /* 距离下面 50% */
  left: 50%; /* 距离左侧1% */
  width: 50%;
  border: 1px solid #D9EDF7;
  /*background-color: rgba(9, 37, 59, 0.5);*/
}

/* header 头部背景 */
/deep/ .el-card__header {
  padding: 6px 15px 7px;
  min-height: 30px;
  background-color: #D9EDF7;
}

/deep/ .el-card__body {
  padding: 2px 20px 20px 20px;
  height: 40vh;
}

.lowerMiddle /deep/ .el-card__body{
  padding: 20px;
  box-sizing: border-box;
  height: calc(100% - 40px) !important;
}
.lowerMiddle /deep/ .el-carousel{
  height: 100%;
}
.lowerMiddle /deep/ .el-carousel__container{
  height: 100% !important;
}
.lowerMiddle /deep/ .el-carousel__item{
  height: 100% !important;
}
.lowerMiddle /deep/ .img{
  width: 100%;
  height: 100%;
}
</style>

