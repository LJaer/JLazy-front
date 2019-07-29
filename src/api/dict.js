import axios from '@/libs/api.request'

/**
 * 获取所有字典表数据
 */
export const getDictAll = () => {
  return axios.request({
    url: 'dict/getAll',
    method: 'get'
  })
}

/**
 * 添加字典
 */
export const addDict = (params) => {
  alert(params)
  return axios.request({
    url: 'dict/add',
    data: params,
    method: 'post'
  })
}


