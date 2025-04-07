export default {
	// API 基础路径
	baseURL: process.env.NODE_ENV === 'development'
		? 'http://localhost:3000' // 开发环境
		: 'https://api.example.com', // 生产环境

	// 缓存 Key
	storageKeys: {
		token: 'TOKEN',
		userInfo: 'USER_INFO'
	},

	// 请求超时时间
	timeout: 10000,

	// 请求响应码
	responseCode: {
		success: 200,
		unauthorized: 401,
		forbidden: 403,
		notFound: 404
	}
}