<template>
  <div class="app-container">

    <el-form ref="form" class="small-size-error" :model="form" :disabled="formDisabled" size="small" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item label="申请编号" prop="apNumber">
            <el-input v-model="form.apNumber" placeholder="自动生成" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24" >
          <el-form-item label="原件/印章名称" prop="boName" required>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.boName" placeholder="请选择原件/印章名称"  @focus="openBorrowWin" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item label="借用单位" prop="apDept">
            <el-input v-model="form.apDept" placeholder="自动获取" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="借用人" prop="apPerson">
            <el-input v-model="form.apPerson" placeholder="自动获取" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item label="借用人手机" prop="apPhone" required>
            <el-input v-model="form.apPhone" placeholder="请输入借用人手机" />
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="使用时间" prop="apUseTime" required>
            <el-date-picker clearable  style="width: 100%"
              v-model="form.apUseTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择使用时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item label="预计归还时间" prop="apReturnTime" required>
            <el-date-picker clearable  style="width: 100%"
              v-model="form.apReturnTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择预计归还时间">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="借用事由" prop="apOrigin" required>
            <el-select v-model="form.apOrigin" placeholder="请选择借用事由" :disabled="formDisabled" @change="apOriginChange" style="width: 100%" size="small" >
              <el-option v-for="dict in apOriginOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-form-item label="其他事由" prop="apOtherOrigin" :required="!required">
            <el-input v-model="form.apOtherOrigin" placeholder="请输入其他事由" />
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label="项目名称" prop="apProjectName" >
            <el-input :readonly="required" v-model="form.apProjectName" placeholder="请输入项目名称">
              <el-button v-if="required" slot="append" icon="el-icon-search" @click="selectProject"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <!-- 选择原件/印章名称 -->
    <selectBorrow ref="selectBorrow" @submitChecked="getBoNames" />
    <!-- 立项备案列表 -->
    <projectListWin ref="projectListWin" @selectProject="setProject" />
    <!-- 标前评审列表 -->
    <boddicListWin ref="boddicListWin" @selectProject="setProject" />
    <!-- 投标评审列表 -->
    <biddingEvaluationWin1 ref="biddingEvaluationWin1" @selectProject="setProject" />
  </div>
</template>

<script>
  import FileList from '@/components/FileList'
  import { getApply, updateApply } from "@/api/credit/originalApply";
  import projectListWin from "@/views/review/project/listWin.vue";
  import boddicListWin from "@/views/review/biddoc/listWin.vue";
  import selectBorrow from "@/views/credit/originalApply/selectBorrow.vue";
  import biddingEvaluationWin1 from "@/views/bidding/biddingEvaluation/biddingEvaluationWin1.vue";
  export default {
    components: {
      FileList,selectBorrow,projectListWin,boddicListWin,biddingEvaluationWin1
    },
    props: {
      isEdit: {
        type: Boolean,
        default: true
      },
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        //表单禁用
        formDisabled:true,
        required: true,
        //流程提交选择弹出框
        openAct: false,
        //流程信息
        actInfo: {},
        // 遮罩层
        loading: true,
        fileType:["doc", "xls", "ppt", "txt", "pdf" , "png" , "jpg"],
        //附件列表参数
        filedata:{groupid:'originalApplyFile',relationid:''},

        // 表单参数
        form: {},
        // 表单校验
        rules: {
          boName: [{ required: true, message: "原件/印章名称不能为空", trigger: "blur" }],
          apPhone: [{ required: true, message: "借用人手机不能为空", trigger: "blur" }],
          apUseTime: [{ required: true, message: "使用时间不能为空", trigger: "blur" }],
          apReturnTime: [{ required: true, message: "预计归还时间不能为空", trigger: "blur" }],
          apOrigin: [{ required: true, message: "借用事由不能为空", trigger: "blur" }],
          apOtherOrigin: [{ required: false, message: "其他事由不能为空", trigger: "blur" }],
          apProjectName: [{ required: true, message: "项目名称不能为空", trigger: "blur" }],
          file: [{ required: false, message: "附件不能为空", trigger: "blur" }],
        },
        // 借用事由字典
        apOriginOptions: [
          {dictValue:'1',dictLabel:'报名时'},
          {dictValue:'2',dictLabel:'投标时'},
          {dictValue:'3',dictLabel:'其它时'},
        ],
      };
    },
    created() {
      getApply(this.id).then(response => {
        let data = response.data;
        this.form = data;
        this.filedata.relationid = data.id;
      });

      if(this.isEdit){
        this.formDisabled = false;
      }
    },
    methods: {
      /** 提交按钮 */
      submitForm(callback) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateApply(this.form).then(response => {
                this.msgSuccess("修改成功");
                if(callback)callback();
              });
          }
        });
      },

      apOriginChange(apOrigin,bool){
        if(apOrigin == "3"){
          this.required = false
        }else{
          this.required = true
        }
        this.rules.apOtherOrigin[0].required = !this.required
        this.rules.apProjectName[0].required = this.required
        if(!bool){
          this.form.apProjectId = ''
          this.form.apProjectName = ''
          this.form.apOtherOrigin = ''
          this.$nextTick(() => {this.$refs["form"].clearValidate()})
        }
      },

      openBorrowWin(){
        this.$refs.selectBorrow.show();
      },

      getBoNames(obj){
        if (obj != '') {
          //获取选中行
          this.form.boId = obj.ids;
          this.form.boName = obj.boNames;
        }
      },

      selectProject(){
        let value = this.form.apOrigin
        if(value == '1'){
        this.$refs.projectListWin.title = '请选择立项申请信息';
        this.$refs.projectListWin.queryParams.flwStatus = '3';
        this.$refs.projectListWin.openWin = true;
        this.$refs.projectListWin.getList();
        }else if(value == '2'){
        this.$refs.biddingEvaluationWin1.title = '请选择投标评审信息';
        this.$refs.biddingEvaluationWin1.queryParams.flwStatus = '3';
        this.$refs.biddingEvaluationWin1.openWin = true;
        this.$refs.biddingEvaluationWin1.getList();
        }

      },
      setProject(data){
        this.form.apProjectId = data.id
        this.form.apProjectName = data.projectName
      },
    }
  };
</script>
