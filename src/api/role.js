import axios from '@/libs/api.request'

/**
 * 角色分页查询
 */
export const getRolePage = (params) => {
  return axios.request({
    url: 'role/getRolePage',
    params: params,
    method: 'get'
  })
}

/**
 * 新增角色
 */
export const saveOrUpdate = (params) => {
  return axios.request({
    url: 'role/saveOrUpdate',
    params: params,
    method: 'post'
  })
}

/**
 * 根据id删除
 */
export const deleteById = (params) => {
  return axios.request({
    url: 'role/deleteById',
    params: params,
    method: 'get'
  })
}

/**
 * 更新角色权限
 */
export const updateRolePermission = (params) => {
  return axios.request({
    url: 'rolePermission/updateRolePermission',
    params: params,
    method: 'get'
  })
}

/**
 * 获取当前用户权限
 */
export const selectCurrentPerByRoleId = (params) => {
  return axios.request({
    url: 'permission/selectCurrentPerByRoleId',
    params: params,
    method: 'get'
  })
}

/**
 * 获取当前角色权限
 */
export const selectCurrentUserPer = (params) => {
  return axios.request({
    url: 'permission/selectCurrentUserPer',
    params: params,
    method: 'get'
  })
}

/**
 * 获取当前所有角色
 */
export const getAllRole = () => {
  return axios.request({
    url: 'role/getAllRole',
    method: 'get'
  })
}

/**
 * 获取用户所对应的用户角色id
 */
export const getUserRoleByUserId = (params) => {
  return axios.request({
    url: 'userRole/getUserRoleByUserId',
    method: 'get',
    params: params
  })
}

