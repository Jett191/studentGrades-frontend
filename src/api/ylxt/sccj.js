import request from '@/utils/request'

// 查询生产厂家列表
export function listSccj(query) {
  return request({
    url: '/ylxt/sccj/list',
    method: 'get',
    params: query
  })
}

// 查询生产厂家详细
export function getSccj(sccjId) {
  return request({
    url: '/ylxt/sccj/' + sccjId,
    method: 'get'
  })
}

// 新增生产厂家
export function addSccj(data) {
  return request({
    url: '/ylxt/sccj',
    method: 'post',
    data: data
  })
}

// 修改生产厂家
export function updateSccj(data) {
  return request({
    url: '/ylxt/sccj',
    method: 'put',
    data: data
  })
}

// 删除生产厂家
export function delSccj(sccjId) {
  return request({
    url: '/ylxt/sccj/' + sccjId,
    method: 'delete'
  })
}

//不分页查询生产厂家列表
export function selectScCjList() {
  return request({
    url: '/ylxt/sccj/selectScCjList',
    method: 'get'
  })
}
