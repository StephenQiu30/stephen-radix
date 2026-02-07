import axios from 'axios'

/**
 * 创建 Axios 实例
 */
const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
})

/**
 * 创建请求拦截器
 */
request.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.setAuthorization(`Bearer ${token}`)
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * 创建响应拦截器
 */
request.interceptors.response.use(
  // 2xx 响应触发
  function (response) {
    // 处理响应数据
    const { data } = response
    return data
  },
  // 非 2xx 响应触发
  function (error) {
    // 处理响应错误
    return Promise.reject(error)
  }
)

export default request
