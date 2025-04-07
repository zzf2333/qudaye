import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => ({
		token: uni.getStorageSync('token') || '2222',
		userInfo: uni.getStorageSync('userInfo') || {}
	}),

	actions: {
		// 设置 Token
		setToken(token) {
			this.token = token
			uni.setStorageSync('token', token)
		},

		// 设置用户信息
		setUserInfo(info) {
			this.userInfo = info
			uni.setStorageSync('userInfo', info)
		},

		// 退出登录
		logout() {
			this.token = ''
			this.userInfo = {}
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
		}
	}
})