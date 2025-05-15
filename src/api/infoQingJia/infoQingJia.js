import request from '@/utils/request'

// 查询请假列表
export function listInfoQingJia(query) {
  return request({
    url: '/infoQingJia/infoQingJia/list',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getInfoQingJia(id) {
  return request({
    url: '/infoQingJia/infoQingJia/' + id,
    method: 'get'
  })
}

// 新增请假
export function addInfoQingJia(data) {
  return request({
    url: '/infoQingJia/infoQingJia',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateInfoQingJia(data) {
  return request({
    url: '/infoQingJia/infoQingJia',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delInfoQingJia(id) {
  return request({
    url: '/infoQingJia/infoQingJia/' + id,
    method: 'delete'
  })
}
