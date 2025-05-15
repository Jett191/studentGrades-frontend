import request from '@/utils/request'

// 查询课程信息列表
export function listKcxx(query) {
  return request({
    url: '/xscj/kcxx/list',
    method: 'get',
    params: query
  })
}

// 查询课程信息详细
export function getKcxx(kcxxId) {
  return request({
    url: '/xscj/kcxx/' + kcxxId,
    method: 'get'
  })
}

// 新增课程信息
export function addKcxx(data) {
  return request({
    url: '/xscj/kcxx',
    method: 'post',
    data: data
  })
}

// 修改课程信息
export function updateKcxx(data) {
  return request({
    url: '/xscj/kcxx',
    method: 'put',
    data: data
  })
}

// 删除课程信息
export function delKcxx(kcxxId) {
  return request({
    url: '/xscj/kcxx/' + kcxxId,
    method: 'delete'
  })
}

// 获取课程信息主键ID
export function getKcXxId() {
  return request({
    url: '/xscj/kcxx/getKcXxId',
    method: 'get'
  })
}

// 新增附件
export function insertKcxxFjByKcxxId(data) {
  return request({
    url: '/xscj/kcxx/add/File/By/subId',
    method: 'post',
    data: data
  })
}

// 根据主表ID查询附件列表
export function selectKcxxFjList(kcxxId) {
  return request({
    url: '/xscj/kcxx/get/FileList/By/subId?sId=' + kcxxId,
    method: 'get'
  })
}

// 删除立项文件附件
export function deleteKcxxFjByFjs(fjId) {
  return request({
    url: '/xscj/kcxx/fj/' + fjId,
    method: 'delete'
  })
}

// 不分页查询课程列表
export function selectKcList() {
  return request({
    url: '/xscj/kcxx/selectKcList',
    method: 'get'
  })
}

// 不分页查询教师列表
export function selectJsList() {
  return request({
    url: '/xscj/kcxx/selectJsList',
    method: 'get'
  })
}

// 不分页查询学生列表
export function selectXsList() {
  return request({
    url: '/xscj/kcxx/selectXsList',
    method: 'get'
  })
}
