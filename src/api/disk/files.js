import request from '@/utils/request'

// 查询网盘文件列表
export function listFiles(query) {
  return request({
    url: '/disk/files/list',
    method: 'get',
    params: query
  })
}

// 查询网盘文件列表 (图片)
export function listImageFiles(query) {
  return request({
    url: '/disk/files/list/image',
    method: 'get',
    params: query
  })
}

// 查询网盘文件列表 (文档)
export function listWdFiles(query) {
  return request({
    url: '/disk/files/list/wd',
    method: 'get',
    params: query
  })
}

// 查询网盘文件列表 (文档)
export function listMp4Files(query) {
  return request({
    url: '/disk/files/list/mp4',
    method: 'get',
    params: query
  })
}

// 查询网盘文件列表 (压缩)
export function listZipFiles(query) {
  return request({
    url: '/disk/files/list/zip',
    method: 'get',
    params: query
  })
}

// 查询网盘文件详细
export function getFiles(filesId) {
  return request({
    url: '/disk/files/' + filesId,
    method: 'get'
  })
}

// 新增网盘文件
export function addFiles(data) {
  return request({
    url: '/disk/files',
    method: 'post',
    data: data
  })
}

// 新增网盘文件夹
export function addFolder(data) {
  return request({
    url: '/disk/files/addFolder',
    method: 'post',
    data: data
  })
}

// 修改网盘文件
export function updateFiles(data) {
  return request({
    url: '/disk/files',
    method: 'put',
    data: data
  })
}

// 删除网盘文件
export function delFiles(filesId) {
  return request({
    url: '/disk/files/' + filesId,
    method: 'delete'
  })
}
