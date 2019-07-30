import axios from '@/libs/api.request'

/**
 * 获取所有字典表数据
 */
export const getDictAll = () => {
  return axios.getRequest('dict/getAll', null);
}

/**
 * 添加字典
 */
export const addDict = (params) => {
  return axios.postRequest('dict/saveOrUpdate', params);
}
