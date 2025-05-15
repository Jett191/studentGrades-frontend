<template>
  <div>
    <el-dialog
      :title="'人员选择' + (type == 'multiple' ? '(多选)' : '(单选)')"
      :visible.sync="open"
      :width="width || '900px'"
      :height="height || '650px'"
      :before-close="handleClose"
      append-to-body
    >

      <div class="selectBox">
        <div class="bottomBox" v-show="showSearch">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="用户姓名" prop="nickName">
                  <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入用户姓名"
                    clearable
                    style="width: 200px"
                    size="mini"
                    @keyup.enter.native="getList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码" prop="phonenumber">
                  <el-input
                    v-model="queryParams.phonenumber"
                    placeholder="请输入手机号码"
                    clearable
                    style="width: 200px"
                    size="mini"
                    @keyup.enter.native="getList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>



          </el-form>
        </div>
        <div class="topBox">
          <div class="leftBox">
            <div class="contentBox">
              <div class="leftBox_title">组织架构</div>
              <div style="padding: 4px;margin-bottom: 4px;">
                <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  size="mini"
                  prefix-icon="el-icon-search"
                >
                </el-input>
              </div>
              <div class="treeBox">
                <el-tree
                  :data="deptOptions"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="tree"
                  node-key="id"
                  default-expand-all
                  highlight-current

                  @node-click="handleNodeClick"
                />
              </div>
            </div>
          </div>

          <div class="leftBox">
            <div class="contentBox">
              <div class="leftBox_title">
                人员选择
                <!-- <el-checkbox class="leftBox_title_do" style="right: 60px" v-model="userNodeAll" @change="handleCheckedNodeAll($event)">全选</el-checkbox>
                <el-checkbox class="leftBox_title_do" v-model="cancelUserNodeAll" @change="handleCheckedNodeAll($event)">全不选</el-checkbox> -->
                <el-button v-if="type === 'multiple'" class="leftBox_title_do" style="right: 70px" type="text" size="mini" @click="handleCheckedNodeAll(true)">全选</el-button>
                <el-button v-if="type === 'multiple'" class="leftBox_title_do" type="text" size="mini" @click="handleCheckedNodeAll(false)">全不选</el-button>
              </div>

              <div class="peopleBox">
                <div class="peopleList">
                  <el-checkbox-group ref="peopleCheckBoxes" v-model="checkedUsers" @change="handleCheckedUsersChange" :max="type == 'single' ? 1 : 2147483647">
                    <el-checkbox
                      v-for="item in userList"
                      :label="item.userName"
                      :key="item.userName"
                      class="peopleCard"
                    >
                      <div class="avatarBox">
                        <!-- <img v-if="item.avatar && item.avatar != ''" :src="item.avatar" class="user-avatar" onerror="οnerrοr=null;if(item) item.avatar = '';"> -->
                        <div style="background: #FFA502;" class="user-avatar">{{ item.nickName.substring(0,1) || item.userName.substring(0,1) || 'User' }}</div>
                      </div>
                      <div class="peopleInfoBox">
                        <div class="peopleName">{{ item.nickName }}</div>
                        <div class="peopleDept">{{ item.dept.deptName || '' }}</div>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>

                </div>
              </div>
            </div>
          </div>
          <!-- this.checkedUsers -->
          <div class="leftBox">
            <div class="contentBox">
              <div class="leftBox_title">已选择人员
                <el-button v-if="type == 'multiple'" class="leftBox_title_do" type="text" size="mini" @click="clearAll">全部清空</el-button>
              </div>
              <div class="peopleBox">
                <div class="peopleList">
                  <div
                    v-for="item in selectedUserList"
                    class="peopleCard"
                  >
                    <div class="avatarBox">
                      <!-- <img v-if="item.avatar && item.avatar != ''" :src="item.avatar" class="user-avatar" onerror="οnerrοr=null;if(item) item.avatar = '';"> -->
                      <div style="background: #FFA502;" class="user-avatar">{{ item.nickName.substring(0,1) || item.userName.substring(0,1) || 'User' }}</div>
                    </div>
                    <div class="peopleInfoBox">
                      <div class="peopleName" style="margin-top:4px">{{ item.nickName }}</div>
                      <div class="peopleDept">{{ item.dept.deptName || '' }}</div>
                    </div>

                    <div class="peopleDeleteBtn" @click="deleteUserByUserName(item.userName)"></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>


