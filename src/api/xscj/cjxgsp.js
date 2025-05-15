import request from '@/utils/request'

// 查询成绩修改审批列表
export function listCjxgsp(query) {
  return request({
    url: '/xscj/cjxgsp/list',
    method: 'get',
    params: query
  })
}

// 查询成绩修改审批详细
export function getCjxgsp(cjxgspId) {
  return request({
    url: '/xscj/cjxgsp/' + cjxgspId,
    method: 'get'
  })
}

// 新增成绩修改审批
export function addCjxgsp(data) {
  return request({
    url: '/xscj/cjxgsp',
    method: 'post',
    data: data
  })
}

// 修改成绩修改审批
export function updateCjxgsp(data) {
  return request({
    url: '/xscj/cjxgsp',
    method: 'put',
    data: data
  })
}

export function updateSpTg(data) {
  return request({
    url: '/xscj/cjxgsp/updateSpTg',
    method: 'put',
    data: data
  })
}


// 删除成绩修改审批
export function delCjxgsp(cjxgspId) {
  return request({
    url: '/xscj/cjxgsp/' + cjxgspId,
    method: 'delete'
  })
}
