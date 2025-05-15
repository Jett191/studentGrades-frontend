<template>
  <vxe-modal :title="title" v-model="dialogVisible" width="40%" show-zoom resize showFooter>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="请假标题" prop="qingJiaTitle">
        <el-input disabled v-model="form.qingJiaTitle" placeholder="请输入请假标题" />
      </el-form-item>
      <el-form-item label="请假原因" prop="qingJiaReason">
        <el-input v-model="form.qingJiaReason" placeholder="请输入请假原因" />
      </el-form-item>
      <el-form-item label="请假天数" prop="qingJiaDay">
        <el-input v-model="form.qingJiaDay" placeholder="请输入请假天数" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import {addInfoQingJia, getInfoQingJia, updateInfoQingJia} from "@/api/infoQingJia/infoQingJia";

export default {
  name: "QingJiaBJ",
  data() {
    return {
      dialogVisible: false,
      title: null,
      // 表单校验
      rules: {
        qingJiaTitle: [
          { required: true, message: "请假标题不能为空", trigger: "blur" }
        ],
        qingJiaReason: [
          { required: true, message: "请假原因不能为空", trigger: "blur" }
        ],
        qingJiaDay: [
          { required: true, message: "请假天数不能为空", trigger: "blur" }
        ]
      },
      // 表单参数
      form: {},

    }
  },
  methods: {
    handleOpen(row) {
      this.reset();
      const id = row.businessKey
      getInfoQingJia(id).then(response => {
        this.form = response.data;
        this.dialogVisible = true;
        this.title = "修改请假";
      });
    },
    // 表单重置
    reset() {
      this.form = {id: null, qingJiaTitle: null, qingJiaReason: null, qingJiaDay: null, userId: null};
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfoQingJia(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            addInfoQingJia(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },

  }
}
</script>

<style scoped>

</style>
