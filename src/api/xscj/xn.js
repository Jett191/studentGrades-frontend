import request from '@/utils/request'

// 查询学年列表
export function listXn(query) {
  return request({
    url: '/xscj/xn/list',
    method: 'get',
    params: query
  })
}

// 查询学年详细
export function getXn(xnId) {
  return request({
    url: '/xscj/xn/' + xnId,
    method: 'get'
  })
}

// 新增学年
export function addXn(data) {
  return request({
    url: '/xscj/xn',
    method: 'post',
    data: data
  })
}

// 修改学年
export function updateXn(data) {
  return request({
    url: '/xscj/xn',
    method: 'put',
    data: data
  })
}

// 删除学年
export function delXn(xnId) {
  return request({
    url: '/xscj/xn/' + xnId,
    method: 'delete'
  })
}