import { listUser, getUser, deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";


import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "PeopleSelect",
  components: { Treeselect },
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  props: {
    width: {
      type: String,
      default: "900px",
    },
    height: {
      type: String,
      default: '650px'
    },
    type: {
      type: String,
      default: "single" //single or multiple
    },
    open: {
      type: Boolean,
      default:false,
    }
    // value: {
    //     type: Object,
    //     default: {
    //         userName: [],
    //         realName: []
    //     }
    // }
  },
  computed: {

  },
  data() {
    return {

      loading: false,

      // open: false,
      activeName: 'first',
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门树选项
      deptOptions: undefined,
      deptName: '',
      showSearch: true,

      userList: [],
      allUserList: [],
      allUserMap: new Map(),
      selectedUserList: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 2147483647,
        userName: undefined,
        phonenumber: undefined,
        status: "0",
        deptId: undefined
      },

      //已选择的用户信息
      checkedUsers: [],

      //   userNodeAll: false,
      //   cancelUserNodeAll: false,

    };
  },
  created() {
    this.getDeptTree();
    this.getAllUserList();
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.cancel();
        })
        .catch(_ => {});
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },


    //获取选中的人员昵称列表
    getNickNameList(uns) {
      let result = [];

      uns.forEach(item => {
        if(this.allUserMap.has(item)) {
          result.push(this.allUserMap.get(item).nickName || '');
        }
      })

      return result;
    },

    submitForm() {
      // console.log(this.checkedUsers, this.getNickNameList(this.checkedUsers));
      this.$emit("submit", this.checkedUsers, this.getNickNameList(this.checkedUsers)); //返回username和nickname
    },
    cancel() {
      this.$emit('cancel');
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },

    //第一步要做的 checkedUsers 为数组如['admin','ry'] 在父组件调用此方法并传入要回显的数组可进行复选框回显操作
    getAllUserList(checkedUsers = []) {
      //查出所有的用户，用于根据不同情况筛选显示
      listUser({pageNum: 1,pageSize: 2147483647,status: "0"}).then(response => {
          this.allUserList = response.rows;

          this.allUserMap = new Map();

          this.checkedUsers = checkedUsers;

          this.allUserList.forEach(item => {
            this.allUserMap.set(item.userName, item);
          });
          this.updateCheckedUsers();
          //   console.log(this.allUserList, this.allUserMap);
          this.getList();
        }
      );
    },

    /** 查询用户列表 */
    getList() {
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          //   console.log(this.userList);
        }
      );
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.getList();
    },

    handleCheckedUsersChange(val) {
      // console.log(this.$refs.peopleCheckBoxes.value);
      this.updateCheckedUsers();
    },

    updateCheckedUsers() {
      this.selectedUserList = [];

      this.checkedUsers.forEach(item => {
        if(this.allUserMap.has(item)) {
          let u = this.allUserMap.get(item);
          this.selectedUserList.push(u);
        }
      })
    },

    deleteUserByUserName(username) {
      for(let i = 0;i < this.checkedUsers.length;i++) {
        if(this.checkedUsers[i].indexOf(username) != -1) {
          this.checkedUsers.splice(i, 1);
          this.updateCheckedUsers();
          break;
        }
      }
    },

    handleCheckedNodeAll(val) {
      if(val) { //全选
        this.userList.forEach(item => {
          for(let i = 0;i < this.checkedUsers.length;i++) {
            if(this.checkedUsers[i] == item.userName) { //已存在，跳过
              return;
            }
          }
          //不存在，执行添加
          this.checkedUsers.push(item.userName);
        });
      } else { //全不选
        this.userList.forEach(item => {
          for(let i = 0;i < this.checkedUsers.length;i++) {
            if(this.checkedUsers[i] == item.userName) { //已存在，执行删除
              this.checkedUsers.splice(i, 1);
              return;
            }
          }
          //不存在，无需操作

        });
      }
      this.updateCheckedUsers();
    },


    clearAll() {
      this.checkedUsers = [];
      this.updateCheckedUsers();
    }

  }
}
</script>

<style lang="scss" scoped>

.selectBox {
  width:100%;
  min-width: 900px;
  display: flex;
  flex-direction: column;

  .topBox {
    width:100%;
    display: flex;
    margin-top:10px;
    .leftBox {
      width:280px;
      height: 400px;
      margin-right:10px;

      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;

      .leftBox_title {
        width:100%;
        height:40px;
        font-size: 16px;
        line-height: 40px;
        padding-left: 10px;
        background-color: #f5f5f5;
        position: relative;
        .leftBox_title_do {
          position: absolute;
          right: 16px;
          top: 8px;
        }
      }


      .contentBox {
        width:100%;

      }
    }
  }

  .bottomBox {
    margin-top:15px;
    width:100%;
    height:75px;
    // border: 1px solid #DCDFE6;
    // -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    // overflow-y: auto;

    .selectPeopleList {
      width:100%;
      display: flex;
      flex-wrap: wrap;

      .selectPeopleCard {
        width:50px;
        height:56px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 5px 10px;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #fff;
          background: #FFA502;
          font-size: 14px;
          text-align: center;
          line-height: 40px;
        }

        .userInfo {
          width:100%;
          display: flex;
          flex-direction: column;
          margin-left:5px;
          margin-right:5px;

          div:nth-child(1) {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width:100%;
            text-align: center;
          }
        }
      }
    }
  }

}

.treeBox {
  width:100%;
  height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
}

.peopleBox {
  width:100%;
  height: 360px;
  overflow-x: hidden;
  overflow-y: auto;

  .peopleList {
    width:100%;
    height:auto;


    .peopleCard:hover {
      background-color: #fafafa;
      transition: .2s;

      .peopleName {
        color:#eb6100;
      }
    }
    .peopleCard {
      width:100%;
      height: 48px;
      border-top: solid #f5f5f5 1px;
      border-bottom: solid #f5f5f5 1px;
      padding-left: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: .2s;
      ::v-deep .el-checkbox__label {
        display: flex;
        align-items: center;
      }

      .avatarBox {
        width: 40px;
        height: 40px;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 40px;
          user-select: none;
        }
      }

      .peopleInfoBox {
        width: 190px;
        height:100%;
        display: flex;
        flex-direction: column;
        padding-left: 8px;

        .peopleName {
          width: 100%;
          height:20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          line-height: 20px;

        }

        .peopleDept {
          width: 100%;
          height:20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 20px;
          color: #999;
        }
      }

      .peopleDeleteBtn {
        width:20px;
        height:20px;
        // border-radius: 50%;
        background: url(./delete2.png) no-repeat;
        background-size:100% 100%;
        transition: .2s;
      }

      .peopleDeleteBtn:hover {
        width:20px;
        height:20px;
        // border-radius: 50%;
        background: url(./delete1.png) no-repeat;
        background-size:100% 100%;
        transition: .2s;
      }
    }
  }
}

</style>
