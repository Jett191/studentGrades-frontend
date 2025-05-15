<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" style="background-color: white">
<!--    <transition name="sidebarLogoFade">-->
<!--      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">-->
<!--        <img v-if="logo" :src="logo" class="sidebar-logo" />-->
<!--        <h1 v-else class="sidebar-title" style="color: #0A55A6">{{ title }} </h1>-->
<!--      </router-link>-->
<!--      <router-link v-else key="expand" class="sidebar-logo-link" to="/">-->
<!--        <img v-if="logo" :src="logo" class="sidebar-logo" />-->
<!--        <h1 class="sidebar-title" style="color: #0A55A6">{{ title }} </h1>-->
<!--      </router-link>-->
<!--    </transition>-->
    <router-link  class="sidebar-logo-link" to="/">
<!--      <img :src="logo" class="sidebar-logo" />-->
      <h1 class="sidebar-title" style="color: #0A55A6">{{ title }} </h1>
    </router-link>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    }
  },
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 60px;
      height: 60px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 28px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
      color: #1890ff;
    }
  }
}
</style>
