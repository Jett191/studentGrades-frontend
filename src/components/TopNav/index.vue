<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    background-color="#1c56ba"
    @select="handleSelect"
    class="topmenu-container"
  >
    <!-- 顶部菜单绑定click事件 -->
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        :style="{'--theme': theme}"
        :index="item.path"
        :key="index"
        @click="clickItem(item)"
        v-if="index < visibleNumber"
        class="menu-item"
      >
        <svg-icon :icon-class="item.meta.icon" class="menu-icon" />
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu
      :style="{'--theme': theme}"
      index="more"
      :key="visibleNumber"
      v-if="topMenus.length > visibleNumber"
      class="menu-item"
    >
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          @click="clickItem(item)"
          v-if="index >= visibleNumber"
          class="menu-item"
        >
          <svg-icon :icon-class="item.meta.icon" class="menu-icon" />
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { constantRoutes } from "@/router";

// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile'];

export default {
  data() {
    return {
      pathName: '', //主目录
      pathChildren: [], //目录下二级菜单列表
      // 顶部栏初始数
      visibleNumber: 5,
      // 当前激活菜单的 index
      currentIndex: undefined
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    // 顶部显示菜单
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      return topMenus;
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === "/") {
              router.children[item].path = "/" + router.children[item].path;
            } else {
              if (!this.ishttp(router.children[item].path)) {
                router.children[item].path = router.path + "/" + router.children[item].path;
              }
            }
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    // 默认激活的菜单
    activeMenu() {
      const path = this.$route.path;
      let activePath = path;
      if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
        const tmpPath = path.substring(1, path.length);
        activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        if (!this.$route.meta.link) {
          this.$store.dispatch('app/toggleSideBarHide', false);
        }
      } else if (!this.$route.children) {
        activePath = path;
        this.$store.dispatch('app/toggleSideBarHide', true);
      }
      this.activeRoutes(activePath);
      return activePath;
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.setVisibleNumber)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVisibleNumber)
  },
  mounted() {
    this.setVisibleNumber();
  },
  methods: {
    clickItem(obj) {
      this.pathChildren = []
      this.pathChildren = [...obj.children]
      this.pathName = obj.path
    },
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 20);
    },
    // 菜单选择事件
    handleSelect(key, keyPath) {
      this.currentIndex = key;
      const route = this.routers.find(item => item.path === key);
      if (this.ishttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, "_blank");
      } else if (!route || !route.children) {
        // 没有子路由路径内部打开
        const routeMenu = this.childrenMenus.find(item => item.path === key);
        if (routeMenu && routeMenu.query) {
          let query = JSON.parse(routeMenu.query);
          this.$router.push({ path: key, query: query });
        } else {
          this.$router.push({ path: key });
        }
        this.$store.dispatch('app/toggleSideBarHide', true);
      } else {
        // 显示左侧联动菜单
        this.activeRoutes(key);
        this.$store.dispatch('app/toggleSideBarHide', false);
      }
    },
    // 当前激活的路由
    activeRoutes(key) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.parentPath || (key == "index" && "" == item.path)) {
            routes.push(item);
          }
        });
      }
      if (routes.length > 0) {
        this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
      } else {
        this.$store.dispatch('app/toggleSideBarHide', true);
      }
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }
  },
  watch: {
    //监听目录
    'pathName': function (newVal) {
      if (this.pathChildren && this.pathChildren.length > 0) {
        this.$router.push({ path: this.pathChildren[0].path, });
      }
    },
  },
};
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14.45px;
  height: 60px !important;
  line-height: 1 !important;
  color: #fff !important;
  padding: 0 5px !important;
  font-weight: 500;
  text-align: center;
  width: 80px;
}

.topmenu-container.el-menu--horizontal > .el-menu-item svg-icon {
  margin-bottom: 4px; // 调整图标和文本之间的间距
  margin-top: -20px; // 将图标向上移动
  height: 24px;
  width: 24px;
}

.topmenu-container.el-menu--horizontal > .el-menu-item span {
  margin-top: 8px; // 调整文本和图标之间的间距
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 1px solid #ff0000 !important;
  background: linear-gradient(#255bbc, #838dce);
}

.topmenu-container.el-menu--horizontal > .el-menu-item:hover {
  background-color: #164595;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #{'var(--theme)'} !important;
  color: #fff;
}

/* submenu item */
.topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title {
  float: left;
  font-size: 20px;
  height: 60px !important;
  line-height: 1 !important;
  color: #fff !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}
</style>
