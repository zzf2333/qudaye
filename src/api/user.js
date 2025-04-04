import request from '@/utils/request'

// 用户相关接口
export default {
  // 用户登录
  login(data) {
    return request({
      url: '/api/user/login',
      method: 'post',
      data
    })
  },
  
  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/api/user/info',
      method: 'get'
    })
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return request({
      url: '/api/user/update',
      method: 'put',
      data
    })
  }
}