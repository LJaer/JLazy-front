import axios from 'axios'
import store from '@/store'
import {
  Message
} from 'iview'

// 统一请求路径前缀
let base = "http://localhost:8085/JLazy/"

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: {
      responseURL
    }
  } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      //全局设置 access_token
      var access_token = sessionStorage.getItem("access_token")
      if (access_token != null) {
        config.headers['access_token'] = access_token
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const {
        data,
        status
      } = res
      let code = res.data.status;
      let msg = res.data.msg;

      // token 过期重新登陆
      if(1002 === code || 1003 === code){
        sessionStorage.removeItem("access_token")
      }

      if (200 !== code) {
        Message.error(msg);
      } else {
        return {
          data,
          status
        }
      }
    }, error => {
      this.destroy(url)
      let errorCode = error.response.data.status;
      let errorMsg = error.response.data.msg;
      if (300 === errorCode) {
        Message.error(errorMsg);
      }
      //let errorInfo = error.response
      //if (!errorInfo) {
      //  const {
      //    request: {
      //      statusText,
      //      status
      //    },
      //    config
      //  } = JSON.parse(JSON.stringify(error))
      //  errorInfo = {
      //    statusText,
      //    status,
      //    request: {
      //      responseURL: config.url
      //    }
      //  }
      //}
      //addErrorLog(errorInfo)
      //return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  getRequest = (url, params) => {
    let access_token = sessionStorage.getItem("access_token");
    return axios({
      method: 'get',
      url: `${base}${url}`,
      params: params,
      headers: {
        'access_token': access_token
      }
    });
  };

  postRequest = (url, params) => {
    let access_token = sessionStorage.getItem("access_token");
    return axios({
      method: 'post',
      url: `${base}${url}`,
      data: params,
      transformRequest: [function (data) {
        let ret = '';
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access_token': access_token
      }
    });
  };
}
export default HttpRequest
