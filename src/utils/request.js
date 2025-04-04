import axios from 'axios'
import { useUserStore } from '@/store/modules/user'

// 创建 axios 实例
const service = axios.create({
  baseURL: '', // API 基础 URL
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // 如果有 token，添加到请求头
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里可以根据后端的响应结构进行相应的处理
    if (res.code !== 200) {
      uni.showToast({
        title: res.message || '请求失败',
        icon: 'none'
      })
      
      // 如果是 401，说明 token 过期，需要重新登录
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }
      return Promise.reject(res)
    }
    return res
  },
  error => {
    console.error('响应错误：', error)
    uni.showToast({
      title: error.message || '网络异常',
      icon: 'none'
    })
    return Promise.reject(error)
  }
)

export default service