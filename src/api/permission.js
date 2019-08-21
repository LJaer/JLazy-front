import axios from '@/libs/api.request'

/**
 * 获取所有权限tree
 */
export const getPerByParentId = (params) => {
  return axios.request({
    url: 'permission/getPerByParentId',
    method: 'get',
    params: params
  })
}

/**
 * 根据名称查询权限tree
 */
export const getPerTreeByPerName = (params) => {
  return axios.request({
    url: 'permission/getPerTreeByPerName',
    method: 'get',
    params: params
  })
}

/**
 * 新增或修改权限
 */
export const saveOrUpdatePer = (params) => {
  return axios.request({
    url: 'permission/saveOrUpdate',
    method: 'post',
    params: params
  })
}


/**
 * 根据ids删除
 */
export const removeByIds = (params) => {
  return axios.request({
    url: 'permission/removeByIds',
    method: 'get',
    params: params
  })
}

/**
 * 根据id查询
 */
export const selectPerById = (params) => {
  return axios.request({
    url: 'permission/selectById',
    method: 'get',
    params: params
  })
}
