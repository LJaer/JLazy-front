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

/**
 * 新增或修改部门
 */
export const saveOrUpdateDept = (params) => {
  return axios.request({
    url: 'department/saveOrUpdate',
    method: 'post',
    params: params
  })
}

/**
 * 根据ids删除
 */
export const removeByIds = (params) => {
  return axios.request({
    url: 'department/removeByIds',
    method: 'get',
    params: params
  })
}

/**
 * 根据id查询
 */
export const selectById = (params) => {
    return axios.request({
      url: 'department/selectById',
      method: 'get',
      params: params
    })
  }

