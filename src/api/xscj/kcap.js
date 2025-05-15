import request from '@/utils/request'

// 查询课程安排列表
export function listKcap(query) {
  return request({
    url: '/xscj/kcap/list',
    method: 'get',
    params: query
  })
}

// 查询课程安排详细
export function getKcap(kcapId) {
  return request({
    url: '/xscj/kcap/' + kcapId,
    method: 'get'
  })
}

// 新增课程安排
export function addKcap(data) {
  return request({
    url: '/xscj/kcap',
    method: 'post',
    data: data
  })
}

// 修改课程安排
export function updateKcap(data) {
  return request({
    url: '/xscj/kcap',
    method: 'put',
    data: data
  })
}

// 删除课程安排
export function delKcap(kcapId) {
  return request({
    url: '/xscj/kcap/' + kcapId,
    method: 'delete'
  })
}
