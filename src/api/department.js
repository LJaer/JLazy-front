import axios from '@/libs/api.request'

/**
 * 获取所有部门
 */
export const getDepByParentId = (params) => {
  return axios.request({
    url: 'department/getDepByParentId',
    method: 'get',
    params: params
  })
}

/**
 * 根据名称查询部门
 */
export const getDepByDepName = (params) => {
  return axios.request({
    url: 'department/getDepByDepName',
    method: 'get',
    params: params
  })
}