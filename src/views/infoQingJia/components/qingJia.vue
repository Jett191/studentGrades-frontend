<template>
  <el-dialog
    title="办理任务"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    :fullscreen="true"
    width="30%">
    <el-tabs :tab-position="tabPosition" @tab-click="clickTab">
      <el-tab-pane label="办理任务">
        <el-descriptions style="width: 50%;margin: 0 auto" :column="2">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              标题
            </template>
            {{ businessData.qingJiaTitle }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              申请人
            </template>
            {{businessData.nickName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              申请原因
            </template>
            {{ businessData.qingJiaReason }}
          </el-descriptions-item>
        </el-descriptions>

        <div style="width: 50%;margin:  50px auto;display: flex;flex-direction: column">
          <div>
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
          </div>
          <div style="margin-top: 20px">
            <el-input type="textarea" v-model="comment"></el-input>
          </div>
          <div style="margin-top: 20px">
            <el-button type="primary" @click="onSubmit()">提交</el-button>
            <el-button @click="dialogVisible=false">关闭</el-button>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="历史记录" name="history">
        <el-table
          :data="historyList"
          style="width: 100%">
          <el-table-column
            prop="taskName"
            label="节点名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="审批人"
            width="180">
          </el-table-column>
          <el-table-column
            prop="comment"
            label="审批意见">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="审批时间">
            <template slot-scope="scope">
              {{scope.row.endTime?scope.row.endTime:scope.row.startTime}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>

import {passTask, fallBackTask, selectHistory, fallBackTaskByTaskDefinitionKey, selectBefore} from "@/api/activiti/task"
import {getInfoQingJia} from "@/api/infoQingJia/infoQingJia"

export default {
  data() {
    return {
      beforeData: [],
      beforeDataLoading: false,
      denyTo: null,
      tabPosition: 'left',
      dialogVisible: false,
      rowData: null,
      submitType: null,//同意 或者 驳回
      comment: null,//审批意见
      businessData: null,//业务数据
      historyList: [],//历史信息
    };
  },
  methods: {
    handleOpen(row) {
      this.rowData = row
      this.dialogVisible = true
      this.getInfoQingJiaData()
    },
    //获取详情数据
    getInfoQingJiaData() {
      getInfoQingJia(this.rowData.businessKey).then(res => {
        this.businessData = res.data
      })
    },
    clickTab(tab, event) {
      console.log(tab.name, "asjdh111gh")
      if (tab.name === 'history') {
        this.getSelectHistory()
      }
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
    //获取历史记录
    getSelectHistory() {
      selectHistory({processInstanceId: this.rowData.processInstanceId}).then(res => {
        console.log(res.data, "aslkjdhag")
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
        //审核通过
        passTask({
          taskId: this.rowData.taskId,
          comment: this.comment,
          params: {
            day: this.businessData.qingJiaDay
          },
          businessKey: this.rowData.businessKey,
          businessType: this.rowData.businessType,
          processInstanceId: this.rowData.processInstanceId
        }).then(res => {
          console.log(res, "[[[[")
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

