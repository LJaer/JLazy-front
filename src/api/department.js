import axios from '@/libs/api.request'

/**
 * 获取所有字典表数据
 */
export const getDepByParentId = (params) => {
    return axios.request({
      url: 'department/getDepByParentId',
      method: 'get',
      params: params
    })
  }