<template>
  <div class="login">
    <video autoplay muted loop id="bg-video">
      <source src="../assets/media/index-back.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div style="right: 0;top: 0;position: absolute;">
      <lang-select />
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ $t('login.title') }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">{{ $t('login.rememberMe') }}</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">{{ $t('login.logIn') }}</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">{{ $t('login.register') }}</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
<!--    <div class="el-login-footer">-->
<!--      <span>Copyright © 2024-20xx 学生成绩信息管理系统.</span>-->
<!--    </div>-->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import LangSelect from "@/components/LangSelect";

export default {
  name: "Login",
  components: {LangSelect},
  data() {
    return {
      lang: true,
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    lang: {
      handler: function (newValue, oldValue) {
        console.log(newValue, oldValue)
        if (newValue === true) {
          Cookies.set("lang", "zh_CN")
        } else {
          Cookies.set("lang", "en_US")
        }
      },
    }
  },
  created() {
    this.getCode();
    this.getCookie();
    this.getLang();
    // 禁止代码调试
    // (() => {
    //   function block() {
    //     if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
    //       document.body.innerHTML = "检测到非法调试,请关闭后刷新重试!";
    //     }
    //     setInterval(() => {
    //       (function () {
    //         return false;
    //       }
    //         ['constructor']('debugger')
    //         ['call']());
    //     }, 50);
    //   }
    //
    //   try {
    //     block();
    //   } catch (err) {
    //   }
    // })();
  },
  methods: {
    getLang() {
      let lang = Cookies.get("lang")
      if (lang == null || lang === '') {
        Cookies.set("lang", "zh_CN")
        this.lang = true  //中文
      }
      if (lang === 'zh_CN') {
        this.lang = true;
      } else if (lang === 'en_US') {
        this.lang = false;
      }
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.color-main {
  color: #409EFF;
}
.font-extra-large {
  font-size: 20px;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 全屏高度 */
  position: relative;
  overflow: hidden;
}

#bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: -1; /* 确保视频在背景 */
}

.title {
  margin: 20px auto 30px auto;
  text-align: center;
  font-size: 24px; /* 增加标题字体大小 */
  color: #1C56BA; /* 标题颜色 */
}

.login-form {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  width: 400px;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 柔和的阴影效果 */
  z-index: 1; /* 确保表单在视频上方 */
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 60px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #070000;
  font-family: Arial,ui-serif;
  font-size: 16px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 35px;
}

.register-link {
  text-align: right;
  margin-top: 20px;
}

.link-type {
  color: #409EFF;
  text-decoration: underline;
}
</style>
