import request from '@/utils/request'

// 查询学生基本信息列表
export function listXsjbxx(query) {
  return request({
    url: '/xscj/xsjbxx/list',
    method: 'get',
    params: query
  })
}

// 查询学生基本信息详细
export function getXsjbxx(xsjbxxId) {
  return request({
    url: '/xscj/xsjbxx/' + xsjbxxId,
    method: 'get'
  })
}

// 新增学生基本信息
export function addXsjbxx(data) {
  return request({
    url: '/xscj/xsjbxx',
    method: 'post',
    data: data
  })
}

// 修改学生基本信息
export function updateXsjbxx(data) {
  return request({
    url: '/xscj/xsjbxx',
    method: 'put',
    data: data
  })
}

// 删除学生基本信息
export function delXsjbxx(xsjbxxId) {
  return request({
    url: '/xscj/xsjbxx/' + xsjbxxId,
    method: 'delete'
  })
}
