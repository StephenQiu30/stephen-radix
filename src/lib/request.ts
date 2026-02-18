import axios, { AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

/**
 * 创建 Axios 实例
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
})

/**
 * 创建请求拦截器
 */
axiosInstance.interceptors.request.use(
  function (config) {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.setAuthorization(`Bearer ${token}`)
        }
      } catch {
        // Ignore storage access errors (e.g. disabled storage)
      }
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
axiosInstance.interceptors.response.use(
  // 2xx 响应触发
  function (response) {
    // 处理响应数据
    const { data } = response
    return data
  },
  // 非 2xx 响应触发
  function (error) {
    // 处理响应错误
    const { response } = error
    if (response?.data?.message) {
      toast.error(response.data.message)
    } else {
      toast.error('Request failed', {
        description: error.message || 'Unknown error occurred',
      })
    }
    return Promise.reject(error)
  }
)

/**
 * 封装 request 方法，支持泛型 T
 * @param url 请求地址
 * @param config 请求配置
 */
const request = <T>(url: string, config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(url, config) as Promise<T>
}

export default request
