import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

//vxetable
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'


import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import { renderContent, getCurrentDate, extractFirstTwoLevels } from "@/utils/huacai";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
// import Editor from "@/components/Editor"
import Editor from "@/components/WangEidtor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
// DataV大屏组件
import dataV from '@jiaminghi/data-view'
// vue-qr生成二维码组件

// 强制通过filter翻转实现暗黑模式，修改设置后需要重启页面
if (store.getters.dark) {
  toDark(true);
}


import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

import i18n from './lang'
Vue.use(VueQuillEditor, );
Vue.use(dataV)
//vxetable组件
Vue.use(VXETable)


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.renderContent = renderContent //给一级节点和所有下级节点设置不同的图标
Vue.prototype.getCurrentDate = getCurrentDate //获取当前日期 年-月-日
Vue.prototype.extractFirstTwoLevels = extractFirstTwoLevels //遍历树形结构并只保留第一级和第二级的数据

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

// 全局注册组件
import ElementTreeLine from 'element-tree-line';
// css
import 'element-tree-line/dist/style.css';
Vue.component(ElementTreeLine.name, ElementTreeLine);


/** 流程定义样式列表 */
import 'reset.css/reset.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import {toDark} from "@/utils/dark-css";

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

// 带有斑马纹
Element.Table.props.stripe = {
  default:true,
  type:Boolean
}

// 带有边框
Element.Table.props.border = {
  default:true,
  type:Boolean
}
