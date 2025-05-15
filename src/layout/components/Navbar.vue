<template>
  <div class="navbar">
<!--    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->

<!--    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>-->
<!--    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>-->

    <div class="topmenu-container">
    <sidebar-logo v-if="showLogo" :collapse="isCollapse"></sidebar-logo>
    </div>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <span class="right-menu-items">您好, {{nickName}} </span> <!-- 您好, 用户昵称, 部门名称(包含上级部门名称) -->
<!--        <span class="right-menu-items">您好, {{nickName}} {{deptLable}}</span> &lt;!&ndash; 您好, 用户昵称, 部门名称(包含上级部门名称) &ndash;&gt;-->
<!--        <el-button type="text" class="right-menu-item"><svg-icon icon-class="待办" style="font-size: 15px" class-name='custom-class' /><el-link type="primary"><router-link to="/task/stay">待办任务</router-link></el-link></el-button>-->
        <el-button type="text" class="right-menu-item"><svg-icon icon-class="个人中心" style="font-size: 15px" class-name='custom-class' /><el-link type="primary"><router-link to="/user/profile">个人中心</router-link></el-link></el-button>
        <el-button type="text" @click.native="logout" class="right-menu-item"><svg-icon icon-class="注销" style="font-size: 15px" class-name='custom-class' /><el-link type="primary">注销</el-link></el-button>
        <el-button type="text" :class="dark ? 'el-icon-moon' : 'el-icon-sunny'" class="right-menu-item" @click.native="toDark(null)"/>
        <el-tooltip content="全局搜索" effect="dark" placement="bottom">
        <search id="header-search" class="right-menu-item" />
        </el-tooltip>
        <!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
        <!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->
        <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>
<!--        <el-tooltip content="布局大小" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
<!--          <el-dropdown-item divided @click.native="logout">-->
<!--            <span>退出登录</span>-->
<!--          </el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import SidebarLogo from "@/layout/components/Sidebar/Logo";
import {getUser} from "@/api/system/user";
import * as huacai from "@/utils/huacai";
import {getDept} from "@/api/system/dept";
import {dark} from "@/settings";
import {toDark} from "@/utils/dark-css";

export default {
  components: {
    SidebarLogo,
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  computed: {
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  created() {
    this.getUserNickName()
  },
  data() {
    return {
      nickName: null,
      deptLable: null,// 当前登录用户的部门详细名称(包含上级名称)
      dark: this.$store.getters.dark
    }
  },
  methods: {
    toDark(dark) {
      if (dark == null) {
        //如果没有指定则翻转
        dark = this.dark = !this.dark;
      }
      toDark(dark);
      //发生了改变 进行存储
      if (dark != this.$store.getters.dark) {
        this.$store.dispatch("settings/changeSetting", {
          key: "dark",
          value: dark
        });
      }
    },
    dark() {
      return dark
    },
    getUserNickName() {
      getUser(this.$store.state.user.id).then(res => {
        this.nickName = res.data.nickName
        this.getFullDeptLabel(res.data.dept.deptId).then(fullLabel => {
          this.deptLable = fullLabel; // 获取当前登录用户的部门详细名称(包含上级名称)
        });
      })
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
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 10px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #1C56BA;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .right-menu-items {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 15px;
      color: #1C56BA;
      vertical-align: text-bottom;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
