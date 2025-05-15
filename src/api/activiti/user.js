import request from '@/utils/request'
// 查询用户列表
export function listUsersToWorkflow() {
    return request({
      url: '/user/listUsersToWorkflow',
      method: 'get'
    })
  }


  // 查询角色列表
export function queryAllSysRole() {
    return request({
      url: '/user/queryAllSysRole',
      method: 'get'
    })
  }