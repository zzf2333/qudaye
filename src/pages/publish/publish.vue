<template>
	<view class="relative bg-white min-h-screen">
		<!-- 表单内容区 -->
		<view class="pb-120rpx px-30rpx">
			<text class="py-3 block text-xl c-comet-800 pb-10" :class="$isH5 ? '' : 'pt-65px'">新增打野点</text>
			<uni-forms ref="formRef" :model="formData" :rules="rules" class="space-y-40rpx" label-position="top">
				<!-- 名称输入 -->
				<uni-forms-item name="title" label="名称">
					<input type="text" class="input" v-model="formData.title" placeholder="请输入名称" />
				</uni-forms-item>

				<!-- 位置选择 (Using LocationPickerInput) -->
				<uni-forms-item name="address" label="位置">
					<LocationPickerInput v-model="formData.address" @locationSelected="handleLocationSelected" />
				</uni-forms-item>

				<!-- 描述信息 -->
				<uni-forms-item name="description" label="描述">
					<textarea class="h-200rpx input w-full box-border px-3 py-2" v-model="formData.description"
						placeholder="请输入描述信息" />
				</uni-forms-item>

				<!-- 图片上传 -->
				<uni-forms-item name="images" label="图片">
					<ImageUploader v-model="formData.images" :max-count="6" />
				</uni-forms-item>

				<!-- 分类 -->
				<uni-forms-item name="category" label="分类">
					<view class="flex flex-wrap gap-20rpx">
						<uni-tooltip v-for="item in categories" :key="item.value" :content="item.description"
							placement="top">
							<view @click="formData.category = item.value" :class="['py-3 px-4 flex-1 rounded-lg cursor-pointer',
								formData.category === item.value ? 'bg-comet-400 text-white' : 'bg-comet-100']">
								<text>{{ item.emoji }}</text>
							</view>
						</uni-tooltip>
					</view>
				</uni-forms-item>

				<!-- 标签选择 -->
				<uni-forms-item name="tags" label="标签">
					<TagInput v-model="formData.tags" placeholder="输入标签后按回车或点击添加" :max-tags="6" />
				</uni-forms-item>

				<!-- 难度评级 -->
				<uni-forms-item name="difficulty" label="难度">
					<view class="flex flex-wrap gap-20rpx">
						<view v-for="level in difficultyLevels" :key="level.value"
							@click="formData.difficulty = level.value" :class="['py-3 px-4 rounded-lg transition-colors cursor-pointer',
								formData.difficulty === level.value ? 'bg-comet-400 text-white' : 'bg-gray-200 text-gray-600']">
							<text>{{ level.label }}</text>
						</view>
					</view>
				</uni-forms-item>

				<!-- 季节选择 -->
				<uni-forms-item name="season" label="季节">
					<view class="flex flex-wrap gap-20rpx">
						<view v-for="item in seasonOptions" :key="item.value" @click="formData.season = item.value"
							:class="['py-3 px-4 rounded-lg transition-colors cursor-pointer',
								formData.season === item.value ? 'bg-comet-400 text-white' : 'bg-gray-200 text-gray-600']">
							<text>{{ item.label }}</text>
						</view>
					</view>
				</uni-forms-item>

				<!-- 物产种类 -->
				<uni-forms-item name="productTypes" label="物产种类">
					<TagInput v-model="formData.productTypes" placeholder="输入标签后按回车或点击添加" :max-tags="8" />
				</uni-forms-item>

				<button type="primary" class="!bg-primary-500" @click="submitForm">立即发布</button>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { categories, seasonOptions } from '@/config/categories'
import ImageUploader from '@/components/ImageUploader.vue'
import TagInput from '@/components/TagInput.vue'
import LocationPickerInput from '@/components/common/LocationPickerInput.vue'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const formRef = ref(null)

const formData = ref({
	title: '测试点',
	description: '啊实打实的撒点撒',
	images: [],
	address: '',
	location: {
		latitude: '',
		longitude: ''
	},
	tags: ['钓鱼'],
	category: categories[0]?.value || '',
	difficulty: 1,
	season: seasonOptions[0]?.value || '',
	productTypes: ['鲫鱼', '鲤鱼']
})

// Corrected validation rules
const rules = {
	title: { rules: [{ required: true, errorMessage: '请输入名称' }] },
	address: {
		rules: [{ required: true, errorMessage: '请选择位置' }]
	},
	description: { rules: [{ required: true, errorMessage: '请输入描述' }] },
	// Simplified array validation - just check if required
	images: { rules: [{ required: true, errorMessage: '请上传至少一张图片' }] },
	category: { rules: [{ required: true, errorMessage: '请选择分类' }] },
	tags: { rules: [{ required: true, type: 'array', errorMessage: '请添加至少一个标签' }] }, // Use type array for basic check
	difficulty: { rules: [{ required: true, errorMessage: '请选择难度等级' }] },
	season: { rules: [{ required: true, errorMessage: '请选择季节' }] },
	productTypes: { rules: [{ required: true, type: 'array', errorMessage: '请添加至少一个物产种类' }] }, // Use type array
}

const difficultyLevels = [
	{ label: '低', value: 1 },
	{ label: '中', value: 2 },
	{ label: '高', value: 3 }
]

// --- Methods ---

const handleLocationSelected = (locationData) => {
	formData.value.location = {
		latitude: locationData.latitude,
		longitude: locationData.longitude
	};
}

const goBack = () => {
	uni.navigateBack()
}

const submitForm = async () => {
	try {
		// 表单验证
		await formRef.value.validate();

		// 显示加载提示
		uni.showLoading({ title: '正在提交...' });

		// 准备提交数据
		const submitData = {
			name: formData.value.title,
			address: formData.value.address,
			latitude: formData.value.location.latitude,
			longitude: formData.value.location.longitude,
			description: formData.value.description,
			category: formData.value.category,
			difficulty: formData.value.difficulty,
			suitable_seasons: [formData.value.season], // 转换为数组格式
			specialties: formData.value.productTypes, // 物产种类作为特产列表
			tags: formData.value.tags,
			images: formData.value.images, // 已上传的图片 URL 数组
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			creator_user_id: userStore.token // 添加创建者 ID
		};

		// 提交到 Supabase
		const { data, error } = await supabase
			.from('wilderness_spots')
			.insert([submitData])
			.select()
			.single();

		if (error) throw error;

		// 隐藏加载提示
		uni.hideLoading();

		// 显示成功提示
		uni.showToast({
			title: '发布成功',
			icon: 'success'
		});

		// 延迟返回上一页
		setTimeout(() => uni.navigateBack(), 1500);

	} catch (error) {
		// 隐藏加载提示
		uni.hideLoading();

		// 显示错误信息
		console.error('提交失败：', error);
		uni.showToast({
			title: error.message || '提交失败，请重试',
			icon: 'none'
		});
	}
}

// Removed openMap method

</script>

<style lang="scss"></style>