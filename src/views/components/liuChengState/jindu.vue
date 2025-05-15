<template>
  <vxe-modal title="办理轨迹" v-model="dialogVisible" v-if="dialogVisible" width="60%" height="60vh" esc-closable show-zoom
             resize>

    <el-tabs tab-position="top" v-model="activeName" @tab-click="handleTabClick">

      <el-tab-pane name="zzGc">
        <span slot="label"><i class="el-icon-date"></i> 追踪过程</span>
        <el-table v-if="activeName === 'zzGc'"
          :data="historyList" style="width: 100%" border
          :header-cell-style="{background:'#d0cece',color:'#000000',fontWeight:'bold'}">
          <el-table-column label="序号" align="center" type="index"/>
          <el-table-column align="center" prop="taskName" label="节点名称" width="180"></el-table-column>
          <el-table-column align="center" prop="endTime" label="执行时间">
            <template slot-scope="scope">
              <span>{{ formatTime(scope.row.endTime || scope.row.startTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="nickName" label="执行人" width="180"></el-table-column>
          <el-table-column align="center" prop="comment" label="审核意见"></el-table-column>
        </el-table>
<!--        <el-timeline :reverse="false">-->
<!--          <el-timeline-item-->
<!--            v-for="(activity, index) in historyList"-->
<!--            :key="index"-->
<!--            :timestamp="'执行时间： ' + formatTime( activity.endTime || activity.startTime)">-->
<!--            {{'节点名称： ' + activity.taskName}}-->
<!--          </el-timeline-item>-->
<!--        </el-timeline>-->
      </el-tab-pane>

      <el-tab-pane name="spLc">

        <span slot="label"><i class="el-icon-date"></i> 审批流程图</span>
        <!-- <el-card class="box-card">
          <div style="background-color: #e7f0f8" class="centered-content" v-html="pictureXml"></div>
        </el-card> -->
        <template>
          <div>
            <div class="bpmn-viewer-container">
              <!--    <div-->
              <!--      style="width:100%;height:20px;position: absolute; left: 20px; top: 10px; color: #000000D9;font-size: 16px;font-weight: 500">-->
              <!--      {{title}}-->
              <!--    </div>-->
              <div style="position: absolute; z-index: 99999999999;right: 0;">
                <el-button-group key="scale-control">
                  <el-tooltip effect="light" content="缩小视图">
                    <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" icon="el-icon-zoom-out"
                               @click="processZoomOut()"/>
                  </el-tooltip>
                  <el-button :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + '%' }}</el-button>
                  <el-tooltip effect="light" content="放大视图">
                    <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" icon="el-icon-zoom-in"
                               @click="processZoomIn()"/>
                  </el-tooltip>
                  <el-tooltip effect="light" content="重置视图并居中">
                    <el-button :size="headerButtonSize" icon="el-icon-c-scale-to-original" @click="processReZoom()"/>
                  </el-tooltip>
                </el-button-group>
              </div>

              <div id="bpmnCanvas" style="width:100%;height:400px;margin: 0 auto;" ref="canvas"></div>

              <Popover overlayClassName="flowMsgPopover" ref="flowMsgPopover" :visible="true">
                <template #title>
                  <h1 class="popover-title">{{ detailInfo.name }}</h1>
                </template>
                <template #content>
                  <p v-if="detailInfo.activityName != null && detailInfo.activityName !== '' && detailInfo.activityName !== 'undefined'">节点名称：{{ detailInfo.activityName || "" }}</p>
                  <p>

                    <Tag
                      v-if="detailInfo.activityName != null && detailInfo.activityName !== '' && detailInfo.activityName !== 'undefined'"
                      color="processing" style="margin-right: 4px;margin-bottom: 4px;"
                      v-for="item in detailInfo.approver.split(';')" :key="item">{{ item }}
                    </Tag>
                  </p>
                  <p v-if="detailInfo.activityName != null && detailInfo.activityName !== '' && detailInfo.activityName !== 'undefined'">执行时间：{{ formatTime(detailInfo.endTime) || "" }}</p>

                </template>
              </Popover>
            </div>
          </div>
        </template>
      </el-tab-pane>

    </el-tabs>

  </vxe-modal>
</template>
<script>
import {
  getHighLightedNodeVoByProcessInstanceId,
  getOneActivityVoByProcessInstanceIdAndActivityId
} from "@/api/activiti/definition.js";
import {selectHistory} from "@/api/activiti/task";
import {Affix, Button, Popover, Space, Spin, Tag} from "ant-design-vue";
import {MinusCircleOutlined, OneToOneOutlined, PlusCircleOutlined} from '@ant-design/icons-vue';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import overlays from 'diagram-js/lib/features/overlays/Overlays.js'

let bpmnViewer = null;
export default {
  props: {
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    reviewObj: {
      type: Object
    }
  },
  components: {
    Tag, Spin, Popover, Button, Space, Affix,
    RadioButtonGroup: Button.RadioButtonGroup,
    PlusCircleOutlined, MinusCircleOutlined, OneToOneOutlined
  },
  data() {
    return {
      bpmnViewer: null,
      container: null,
      canvas: null,
      dialogVisible: false,
      rowData: null,
      pictureXml: null,
      activeName: 'zzGc',
      historyList: [], //追踪过程信息
      detailInfo: {approver: ''},
      executedLightNode: [],
      highlightLine: [],
      activeLightNode: [],
      modelName: '',
      defaultZoom: 1,
      nodeDetail: {},
      scale: 1,
      title: "流程预览",
      instanceId: undefined
    };
  },
  mounted() {
    //debugger;
    this.initPage(this.instanceId);
    //this.getTitle();
  },
  created() {
  },
  methods: {
    handleTabClick(tab, event) {
      console.log('当前标签页名称:', tab.name);
      if (tab.name === 'spLc') {
        this.initPage(this.instanceId);
      }
      console.log('触发事件:', event);
    },
    initPage(instanceId, procDefId) {
      //const containerEl = document.getElementById('bpmnCanvas')
      const canvas = this.$refs.canvas;
      bpmnViewer && bpmnViewer.destroy();
      bpmnViewer = new BpmnViewer({
        container: canvas,
        width: '100%',
        additionalModules: [
          MoveCanvasModule // 移动整个画布
        ]
      });
      // debugger;
      // this.modelName = 'xxxxxxxxx';
      // getHighLightedNodeVoByProcessInstanceId({"instanceId":instanceId,'procDefId':procDefId}).then(res=>{

      //     if(res.code === 200){
      //         this.title = "流程图-"+res.data.modelName;
      //         this.highlightLine = res.data.highlightedFlowIds
      //         this.executedLightNode = res.data.executedActivityIds
      //         this.activeLightNode = res.data.activeActivityIds
      //         if(bpmnViewer) {
      //             this.importXml(res.data.modelXml);
      //            // this.importXml(res);
      //         }
      //     } else {
      //         this.$message({
      //             message: res.resultMessage,
      //             type: 'error'
      //         });
      //     }

      // });
      //以下注释代码是只展示流程图不需要高亮展示
      // if(bpmnViewer){
      //     this.importXml(this.reviewObj.modelXml);
      // } else {
      //     console.error('bpmnViewer is null or undefined!');
      // }
      //******************************** */
      //version2
      this.instanceId = instanceId
      let len = document.getElementsByTagName('svg').length
      // document.getElementsByTagName('svg')[len-2].setAttribute('display', 'none')
      if (instanceId || procDefId) {
        getHighLightedNodeVoByProcessInstanceId({'instanceId': instanceId, 'procDefId': procDefId}).then(res => {
          if (res.code === 200) {
            this.title = res.data.modelName
            this.highlightLine = res.data.highlightedFlowIds
            this.executedLightNode = res.data.executedActivityIds
            this.activeLightNode = res.data.activeActivityIds
            if (bpmnViewer) {
              this.importXml(res.data.modelXml)
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }

        })
      }


    },

    getHtmlAttr(source, element, attr) {
      let result = [];
      let reg = "<" + element + "[^<>]*?\\s" + attr + "=['\"]?(.*?)['\"]?\\s.*?>";
      let matched = source.match(new RegExp(reg, "gi"));

      matched && matched.forEach(item => {
        item && result.push(item);
      });
      return result;
    },

    async importXml(modelXml) {
      // 处理排他网关， 注：流程图预览时，排他网关需要在对应的<bpmndi:BPMNShape>节点上添加属性isMarkerVisible="true"
      let gatewayIds = this.getHtmlAttr(modelXml, 'exclusiveGateway', 'id')
      let modelXmlTemp = modelXml
      if (gatewayIds && gatewayIds.length > 0) {
        gatewayIds.forEach(item => {
          const result = new RegExp('id="(.+?)"').exec(item)
          if (result && result[1]) {
            modelXmlTemp = modelXmlTemp.replace('bpmnElement="' + result[1] + '"', 'bpmnElement="' + result[1] + '" isMarkerVisible="true"')
          }
        })
      }
      bpmnViewer.importXML(modelXmlTemp, (err) => {
        if (err) {
          console.error(err, 1111)
        } else {
          this.importXmlSuccess()
        }
      })
    },

    importXmlSuccess() {
      // 使流程图自适应屏幕
      let canvas = bpmnViewer.get('canvas');
      canvas.zoom("fit-viewport", "auto");
      canvas.zoom(1.02); //缩写至1.02倍
      //设置高亮线和高亮节点,需要配合style中的css样式一起使用，否则没有颜色
      this.setViewerStyle(canvas);
      // debugger;
      //给任务节点加聚焦和离焦事件
      this.bindEvents();


    },

    setViewerStyle(canvas) {
      let highlightNodes = this.highlightNode;
      if (highlightNodes && highlightNodes.length > 0) {					//节点高亮
        highlightNodes.forEach(item => {
          canvas.addMarker(item, 'highlight');
          const ele = document.querySelector('.highlight').querySelector('.djs-visual rect');
          if (ele) {
            ele.setAttribute('stroke-dasharray', '4,4');
          }
        });
      }
      let highlightLines = this.highlightLine;
      //顺序线高亮
      if (highlightLines && highlightLines.length > 0) {
        highlightLines.forEach(item => {
          canvas.addMarker(item, 'highlight-line');
        });
      }
      //已完成节点高亮
      let executedLightNode = this.executedLightNode
      if (executedLightNode && executedLightNode.length > 0) {
        executedLightNode.forEach(item => {
          canvas.addMarker(item, 'highlight-executed')
        })
      }
      let activeLightNode = this.activeLightNode
      if (activeLightNode && activeLightNode.length > 0) {
        activeLightNode.forEach((item, index) => {
          canvas.addMarker(item, 'highlight')
        })
        document.querySelectorAll('.highlight').forEach((item, index) => {
          item.querySelector('.djs-visual rect').setAttribute('stroke-dasharray', '4,4')
        })
      }
    },
    //悬浮框设置
    genNodeDetailBox(e, overlays) {
      let tempDiv = document.createElement("div");

      let popoverEl = document.querySelector('.flowMsgPopover');
      //let popoverEl = this.$refs.flowMsgPopover;
      console.log(this.detailInfo);
      tempDiv.innerHTML = popoverEl.innerHTML;
      tempDiv.className = 'tipBox';
      tempDiv.style.width = '260px';
      tempDiv.style.background = 'rgba(185,181,181,0.6)';
      overlays.add(e.element.id, {
        position: {top: e.element.height, left: 0},
        html: tempDiv
      });
    },
    // 以下代码为：为节点注册鼠标悬浮事件
    bindEvents() {

      let eventBus = bpmnViewer.get('eventBus');
      let overlays = bpmnViewer.get('overlays');
      eventBus.on('element.hover', (e) => {
        if (e.element.type === "bpmn:UserTask") {
          if (this.nodeDetail[e.element.id]) {
            this.detailInfo = this.nodeDetail[e.element.id];
            //悬浮框不能直接调用,因为这样调用的话popoverEl.innerHTML一直获取的是上一条数据，因为每次在调用这个方法的时候其实popover标签的变量还没有渲染
            //this.genNodeDetailBox(this.nodeDetail[e.element.id], e, overlays);
            //任何修改data的语句后,页面渲染用setTimeout(function(){console.log(233)},0)就可以了
            setTimeout(() => {
              console.log("节点类型:" + e.element.type);
              if (e.element.type === "bpmn:UserTask") {
                this.genNodeDetailBox(e, overlays);
              }
            }, 10)
          } else {

            // getOneActivityVoByProcessInstanceIdAndActivityId({procInstId:this.instanceId, elementId: e.element.id}).then(res => {
            //   //res.data.approver="1;2";
            //     this.detailInfo = res.data;
            //     // this.genNodeDetailBox(e, overlays);
            //     setTimeout(() => {
            //         console.log("节点类型:"+e.element.type);
            //         if(e.element.type === "bpmn:UserTask" ){
            //             this.genNodeDetailBox(e, overlays);
            //         }
            //     },10)
            // })
            // 查询详细信息
            // findNodeInfo(this.rowData.processInstanceId, element.id).then(res => {
            //   //console.log(res, "[[[[[[[");
            //   this.detailInfo = res.data;
            // });
          }
        }
      });
      eventBus.on('element.out', (e) => {
        overlays.clear();
      });

    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;

      bpmnViewer.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      this.defaultZoom = newZoom;
      bpmnViewer.get("canvas").zoom(this.defaultZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;

      bpmnViewer.get("canvas").zoom("fit-viewport", "auto");
    },

    formatTime(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    handleOpen(row) {
      this.activeName = 'zzGc';
      this.dialogVisible = true;
      this.rowData = row;
      this.pictureXml = null;
      setTimeout(() => {
        this.getXmlData();
      }, 10);
    },
    getXmlData() {
      this.instanceId = this.rowData.processInstanceId;
      //console.table(this.rowData);
      this.initPage(this.rowData.processInstanceId, null)
      // getHighLightedNodeVoByProcessInstanceId({"deploymentId":"82e474c7-f718-11ee-88e9-14755be29626"}).then(res=>{
      // findPicture(this.rowData.processInstanceId).then(res => {
      //   console.log(res, "0623========");
      //  // this.pictureXml = res;
      // });
      // 根据行数据获取历史记录，这里使用您之前的方法获取历史记录的数据
      selectHistory({processInstanceId: this.rowData.processInstanceId}).then(res => {
        // console.table(res.data)
        this.historyList = res.data;
      }).catch(error => {
        console.error('获取历史记录时出错:', error);
      });
    }
  }
};
</script>

<style lang="scss">
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保父元素高度充满以达到垂直居中 */
}

.box-card {
  /* 确保el-card的高度适应其内容或设定一个固定高度以便于垂直居中生效 */
  display: flex;
  flex-direction: column;
}

@import '../../../../node_modules/bpmn-js/dist/assets/diagram-js.css';
@import '../../../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import '../../../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '../../../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
@import '../../../../node_modules/bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

.bjs-powered-by {
  display: none;
}

.flowMsgPopover {
  display: none;
}

.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgb(251, 233, 209) !important; /* color elements as green */
}

.highlight g.djs-visual > :nth-child(1) {
  stroke: rgb(214, 126, 125) !important;
}

.highlight-executed g.djs-visual > :nth-child(1) {
  stroke: rgb(0, 190, 0, 1) !important;
  fill: rgb(180, 241, 180) !important;
}

.highlight-line g.djs-visual > :nth-child(1) {
  stroke: rgb(0, 190, 0) !important;
}

@-webkit-keyframes dynamicNode {
  to {
    stroke-dashoffset: 100%;
  }
}

.highlight {
  .djs-visual {
    -webkit-animation: dynamicNode 18S linear infinite;
    -webkit-animation-fill-mode: forwards;
  }
}

.tipBox {
  width: 300px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  /*.ant-popover-arrow{
      display: none;
  }*/
  p {
    line-height: 28px;
    margin: 0;
    padding: 0;
  }
}
</style>
