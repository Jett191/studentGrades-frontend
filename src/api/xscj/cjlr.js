import request from '@/utils/request'

// 查询成绩录入列表
export function listCjlr(query) {
  return request({
    url: '/xscj/cjlr/list',
    method: 'get',
    params: query
  })
}

// 查询成绩录入详细
export function selectCjTjList() {
  return request({
    url: '/xscj/cjlr/selectCjTjList',
    method: 'get'
  })
}

// 查询gpa
export function selectGpaList() {
  return request({
    url: '/xscj/cjlr/selectGpaList',
    method: 'get'
  })
}

// 查询班级成绩排名
export function selectBjCjList() {
  return request({
    url: '/xscj/cjlr/selectBjCjList',
    method: 'get'
  })
}

// 查询成绩统计
export function getCjlr(cjlrId) {
  return request({
    url: '/xscj/cjlr/' + cjlrId,
    method: 'get'
  })
}

// 学生成绩分析
export function selectXscjfx(xsName) {
  return request({
    url: '/xscj/cjlr/selectXscjfx/' + xsName,
    method: 'get'
  })
}

// 新增成绩录入
export function addCjlr(data) {
  return request({
    url: '/xscj/cjlr',
    method: 'post',
    data: data
  })
}

// 修改成绩录入
export function updateCjlr(data) {
  return request({
    url: '/xscj/cjlr',
    method: 'put',
    data: data
  })
}

// 修改成绩
export function updateXgCj(data) {
  return request({
    url: '/xscj/cjlr/updateXgCj',
    method: 'put',
    data: data
  })
}

// 删除成绩录入
export function delCjlr(cjlrId) {
  return request({
    url: '/xscj/cjlr/' + cjlrId,
    method: 'delete'
  })
}
