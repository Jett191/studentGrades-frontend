<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px;">
      <!-- 工具栏 -->
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" />
      <!-- 编辑器 -->
      <Editor :style="styles" :defaultConfig="editorConfig" v-model="html" @onChange="onChange"
              @onCreated="onCreated" />
    </div>
  </div>
</template>

<script>
import {Editor,Toolbar} from '@wangeditor/editor-for-vue'
import {getToken} from "@/utils/auth";
import axios from 'axios'
export default {
  name: 'MyEditor',
  components: {
    Editor,
    Toolbar
  },
  props: {
    /* 编辑器的内容 */
    value:{
      type: String,
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 上传文件大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    }

  },
  //监控传参，及时更新为新值
  watch: {
    value: {
      handler(val) {
        if (val !== this.html) {
          this.html = val === null ? "" : val;
        }
      },
      immediate: true,
    },
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  data() {
    return {
      editor: null,
      currentValue:"",
      html:"",
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
        excludeKeys: ['fullScreen', 'uploadVideo'], //隐藏 全屏按钮, 撤销按钮, 重做按钮
        // excludeKeys: ['fullScreen', 'undo', 'redo', 'uploadVideo'], //隐藏 全屏按钮, 撤销按钮, 重做按钮
      },
      showUpload: false, //是否显示上传对话框
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址

      headers: {
        Authorization: "Bearer " + getToken(),
        "Content-Type": "multipart/form-data"
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.update
          },
          // 继续其他菜单配置...
        }

      }
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      this.$emit("input", this.html)// onChange 时获取编辑器最新内容
    },
    insertTextHandler() {
      const editor = this.editor
      if (editor == null) return
      editor.insertText(' hello ')
    },
    printEditorHtml() {
      const editor = this.editor
      if (editor == null) return
    },
    disableHandler() {
      const editor = this.editor
      if (editor == null) return
      editor.disable()
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    //自定义上传图片
    update(file, insertFn) {
      if (this.handleBeforeUpload(file)) {
        let form = new FormData();

        form.append('file', file)
        axios({
          method: 'post',
          url: this.uploadUrl,
          data: form,
          headers: this.headers
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            console.log("上传成功")
            let url = process.env.VUE_APP_BASE_API + res.data.fileName
            insertFn(url)
          } else {
            this.$modal.msgError("图片插入失败");
          }
        })
      }
    },
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  },


}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
  strong, strong * {
    font-weight: bold !important;
  }
  em, em * {
    font-style: italic !important;
  }
  h1, h1 * {
    font-size: 32px !important;
    font-weight: bold !important;
  }
  h2, h2 * {
    font-size: 24px !important;
    font-weight: bold !important;
  }
  h3, h3 * {
    font-size: 18.72px !important;
    font-weight: bold !important;
  }
  h4, h4 * {
    font-size: 16px !important;
    font-weight: bold !important;
  }
  h5, h5 * {
    font-size: 13.28px !important;
    font-weight: bold !important;
  }
</style>
