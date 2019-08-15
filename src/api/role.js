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
