import axios from 'axios'

// 创建一个axios实例
const service = axios.create({
  baseURL: "",
  // timeout: 5000, // 超时时间
  withCredentials: true, // 允许携带cookie
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // withCredentials: false, // 表示跨域请求时是否需要使用凭证
})

// 请求拦截器
service.interceptors.request.use((response) => {
  return response
}, (err => {
  return Promise.reject(err);
}))


// 响应拦截器
service.interceptors.response.use((response) => {
  return response.data
}, (err => {
  return Promise.reject(err);
}))


export default service