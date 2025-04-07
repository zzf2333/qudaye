<template>
	<view class="relative bg-white min-h-screen">
		<Header
			title="添加打野点位"
			rightIcon="i-lucide-check"
			@rightClick="submitForm"
		/>

		<!-- 表单内容区 -->
		<view class="pt-140rpx pb-120rpx px-30rpx">
			<uni-forms ref="formRef" :model="formData" :rules="rules" class="space-y-40rpx" label-position="top">
				<!-- 名称输入 -->
				<uni-forms-item name="title" class="flex flex-col mb-4" label="名称">
					<input type="text" id="title" class="input" v-model="formData.title" placeholder="请输入名称" />
				</uni-forms-item>

				<!-- 位置选择 -->
				<uni-forms-item name="location" class="flex flex-col mb-4" label="位置">
					<view class="input flex items-center justify-center" @click="openMap">
						<view class="flex-1">
							<input id="location" class="w-full outline-none text-sm" v-model="formData.address" placeholder="点击选择位置" disabled />
						</view>
						<view class="i-lucide-map-pin text-comet-500 w-36rpx h-36rpx"></view>
					</view>
				</uni-forms-item>

				<!-- 描述信息 -->
				<uni-forms-item name="description" class="flex flex-col mb-4" label="描述">
					<textarea id="description" class="h-200rpx input w-full box-border px-3 py-2" v-model="formData.description" placeholder="请输入描述信息" />
				</uni-forms-item>

				<!-- 图片上传 -->
				<uni-forms-item name="images" class="flex flex-col mb-4" label="图片">
					<ImageUploader v-model="formData.images" :max-count="6" />
				</uni-forms-item>

				<!-- 可以做什么 -->
				<uni-forms-item name="category" class="flex flex-col mb-4" label="分类">
					<view class="flex flex-wrap gap-20rpx">
						<uni-tooltip v-for="item in categories" :key="item.value" :content="item.description" placement="top">
							<view @click="formData.category = item.value"
								:class="['py-3 px-4 flex-1 rounded-lg',
								formData.category === item.value ? 'bg-comet-400' : 'bg-comet-100']">
								<text>{{ item.emoji }}</text>
							</view>
						</uni-tooltip>
					</view>
				</uni-forms-item>

				<!-- 标签选择 -->
				<uni-forms-item name="tags" class="flex flex-col mb-4" label="标签">
					<TagInput v-model="formData.tags" placeholder="输入标签后按回车或点击添加" :max-tags="6" />
				</uni-forms-item>

				<!-- 难度评级 -->
				<uni-forms-item name="difficulty" class="flex flex-col mb-4" label="难度">
					<view class="flex flex-wrap gap-20rpx">
						<view v-for="level in difficultyLevels" :key="level.value"
							@click="formData.difficulty = level.value"
							:class="['py-3 px-4 rounded-lg transition-colors cursor-pointer',
							formData.difficulty === level.value ? 'bg-comet-400 text-white' : 'bg-gray-200 text-gray-600']">
						<text>{{ level.label }}</text>
						</view>
					</view>
				</uni-forms-item>

				<!-- 季节选择 -->
				<uni-forms-item name="seasons" class="flex flex-col mb-4" label="季节">
					<view class="flex flex-wrap gap-20rpx">
						<view v-for="item in seasonOptions" :key="item.value"
							@click="formData.season = item.value"
							:class="['py-3 px-4 rounded-lg transition-colors cursor-pointer',
							formData.season === item.value ? 'bg-comet-400 text-white' : 'bg-gray-200 text-gray-600']">
							<text>{{ item.label }}</text>
						</view>
					</view>
				</uni-forms-item>

				<!-- 物产种类 -->
				<uni-forms-item name="productTypes" class="flex flex-col mb-4" label="物产种类">
					<TagInput v-model="formData.productTypes" placeholder="输入标签后按回车或点击添加" :max-tags="8" />
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { categories, seasonOptions, productTypeOptions } from '@/config/categories'
import ImageUploader from '@/components/ImageUploader.vue'
import TagInput from '@/components/TagInput.vue'
import Header from '@/components/Header.vue'

// 表单校验规则
const rules = {
  title: {
    rules: [{
      required: true,
      errorMessage: '请输入名称'
    }]
  },
  location: {
    rules: [{
      required: true,
      errorMessage: '请选择位置'
    }]
  },
  description: {
    rules: [{
      required: true,
      errorMessage: '请输入描述'
    }]
  },
  category: {
    rules: [{
      required: true,
      errorMessage: '请选择分类'
    }]
  },
  season: {
    rules: [{
      required: true,
      errorMessage: '请选择季节'
    }]
  },
  productTypes: {
    rules: [{
      required: true,
      errorMessage: '请选择物产种类'
    }]
  },
  images: {
    rules: [{
      required: true,
      errorMessage: '请上传至少一张图片'
    }]
  },
  tags: {
    rules: [{
      required: true,
      errorMessage: '请选择至少一个标签'
    }]
  },
  difficulty: {
    rules: [{
      required: true,
      errorMessage: '请选择难度等级'
    }]
  }
}

const difficultyLevels = [
  { label: '低', value: 1 },
  { label: '中', value: 2 },
  { label: '高', value: 3 }
]

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
	category: 'mountain_delicacy',
	difficulty: 1, // 默认值改为 1
	season: 'spring', // 默认值设为春季
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

// 表单验证
const formRef = ref(null)

const validateForm = async () => {
	try {
		await formRef.value.validate()
		return true
	} catch (e) {
		return false
	}
}

// 提交表单
const submitForm = async () => {
	if (await validateForm()) {
		// TODO: 实现表单提交逻辑
		uni.showToast({
			title: '发布成功',
			icon: 'success'
		})
	}
}
</script>

<style lang="scss"></style>