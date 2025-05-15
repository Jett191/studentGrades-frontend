<template>
  <vxe-modal
    title="办理任务"
    v-model="dialogVisible"
    v-if="dialogVisible"
    :loading="loading"
    width="70%" height="87vh" showFooter esc-closable show-zoom resize>

    <div style="height: 52vh; overflow-y: auto;">
      <el-card class="box-card" shadow="never" :body-style="{ padding: '10px',backgroundColor: '#bfcdda' }">
        <!-- 基本信息 -->
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; color: #1890ff;">基本信息</span>
          </div>
          <el-descriptions class="margin-top" :column="2" size="medium" border
                           :contentStyle="content_style" :labelStyle="label_style">
            <el-descriptions-item>
              <template slot="label">
                <div class="right-align-label">
                  <i class="el-icon-user"></i>
                  药品名称：
                </div>
              </template>
              {{ ypxxData.ypName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <div class="right-align-label">
                  <i class="el-icon-user"></i>
                  药品编码：
                </div>
              </template>
              {{ ypxxData.ypBm }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <div class="right-align-label">
                  <i class="el-icon-user"></i>
                  关键字：
                </div>
              </template>
              {{ ypxxData.gjz }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <div class="right-align-label">
                  <i class="el-icon-user"></i>
                  单位：
                </div>
              </template>
              {{ ypxxData.dw }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <br>

      </el-card>
    </div>
    <el-divider></el-divider>

    <el-card shadow="never">
      <el-form label-width="100px">
        <el-form-item label="审核状态：">
          <el-radio label="1" v-model="submitType">同意</el-radio>
          <el-radio label="2" v-model="submitType">驳回</el-radio>
          <el-select remote v-if="submitType==='2'" v-model="denyTo" placeholder="驳回到：" @visible-change="selectBefore">
            <el-option
              v-for="item in beforeData"
              :key="item.dkey"
              :label="item.taskName"
              :value="item.dkey">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核意见：">
          <el-input type="textarea" v-model="comment"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div slot="footer" class="dialog-footer dialog-footer-center">
      <el-button type="primary" @click="onSubmit()">提交</el-button>
      <el-button @click="dialogVisible=false">关闭</el-button>
    </div>
  </vxe-modal>
</template>
<script>

import { fallBackTaskByTaskDefinitionKey, passTask, selectBefore, selectHistory} from "@/api/activiti/task"
import {getYpxx} from "@/api/ylxt/ypxx";

export default {
  name: "YpxxSq", //药品审批界面
  dicts: ['sys_user_sex', 'rcpt_zc', 'rcpt_sxly', 'rcpt_ryfl', 'rcpt_sf'],
  data() {
    return {
      loading: false,
      ypxxData: [], //药品基本信息
      ypxxId: null, //药品主键ID
      beforeData: [],
      beforeDataLoading: false,
      denyTo: null,
      dialogVisible: false,
      rowData: null,
      submitType: "1",//默认同意
      comment: null,//审批意见
      businessData: null,//业务数据
      historyList: [],//历史信息
      content_style: {
        // 解决不对齐的问题
        'width': "400px",
        // 排列第二行
        'word-break': 'break-all',
        // 'background-color': '#f3f7ff'
      },
      label_style: {
        // 解决不对齐的问题
        'width': "250px",
        // 排列第二行
        'word-break': 'break-all',
      },
    };
  },
  created() {
  },
  methods: {
    // 文件下载处理
    handleDownload(row) {
      const resource = row.fileName;
      // 默认方法
      this.$download.resource(resource);
    },
    getFileNames(row) {
      // 从路径中提取文件名
      return row.fileName.split('/').pop(); // 返回文件名部分
    },
    handleOpen(row) {
      this.rowData = row
      this.loading = true;
      this.ypxxId = row.businessKey
      this.dialogVisible = true
      this.getYpXxData()
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    //获取详情数据
    getYpXxData() {
      const ypxxId = this.ypxxId
      getYpxx(ypxxId).then(res => {
        this.ypxxData = res.data
      })
    },
    //获取之前的节点信息
    selectBefore(visible){
      //console.log(this.rowData.taskId, "======selectBefore")
      if (visible) {
        this.beforeDataLoading = true;
        this.denyTo = null;
        this.beforeData = [];
        selectBefore({taskId: this.rowData.taskId,
          comment: this.comment,
          businessKey: this.rowData.businessKey,
          businessType: this.rowData.businessType,
          processInstanceId: this.rowData.processInstanceId}).then(res => {
          console.table(res);
          setTimeout(() => {
            this.beforeData = res.data;
            this.beforeDataLoading = false;
          }, 100); // 模拟异步加载数据
          //this.$options = res.data
        })
      }
    },
    clickTab(tab, event) {
      if (tab.name === 'history') {
        this.getSelectHistory()
      }
    },
    //获取历史记录
    getSelectHistory() {
      selectHistory({processInstanceId: this.rowData.processInstanceId}).then(res => {
        this.historyList = res.data
      })
    },
    //提交
    onSubmit() {
      if (!this.submitType) {
        this.$message.warning("请选择提交类型")
        return
      }
      if (!this.comment) {
        this.$message.warning("请输入审批意见")
        return
      }
      if (this.submitType == 1) {
        console.log(this.rowData, '1111111111111111111111111111111')
        //审核通过
        passTask({
          taskId: this.rowData.taskId,
          comment: this.comment,
          params: {
            // day: this.businessData.qingJiaDay
          },
          businessKey: this.rowData.businessKey,
          businessType: this.rowData.businessType,
          processInstanceId: this.rowData.processInstanceId
        }).then(res => {
          this.dialogVisible = false
          this.$emit('ok')
        })
      }
      //任务驳回
      if (this.submitType == 2) {
        console.log("nnnnnnnnn"+this.denyTo);
        //审核不通过
        fallBackTaskByTaskDefinitionKey({
          comment: this.comment,
          businessKey: this.rowData.businessKey,
          businessType: this.rowData.businessType,
          processInstanceId: this.rowData.processInstanceId,
          taskId: this.rowData.taskId,
          taskDefinitionKey:this.denyTo
        }).then(res => {
          console.log(res, "[[[[")
          this.dialogVisible = false
          this.denyTo = null;
          this.beforeData =[];
          this.$emit('ok')
        })
      }
    },

  }
};
</script>

