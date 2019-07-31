import axios from '@/libs/api.request'

/**
 * 获取所有字典表数据
 */
export const getDictAll = () => {
  return axios.getRequest('dict/getAll', null);
}

/**
 * 新增或修改字典
 */
export const saveOrUpdateDict = (params) => {
  return axios.postRequest('dict/saveOrUpdate', params);
}

/**
 * 根据名称模糊查询
 */
export const queryByVagueName = (params) => {
  return axios.getRequest('dict/queryByVagueName', params);
}

/**
 * 根据id删除
 */
export const deleteById = (params) => {
  return axios.getRequest('dict/deleteById', params);
}



