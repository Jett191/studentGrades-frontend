import request from '@/utils/request'

// 启动流程
export function startTask(query) {
  return request({
    url: '/task/startTask',
    method: 'get',
    params: query
  })
}

// 撤销流程
export function revokeProcess(params) {
  return request({
    url: '/task/revokeProcess',
    method: 'get',
    params: params
  })
}

//查询我的代办任务
export function selectMyTask(query) {
  return request({
    url: '/task/selectMyTask',
    method: 'get',
    params: query
  })
}

//拾取任务
export function claimTask(taskId) {
  return request({
    url: '/task/claimTask',
    method: 'get',
    params: {
      taskId:taskId
    }
  })
}


//归还任务
export function unClaimTask(taskId) {
  return request({
    url: '/task/unClaimTask',
    method: 'get',
    params: {
      taskId:taskId
    }
  })
}


//查询任务组数据
export function selectGroupTask(query) {
  return request({
    url: '/task/selectGroupTask',
    method: 'get',
    params: query
  })
}

//审核通过任务
export function passTask(data) {
  return request({
    url: '/task/passTask',
    method: 'post',
    data: data
  })
}

//任务驳回
export function fallBackTask(data) {
  return request({
    url: '/task/fallBackTask',
    method: 'post',
    data: data
  })
}


/**
 * 查询历史审批记录
 * @param query
 * @returns {AxiosPromise}
 */

export function selectHistory(query) {
  return request({
    url: '/task/selectHistory',
    method: 'get',
    params: query
  })
}
//查询之前的节点
export function selectBefore(query) {
  return request({
    url: '/task/selectBefore',
    method: 'get',
    params: query
  })
}
//查询之前的节点
export function fallBackTaskByTaskDefinitionKey(query) {
  return request({
    url: '/task/fallBackTaskByTaskDefinitionKey',
    method: 'get',
    params: query
  })
}

