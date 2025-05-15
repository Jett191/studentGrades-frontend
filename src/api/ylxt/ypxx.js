import request from '@/utils/request'

// 查询药品信息列表
export function listYpxx(query) {
  return request({
    url: '/ylxt/ypxx/list',
    method: 'get',
    params: query
  })
}

// 查询药品信息详细
export function getYpxx(ypxxId) {
  return request({
    url: '/ylxt/ypxx/' + ypxxId,
    method: 'get'
  })
}

// 新增药品信息
export function addYpxx(data) {
  return request({
    url: '/ylxt/ypxx',
    method: 'post',
    data: data
  })
}

// 修改药品信息
export function updateYpxx(data) {
  return request({
    url: '/ylxt/ypxx',
    method: 'put',
    data: data
  })
}

// 删除药品信息
export function delYpxx(ypxxId) {
  return request({
    url: '/ylxt/ypxx/' + ypxxId,
    method: 'delete'
  })
}
