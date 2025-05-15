<template>
  <div>
    <el-form
      :inline="false"
      label-width="100px"
      size="small"
      label-position="right"
    >
      <el-form-item label="节点类型">
        <el-input v-model="localFormData.type" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input v-model="localFormData.id" @input="updateId"></el-input>
      </el-form-item>
      <el-form-item label="节点名称">
        <el-input v-model="localFormData.name" @input="updateName"></el-input>
      </el-form-item>

      <!--usertask-->
      <el-form-item
        v-if="localFormData.type == 'bpmn:UserTask'"
        label="节点人员"
      >
        <el-select
          v-model="localFormData.userType"
          placeholder="请选择"
          @change="changeUserType"
        >
<!--          <el-option value="assignee" label="指定人员"></el-option>-->
          <el-option value="candidateUsers" label="指定人员(可多选)"></el-option>
          <el-option value="candidateGroups" label="角色"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="指定人员"
        v-if="
          localFormData.type == 'bpmn:UserTask' &&
          localFormData.userType === 'assignee'
        "
      >
        <el-select
          v-model="localFormData.assignee"
          placeholder="请选择"
          key="1"
          @change="(value) => addUser({ assignee: value })"
        >
          <el-option
            v-for="item in bpmnData.assignees"
            :key="item.userId"
            :label="item.nickName + '(' + item.dept.deptName + ')'"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="候选人员"
        v-else-if="
          localFormData.type == 'bpmn:UserTask' &&
          localFormData.userType === 'candidateUsers'
        "
      >
        <el-select
          v-model="localFormData.candidateUsers"
          placeholder="请选择"
          key="2"
          multiple
          filterable
          @change="
            (value) => addUser({ candidateUsers: value.join(',') || value })
          "
        >
          <el-option
            v-for="item in bpmnData.candidateUsers"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="角色"
        v-else-if="
          localFormData.type == 'bpmn:UserTask' &&
          localFormData.userType === 'candidateGroups'
        "
      >
        <el-select
          v-model="localFormData.candidateGroups"
          placeholder="请选择"
          @change="(value) => addUser({ candidateGroups: value })"
        >
          <el-option
            v-for="item in bpmnData.roles"
            :key="item.roleKey"
            :label="item.roleName"
            :value="item.roleKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表达式">
        <el-input v-model="bdsValue" placeholder="请输入表达式">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="addBds()"
          ></el-button>
        </el-input>
      </el-form-item>
      <!--sequenceFlow-->

      <!--任务监听-->
      <el-form-item
        v-if="localFormData.type == 'bpmn:SequenceFlow'"
        label="分支条件"
      >
        <el-input
          v-model="localFormData.sequenceFlow"
          @input="updateSequenceFlow"
          placeholder="请输入分支条件"
        ></el-input>
      </el-form-item>
      <!--添加参数提示-->
      <el-form-item>
        <Tip v-if="localFormData.type == 'bpmn:SequenceFlow'" />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { listUsersToWorkflow,queryAllSysRole  } from "@/api/activiti/user";
export default {
  name: "NodePropertyPanel",
  data() {
    return {
      bpmnData: {
        assignees: [],
        candidateUsers: [],
        roles: [],
        jytAssignee: [], //金益通人员列表
      },
      dialogTableVisible: false,
      localFormData: this.formData,
      proData: [],
      bdsValue: "",
    };
  },
  props: {
    modeler: {
      type: Object,
      required: true,
    },
    nodeElement: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    nodeElement: {
      handler() {
        if (this.nodeElement.type == "bpmn:StartEvent") {
          this.updateName("开始");
        }
        if (this.nodeElement.type == "bpmn:EndEvent") {
          this.updateName("结束");
        }
      },
    },
  },
  methods: {
    updateProperties(properties) {
      this.modeler
        .get("modeling")
        .updateProperties(this.nodeElement, properties);
    },
    updateId(name) {
      this.updateProperties({ id: name });
    },
    updateName(name) {
      this.updateProperties({ name: name });
    },
    //选择节点人员
    changeUserType(e) {
      var p = {};
      if (e === "assignee") {
        p.candidateUsers = undefined;
        p.candidateGroups = undefined;
      }
      if (e === "candidateUsers") {
        p.assignee = undefined;
        p.candidateGroups = undefined;
      }
      if (e === "candidateGroups") {
        p.assignee = undefined;
        p.candidateUsers = undefined;
      }
      this.updateProperties(p);
    },
    updateSequenceFlow(val) {
      let newCondition = this.modeler
        .get("moddle")
        .create("bpmn:FormalExpression", {
          body: val,
        });
      this.updateProperties({ conditionExpression: newCondition });
    },
    addUser(properties) {
      this.updateProperties(properties);
      Object.assign(properties, {
        userType: Object.keys(properties)[0],
      });
      console.log(properties, "--");
      this.$emit("modifyFormData", properties);
    },
    // 用户下拉选择
    listUsers() {
      this.bpmnData.assignees = [];
      listUsersToWorkflow().then((res) => {
        res.data.forEach((element) => {
          this.bpmnData.assignees.push({
            userId: element.userId.toString(),
            nickName: element.nickName,
            dept: {
              deptName: element.deptName,
            },
          });
        });
        this.bpmnData.candidateUsers = res.data;
      });
    },
    // 岗位下拉选择
    listRoleToWorkflow() {
      this.bpmnData.roles = [];
      queryAllSysRole().then((res) => {
        this.bpmnData.roles = res.data;
      });
    }, //添加表达式
    addBds() {
      var param = { assignee: this.bdsValue };
      this.addUser(param);
      this.$message({
        message: "赋值成功",
        type: "success",
      });
    },
  },
  created() {
    this.listUsers();
    this.listRoleToWorkflow();
  },
};
</script>

<style scoped>
.collapse-title {
  flex: 1 0 90%;
  order: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
}
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-button {
  margin: 0px;
}
</style>
