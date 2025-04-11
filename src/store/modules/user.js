import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useUserStore = defineStore('user', {
	state: () => ({
		token: '',
		userInfo: uni.getStorageSync('userInfo') || {}
	}),

	actions: {
		// 验证用户登录状态
		async checkLoginStatus() {
			try {
				// 更新用户状态
				const { data: { user }, error: userError } = await supabase.auth.getUser();
				if (userError) throw userError

				if(user) {
					this.setToken(user.id);
					this.setUserInfo(user.user_metadata);
				};

				return true
			} catch (err) {
				console.error('验证登录状态失败：', err.message)
				return false
			}
		},
		// 设置用户 ID
		setToken(token){
			this.token = token
		},

		// 设置用户信息
		setUserInfo(info) {
			this.userInfo = info
			uni.setStorageSync('userInfo', info)
		},

		// 退出登录
		logout() {
			this.userInfo = {}
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
		},

		// 微信登录
		async loginWithWeixin() {
			return new Promise((resolve, reject) => {
				uni.login({
					success: async res => {
						try {
							const { data, error } = await supabase.auth.signInWithWechat({ code: res.code })
							if (error) throw error
							if (data) {
								this.getWeixinUserInfo()
								resolve(data)
							}
						} catch (err) {
							uni.showToast({
								title: error?.error || error?.msg,
								icon: "none",
								duration: 2000
							})
							reject(err)
						}
					},
					fail: err => {
						uni.showToast({
							title: err.errMsg,
							icon: "none",
							duration: 2000
						})
						reject(err)
					}
				})
			})
		},

		// 获取微信用户信息
		async getWeixinUserInfo() {
			return new Promise((resolve, reject) => {
				uni.getUserInfo({
					success: async res => {
						try {
							const { userInfo } = res;
							// 更新 auth 用户信息
							const { data: user, error: authError } = await supabase.auth.updateUser({
								"data": {
									"nickname": userInfo.nickName,
									"avatar": userInfo.avatarUrl,
									"gender": userInfo.gender,
									"province": userInfo.province,
									"city": userInfo.city
								}
							});
							if (authError) throw authError;
							this.setToken(user.id);
							this.setUserInfo(user.user_metadata);
							resolve(user);
						} catch (err) {
							uni.showToast({
								title: err.message,
								icon: "none",
								duration: 2000
							});
							reject(err)
						}
					}
				})
			})
		}
	}
})