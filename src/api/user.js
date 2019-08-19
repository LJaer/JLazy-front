import axios from '@/libs/api.request'

/**
 * 用户分页查询
 */
export const getByPageQueryDTO = (params) => {
  return axios.request({
    url: 'user/getByPageQueryDTO',
    params: params,
    method: 'get'
  })
}

/**
 * 新增用户
 */
export const createNewUser = (params) => {
  return axios.request({
    url: 'user/createNewUser',
    params: params,
    method: 'post'
  })
}

/**
 * 更新用户
 */
export const updateUser = (params) => {
  return axios.request({
    url: 'user/updateUser',
    params: params,
    method: 'post'
  })
}

/**
 * 根据id删除
 */
export const deleteById = (params) => {
  return axios.request({
    url: 'user/deleteById',
    params: params,
    method: 'get'
  })
}

/**
 * admin用户修改密码
 */
export const updatePassword = (params) => {
  return axios.request({
    url: 'user/updatePassword',
    params: params,
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: 'system/logout',
    method: 'get'
  })
}

//export const login = ({ userName, password }) => {
//  const data = {
//    userName,
//    password
//  }
//  return axios.request({
//    url: 'login',
//    data,
//    method: 'post'
//  })
//}
//
//export const getUserInfo = (token) => {
//  return axios.request({
//    url: 'get_info',
//    params: {
//      token
//    },
//    method: 'get'
//  })
//}
//
//export const logout = (token) => {
//  return axios.request({
//    url: 'logout',
//    method: 'post'
//  })
//}
//
//export const getUnreadCount = () => {
//  return axios.request({
//    url: 'message/count',
//    method: 'get'
//  })
//}
//
//export const getMessage = () => {
//  return axios.request({
//    url: 'message/init',
//    method: 'get'
//  })
//}
//
//export const getContentByMsgId = msg_id => {
//  return axios.request({
//    url: 'message/content',
//    method: 'get',
//    params: {
//      msg_id
//    }
//  })
//}
//
//export const hasRead = msg_id => {
//  return axios.request({
//    url: 'message/has_read',
//    method: 'post',
//    data: {
//      msg_id
//    }
//  })
//}
//
//export const removeReaded = msg_id => {
//  return axios.request({
//    url: 'message/remove_readed',
//    method: 'post',
//    data: {
//      msg_id
//    }
//  })
//}
//
//export const restoreTrash = msg_id => {
//  return axios.request({
//    url: 'message/restore',
//    method: 'post',
//    data: {
//      msg_id
//    }
//  })
//}
//