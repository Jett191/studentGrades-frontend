import request from '@/utils/request'

// 查询课程评价列表
export function listKcpj(query) {
  return request({
    url: '/xscj/kcpj/list',
    method: 'get',
    params: query
  })
}

// 查询课程评价详细
export function getKcpj(kcpjId) {
  return request({
    url: '/xscj/kcpj/' + kcpjId,
    method: 'get'
  })
}

// 新增课程评价
export function addKcpj(data) {
  return request({
    url: '/xscj/kcpj',
    method: 'post',
    data: data
  })
}

// 修改课程评价
export function updateKcpj(data) {
  return request({
    url: '/xscj/kcpj',
    method: 'put',
    data: data
  })
}

// 删除课程评价
export function delKcpj(kcpjId) {
  return request({
    url: '/xscj/kcpj/' + kcpjId,
    method: 'delete'
  })
}
