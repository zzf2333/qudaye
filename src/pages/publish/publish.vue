<template>
	<view class="relative bg-gray-50 min-h-screen">
		<!-- 顶部导航栏 -->
		<view class="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
			<view class="flex items-center justify-between h-100rpx px-30rpx text-32rpx">
				<view class="text-gray-600 text-32rpx"></view>
				<view class="text-md">添加打野点位</view>
				<view class="text-primary-500 font-medium" @click="submitForm">保存</view>
			</view>
		</view>
		
		<!-- 表单内容区 -->
		<view class="pt-100rpx pb-120rpx px-30rpx">
			<form @submit="submitForm" class="space-y-40rpx">
				<!-- 名称输入 -->
				<view class="space-y-20rpx">
					<view class="text-48rpx font-light text-gray-500">给它一个名称...</view>
					<input 
						class="w-full text-40rpx py-20rpx border-b border-gray-300 focus:border-primary-500 outline-none transition-colors" 
						v-model="formData.title" 
						placeholder="请输入名称" 
					/>
					<text class="text-red-500 text-24rpx" v-if="errors.title">{{ errors.title }}</text>
				</view>

				<!-- 位置选择 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">位置</text>
					<view 
						class="flex items-center bg-white rounded-lg p-20rpx shadow-sm" 
						@click="openMap"
					>
						<view class="flex-1">
							<input 
								class="w-full text-28rpx text-gray-700 outline-none" 
								v-model="formData.address" 
								placeholder="点击选择位置" 
								disabled 
							/>
						</view>
						<view class="i-lucide-map-pin text-primary-500 w-40rpx h-40rpx"></view>
					</view>
					<text class="text-red-500 text-24rpx" v-if="errors.location">{{ errors.location }}</text>
				</view>

				<!-- 描述信息 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">描述</text>
					<textarea 
						class="w-full h-200rpx bg-white rounded-lg p-20rpx text-28rpx shadow-sm" 
						v-model="formData.description" 
						placeholder="请输入描述信息" 
					/>
					<text class="text-red-500 text-24rpx" v-if="errors.description">{{ errors.description }}</text>
				</view>

				<!-- 图片上传 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">图片</text>
					<view class="bg-white rounded-lg p-30rpx shadow-sm">
						<view class="flex flex-wrap gap-20rpx">
							<view 
								v-for="(item, index) in formData.images" 
								:key="index" 
								class="relative w-150rpx h-150rpx rounded-lg overflow-hidden"
							>
								<image :src="item.url" mode="aspectFill" class="w-full h-full" />
								<view 
									class="absolute top-10rpx right-10rpx w-40rpx h-40rpx bg-black bg-opacity-50 rounded-full flex items-center justify-center" 
									@click="deletePic(index)"
								>
									<text class="text-white text-24rpx">×</text>
								</view>
							</view>
							<view 
								v-if="formData.images.length < 6" 
								class="w-150rpx h-150rpx rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center" 
								@click="chooseImage"
							>
								<view class="i-lucide-camera text-gray-400 w-60rpx h-60rpx"></view>
							</view>
						</view>
						<view class="text-center text-gray-400 text-24rpx mt-20rpx">添加封面照片</view>
					</view>
				</view>

				<!-- 可以做什么 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">这里可以做什么？</text>
					<view class="flex flex-wrap gap-20rpx">
						<view class="w-100rpx h-100rpx bg-gray-200 rounded-lg flex flex-col items-center justify-center">
							<view class="i-lucide-backpack text-gray-600 w-40rpx h-40rpx"></view>
						</view>
						<view class="w-100rpx h-100rpx bg-gray-200 rounded-lg flex flex-col items-center justify-center">
							<view class="i-lucide-bike text-gray-600 w-40rpx h-40rpx"></view>
						</view>
						<view class="w-100rpx h-100rpx bg-gray-200 rounded-lg flex flex-col items-center justify-center">
							<view class="i-lucide-fish text-gray-600 w-40rpx h-40rpx"></view>
						</view>
						<view class="w-100rpx h-100rpx bg-gray-200 rounded-lg flex flex-col items-center justify-center">
							<view class="i-lucide-running text-gray-600 w-40rpx h-40rpx"></view>
						</view>
						<view class="w-100rpx h-100rpx bg-gray-200 rounded-lg flex flex-col items-center justify-center">
							<view class="i-lucide-flame text-gray-600 w-40rpx h-40rpx"></view>
						</view>
					</view>
				</view>

				<!-- 标签选择 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">标签</text>
					<view class="flex flex-wrap gap-20rpx">
						<view 
							v-for="tag in availableTags" 
							:key="tag.value"
							:class="['px-30rpx py-15rpx rounded-full text-28rpx transition-colors', 
								formData.tags.includes(tag.value) ? 
								'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600']"
							@click="toggleTag(tag.value)"
						>
							{{ tag.text }}
						</view>
					</view>
				</view>

				<!-- 分类选择 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">分类</text>
					<radio-group class="flex flex-wrap gap-20rpx" @change="onCategoryChange">
						<label 
							v-for="item in categories" 
							:key="item.value" 
							:class="['flex items-center px-30rpx py-15rpx rounded-full transition-colors', 
								formData.category === item.value ? 
								'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600']"
						>
							<radio 
								:value="item.value" 
								:checked="formData.category === item.value" 
								class="transform scale-0 absolute"
							/>
							<text>{{ item.label }}</text>
						</label>
					</radio-group>
					<text class="text-red-500 text-24rpx" v-if="errors.category">{{ errors.category }}</text>
				</view>

				<!-- 难度评级 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">难度</text>
					<view class="flex items-center">
						<text 
							v-for="n in 5" 
							:key="n" 
							:class="['text-48rpx mr-10rpx', n <= formData.difficulty ? 'text-yellow-500' : 'text-gray-300']"
							@click="formData.difficulty = n"
						>
							★
						</text>
					</view>
				</view>

				<!-- 季节选择 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">季节</text>
					<checkbox-group class="flex flex-wrap gap-20rpx" @change="onSeasonsChange">
						<label 
							v-for="item in seasonOptions" 
							:key="item.value" 
							:class="['flex items-center px-30rpx py-15rpx rounded-full transition-colors', 
								formData.seasons.includes(item.value) ? 
								'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600']"
						>
							<checkbox 
								:value="item.value" 
								:checked="formData.seasons.includes(item.value)" 
								class="transform scale-0 absolute"
							/>
							<text>{{ item.label }}</text>
						</label>
					</checkbox-group>
					<text class="text-red-500 text-24rpx" v-if="errors.seasons">{{ errors.seasons }}</text>
				</view>

				<!-- 物产种类 -->
				<view class="space-y-20rpx">
					<text class="text-32rpx font-medium">物产种类</text>
					<checkbox-group class="flex flex-wrap gap-20rpx" @change="onProductTypesChange">
						<label 
							v-for="item in productTypeOptions" 
							:key="item.value" 
							:class="['flex items-center px-30rpx py-15rpx rounded-full transition-colors', 
								formData.productTypes.includes(item.value) ? 
								'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600']"
						>
							<checkbox 
								:value="item.value" 
								:checked="formData.productTypes.includes(item.value)" 
								class="transform scale-0 absolute"
							/>
							<text>{{ item.label }}</text>
						</label>
					</checkbox-group>
					<text class="text-red-500 text-24rpx" v-if="errors.productTypes">{{ errors.productTypes }}</text>
				</view>
			</form>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formData = ref({
	title: '',
	description: '',
	images: [],
	address: '',
	location: {
		latitude: '',
		longitude: ''
	},
	tags: [],
	category: '',
	difficulty: 3,
	seasons: [],
	productTypes: []
})

