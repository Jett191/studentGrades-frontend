import request from '@/utils/request'

// 查询modeler列表
export function listDefinition(query) {
  return request({
    url: '/processDefinition/list',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getDefinitionsByInstanceId(instanceId) {
  return request({
    url: '/processDefinition/getDefinitions/' + instanceId,
    method: 'get'
  })
}

// 挂起激活转换
export function suspendOrActiveApply(data) {
  return request({
    url: '/processDefinition/suspendOrActiveApply',
    method: 'post',
    data:data
  })
}


// 删除Modeler
export function delDefinition(id,category) {
  return request({
    url: '/processDefinition/remove/' + id+'/'+category,
    method: 'delete'
  })
}

//获取流程定义xml
export function getDefineXml(query) {
  return request({
    url: '/processDefinition/getDefinitionXML',
    method: 'get',
    params: query
  })
}

//获取流程定义xml
export function getMyProcessDefineXml(query) {
  return request({
    url: '/processDefinition/getMyProcessDefineXml',
    method: 'get',
    params: query
  })
}

/**
 * 获取高亮节点信息
 */
export function gethighLine(query){
  return request({
    url: '/activitiHistory/gethighLine',
    method: 'get',
    params: query
  })
}

/**
 * 获取流程流转过程中的评论信息
 */
export function getWorkFlowComment(query){
  return request({
    url: '/workflow/comment/getWorkFlowComment',
    method: 'get',
    params: query
  })
}
/**
 * 获取合伙人的Id 种类
 */
export function getProcessCompanyInfo(query){
  return request({
    url: '/processDefinition/getProcessCompanyInfo',
    method: 'get',
    params: query
  })
}
/**
 * 流程部署
 */
export function uploadStreamAndDeployment2(data){
  return request({
    url: '/processDefinition/uploadStreamAndDeployment2',
    method: 'post',
    data: data
  })
}
/**流程定义版本号 */
export function getProcessVersion(query){
  return request({
    url: '/processDefinition/getProcessVersion',
    method: 'get',
    params: query
  })
}



//获取流程定义xml
export function findPicture(processInstanceId) {
  return request({
    url: '/processDefinition/findPicture',
    method: 'get',
    params: {
      processInstanceId:processInstanceId
    }
  })
}
//http://localhost:8080/processDefinition/getDefinitionXML
export function getOneActivityVoByProcessInstanceIdAndActivityId(params) {
  return request({
    url: '/processDefinition/getOneActivityVoByProcessInstanceIdAndActivityId',
    method: 'get',
    params: {
      procInstId: params.procInstId,
      elementId: params.elementId
    }
  })
}
//getHighLightedNodeVoByProcessInstanceId
export function getHighLightedNodeVoByProcessInstanceId(params) {
  return request({
    url: '/processDefinition/getHighLightedNodeVoByProcessInstanceId',
    method: 'get',
    params: {
      instanceId: params.instanceId,
      procDefId: params.procDefId
    }
  })
}

export function findNodeInfo(processInstanceId,activityId) {
  return request({
    url: '/processDefinition/findNodeInfo',
    method: 'get',
    params: {
      processInstanceId:processInstanceId,
      activityId:activityId
    }
  })
}


