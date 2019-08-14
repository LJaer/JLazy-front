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
