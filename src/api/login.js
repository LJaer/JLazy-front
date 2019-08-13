import axios from '@/libs/api.request'

/**
 * 登陆
 */
export const login = (params) => {
  return axios.postRequest('login', params);
}
