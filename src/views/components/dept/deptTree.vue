<template>
  <div class="app-container">
    <!--部门数据-->
    <vxe-modal :loading="newLoading" title="选择所属单位" v-model="dialogVisible" v-if="dialogVisible" width="25%" height="70vh" showFooter esc-closable show-zoom resize>
      <div class="head-container">
        <el-input
          v-model="deptName"
          placeholder="请输入单位名称进行搜索"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>

      <!-- default-expand-all 默认展开树所有节点 -->
      <div class="head-container">
        <el-tree
          :data="deptOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          node-key="id"
          highlight-current
          @node-click="handleNodeClick"
          :render-content="renderContent"
        />
      </div>

      <div slot="footer" class="dialog-footer dialog-footer-center">
        <el-button @click="submitForm">
          <svg-icon icon-class="confirm1" class-name='custom-class' />确 定
        </el-button>
        <el-button @click="cancel">
          <svg-icon icon-class="cancel1" class-name='custom-class' />取 消
        </el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import {deptTreeSelect} from "@/api/system/user";
import {getDept} from "@/api/system/dept";
import * as huacai from "@/utils/huacai";

export default {
  inject: ['updateDeptLabel', 'updateDeptId'],
  name: "deptTree",
  data(){
    return {
      newLoading: false,
      dialogVisible: false,
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      deptLable: null,
      todayLabel: null, //当前点击选择的部门名称
      superiorLabel:null, //当前点击选择的部门的上一级的部门名称
      todayDeptId: null,
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    cancel(){
      this.dialogVisible = false
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <svg-icon icon-class="unit"  class-name='custom-class' /> {/* 这里是图标，你可以替换为任意图标库中的图标 */}
          {node.label}
        </span>
      );
    },
    //确定按钮(选择完部门后)
    submitForm(){
      this.dialogVisible = false
      this.updateDeptLabel(this.deptLable);
      this.updateDeptId(this.todayDeptId)
      this.dialogVisible = false
    },
    handleOpen() {
      this.newLoading = true
      this.deptLable = null;
      this.dialogVisible = true;
      this.getDeptTree();
      setTimeout(() => {
        this.newLoading = false
      }, 800)
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 节点单击事件
    // handleNodeClick(data) {
    //   // console.log(data.id)
    //   this.todayDeptId = data.id
    //   this.todayLabel = data.label
    //   getDept(data.id).then(res => {
    //     this.superiorLabel = res.data.parentName //选择到的单位的上一级单位
    //
    //     if (this.superiorLabel == undefined){
    //       this.deptLable = this.todayLabel //最终返回的部门名称
    //     }else {
    //       this.deptLable = this.superiorLabel + '/' + this.todayLabel //最终返回的部门名称
    //     }
    //
    //   })
    // },

    handleNodeClick(data) {
      // 设置当前选中的部门 ID 和标签
      this.todayDeptId = data.id;
      this.todayLabel = data.label;
      this.$modal.loading("正在获取部门数据，请稍后...");// 显示加载指示器

      // 调用 getFullDeptLabel 方法获取完整的部门标签
      this.getFullDeptLabel(this.todayDeptId).then(fullLabel => {
        this.deptLable = fullLabel;// 将获取到的完整部门标签赋值给 deptLable
        this.$modal.closeLoading();// 隐藏加载指示器
      });
    },
    getFullDeptLabel(deptId) {
      // 调用 getDept 方法获取部门信息
      return getDept(deptId).then(res => {
        // 如果有上级部门（parentId 存在）
        if (res.data.parentId) {
          // 递归调用 getFullDeptLabel 获取上级部门的完整标签
          return this.getFullDeptLabel(res.data.parentId).then(parentLabel => {
            // 返回上级部门标签和当前部门标签的组合
            return parentLabel + '/' + res.data.deptName;
          });
        } else {
          // 如果没有上级部门，直接返回当前部门的标签
          return res.data.deptName;
        }
      });
    },

  },
}
</script>

<style scoped>

</style>
