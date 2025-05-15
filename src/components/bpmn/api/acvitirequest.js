import request from '@/utils/request'


/**
 * 通过stringBPMN添加流程定义
 */
export function addDeploymentByString(data) {
    return request({
        url: '/processDefinition/myAddDeploymentByString',
        method: 'post',
        data: data
    })
}

/**
 * 流程定义列表查询
 * @param {*} query 
 */
export function listBasicLib(query) {
    return request({
      url: '/basicLib/basicLib/list',
      method: 'get',
      params: query
    })
  }