const errors = reactive({
	title: '',
	location: '',
	description: '',
	category: '',
	seasons: '',
	productTypes: ''
})

const availableTags = [
	{ text: '野菜', value: 'wild_vegetable' },
	{ text: '水产', value: 'aquatic' },
	{ text: '山珍', value: 'mountain_delicacy' },
	{ text: '药材', value: 'herb' }
]

const categories = [
	{ label: '野菜', value: 'wild_vegetable' },
	{ label: '水产', value: 'aquatic' },
	{ label: '山珍', value: 'mountain_delicacy' },
	{ label: '药材', value: 'herb' }
]

const seasonOptions = [
	{ label: '春', value: 'spring' },
	{ label: '夏', value: 'summer' },
	{ label: '秋', value: 'autumn' },
	{ label: '冬', value: 'winter' }
]

const productTypeOptions = [
	{ label: '叶菜类', value: 'leaf' },
	{ label: '根茎类', value: 'root' },
	{ label: '菌类', value: 'fungus' },
	{ label: '果实类', value: 'fruit' },
	{ label: '水生类', value: 'aquatic' }
]

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}

// 打开地图选择位置
const openMap = () => {
	uni.chooseLocation({
		success: (res) => {
			formData.value.address = res.address
			formData.value.location = {
				latitude: res.latitude,
				longitude: res.longitude
			}
			errors.location = ''
		},
		fail: () => {
			uni.showToast({
				title: '位置选择失败',
				icon: 'none'
			})
		}
	})
}

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 6 - formData.value.images.length,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const newImages = res.tempFilePaths.map(url => ({
				url,
				status: 'uploading',
				message: '上传中'
			}))
			formData.value.images.push(...newImages)
		}
	})
}

// 删除图片
const deletePic = (index) => {
	formData.value.images.splice(index, 1)
}

// 切换标签
const toggleTag = (value) => {
	const index = formData.value.tags.indexOf(value)
	if (index === -1) {
		formData.value.tags.push(value)
	} else {
		formData.value.tags.splice(index, 1)
	}
}

// 分类变更
const onCategoryChange = (e) => {
	formData.value.category = e.detail.value
	errors.category = ''
}

// 季节变更
const onSeasonsChange = (e) => {
	formData.value.seasons = e.detail.value
	errors.seasons = ''
}

// 物产种类变更
const onProductTypesChange = (e) => {
	formData.value.productTypes = e.detail.value
	errors.productTypes = ''
}

// 表单验证
const validateForm = () => {
	let isValid = true

	if (!formData.value.title) {
		errors.title = '请输入名称'
		isValid = false
	}

	if (!formData.value.location.latitude || !formData.value.location.longitude) {
		errors.location = '请选择位置'
		isValid = false
	}

	if (!formData.value.description) {
		errors.description = '请输入描述'
		isValid = false
	}

	if (!formData.value.category) {
		errors.category = '请选择分类'
		isValid = false
	}

	if (formData.value.seasons.length === 0) {
		errors.seasons = '请选择季节'
		isValid = false
	}

	if (formData.value.productTypes.length === 0) {
		errors.productTypes = '请选择物产种类'
		isValid = false
	}

	return isValid
}

// 提交表单
const submitForm = () => {
	if (validateForm()) {
		// TODO: 实现表单提交逻辑
		uni.showToast({
			title: '发布成功',
			icon: 'success'
		})
	}
}
</script>

<style>
/* 自定义样式补充 */
.checkbox-group .checkbox,
.radio-group .radio {
	position: relative;
}

/* 隐藏原生单选框和复选框 */
radio,
checkbox {
	position: absolute;
	opacity: 0;
}
</style>