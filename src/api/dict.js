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

/**
 * 根据字典分类数据分页查询
 */
export const getPageByCondition = (params) => {
  return axios.getRequest('dictData/getPageByCondition', params);
}


/**
 * 字典数据新增或更新
 */
export const saveOrUpdateDictData = (params) => {
  return axios.postRequest('dictData/saveOrUpdate', params);
}

/**
 * 字典数据根据id删除
 */
export const deleteByIdDictData = (params) => {
  return axios.getRequest('dictData/deleteById', params);
}

/**
 * 字典数据根据ids删除
 */
export const deleteByIdsDictData = (params) => {
  return axios.getRequest('dictData/deleteByIds', params);
}


