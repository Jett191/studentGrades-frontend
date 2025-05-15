import request from '@/utils/request'

// 查询科室管理列表
export function listGl(query) {
  return request({
    url: '/ylxt/gl/list',
    method: 'get',
    params: query
  })
}

// 查询科室管理详细
export function getGl(ksglId) {
  return request({
    url: '/ylxt/gl/' + ksglId,
    method: 'get'
  })
}

// 新增科室管理
export function addGl(data) {
  return request({
    url: '/ylxt/gl',
    method: 'post',
    data: data
  })
}

// 修改科室管理
export function updateGl(data) {
  return request({
    url: '/ylxt/gl',
    method: 'put',
    data: data
  })
}

// 删除科室管理
export function delGl(ksglId) {
  return request({
    url: '/ylxt/gl/' + ksglId,
    method: 'delete'
  })
}
