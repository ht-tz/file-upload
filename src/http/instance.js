/*
 * @Author: htz
 * @Date: 2024-06-01 11:36:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-01 16:10:07
 * @Description: 请填写简介
 */
import axios from 'axios'
import Qs from 'qs'

// const service = axios.create({
//   baseURL: 'http://127.0.0.1:8888/',
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
//   // `transformRequest` 允许在向服务器发送前，修改请求数据
//   // 它只能用于 'PUT', 'POST' 和 'PATCH' 这几个请求方法
//   // 数组中最后一个函数必须返回一个字符串， 一个Buffer实例，ArrayBuffer，FormData，或 Stream
//   // 你可以修改请求头。
//   transformRequest: [
//     function (data, headers) {
//       const contentType = headers['Content-Type']
//       if (contentType === 'application/x-www-form-urlencoded') return Qs.stringify(data)
//       return data
//     },
//   ],
// })

// //添加自定义拦截器
// service.interceptors.response.use((response) => {
//   return response.data
// })

// export default service

let instance = axios.create()
instance.defaults.baseURL = 'http://127.0.0.1:8888'
instance.defaults.headers['Content-Type'] = 'multipart/form-data'
instance.defaults.transformRequest = (data, headers) => {
  const contentType = headers['Content-Type']
  if (contentType === 'application/x-www-form-urlencoded') return Qs.stringify(data)
  return data
}
instance.interceptors.response.use((response) => {
  return response.data
})
export default instance
