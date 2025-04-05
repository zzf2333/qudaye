import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import config from './config'

import 'uno.css'

export function createApp() {
	const app = createSSRApp(App)

	// 挂载 Pinia
	app.use(pinia)

	// 挂载全局配置
	app.config.globalProperties.$config = config
	
	// 判断是否是 H5 平台
	// #ifdef H5
	app.config.globalProperties.$isH5 = true
	// #endif
	// #ifndef H5
	app.config.globalProperties.$isH5 = false
	// #endif

	return {
		app
	}
}
