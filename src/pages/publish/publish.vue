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
				<uni-forms-item name="title" label="名称">
					<input type="text" class="input" v-model="formData.title" placeholder="请输入名称" />
				</uni-forms-item>

				<!-- 位置选择 (Using LocationPickerInput) -->
				<uni-forms-item name="address" label="位置"> 
					<LocationPickerInput 
						v-model="formData.address" 
						@locationSelected="handleLocationSelected" 
					/>
				</uni-forms-item>

				<!-- 描述信息 -->
				<uni-forms-item name="description" label="描述">
					<textarea class="h-200rpx input w-full box-border px-3 py-2" v-model="formData.description" placeholder="请输入描述信息" />
				</uni-forms-item>

				<!-- 图片上传 -->
				<uni-forms-item name="images" label="图片">
					<ImageUploader v-model="formData.images" :max-count="6" />
				</uni-forms-item>

				<!-- 分类 -->
				<uni-forms-item name="category" label="分类">
					<view class="flex flex-wrap gap-20rpx">
						<uni-tooltip v-for="item in categories" :key="item.value" :content="item.description" placement="top">
							<view @click="formData.category = item.value"
								:class="['py-3 px-4 flex-1 rounded-lg cursor-pointer', 
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
							@click="formData.difficulty = level.value"
							:class="['py-3 px-4 rounded-lg transition-colors cursor-pointer',
							formData.difficulty === level.value ? 'bg-comet-400 text-white' : 'bg-gray-200 text-gray-600']">
							<text>{{ level.label }}</text>
						</view>
					</view>
				</uni-forms-item>

				<!-- 季节选择 -->
				<uni-forms-item name="season" label="季节">
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
				<uni-forms-item name="productTypes" label="物产种类">
					<TagInput v-model="formData.productTypes" placeholder="输入标签后按回车或点击添加" :max-tags="8" />
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue' // Removed reactive as it wasn't used for errors anymore
import { categories, seasonOptions } from '@/config/categories' 
import ImageUploader from '@/components/ImageUploader.vue'
import TagInput from '@/components/TagInput.vue'
import Header from '@/components/Header.vue'
import LocationPickerInput from '@/components/common/LocationPickerInput.vue'; 

const formRef = ref(null)

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
	category: categories[0]?.value || '', 
	difficulty: 1, 
	season: seasonOptions[0]?.value || '', 
	productTypes: []
})

// Corrected validation rules
const rules = {
  title: { rules: [{ required: true, errorMessage: '请输入名称' }] },
  address: { 
	  rules: [
		  { required: true, errorMessage: '请选择位置' },
		  { // Custom validator to ensure lat/lng are also set
			  validateFunction: function(rule, value, data, callback) { // Use standard function for 'this' context if needed by uni-forms, or arrow function if not
				  // Use && instead of &amp;&amp;
				  if (!formData.value.location || !formData.value.location.latitude || !formData.value.location.longitude) {
					  callback(new Error('请选择有效的位置')) // Pass Error object
				  } else {
					  callback() // validation passes
				  }
			  }
		  }
	  ] 
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
	// Manually trigger validation for the address field after selection
	formRef.value?.validateField('address'); 
}

const goBack = () => {
	uni.navigateBack()
}

const submitForm = async () => {
	try {
		// Validate the form
		await formRef.value.validate(); 
		
		// If validation passes, proceed with submission logic
		console.log('Form Data Valid:', JSON.parse(JSON.stringify(formData.value))); 
		
		// TODO: Implement actual form submission logic (API call)
		// Example: const response = await api.submitLocation(formData.value);
		
		uni.showToast({
			title: '发布成功 (模拟)',
			icon: 'success'
		});
		
		// Optionally navigate back or reset form after successful submission
		// setTimeout(() => uni.navigateBack(), 1500);

	} catch (errors) {
		// Validation failed, errors contains validation messages
		console.error('表单验证失败：', errors); 
		uni.showToast({ title: '请检查表单信息', icon: 'none' });
	}
}

// Removed openMap method

</script>

<style lang="scss">
</style>