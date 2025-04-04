<template>
	<view class="bg-white h-full overflow-y-auto rounded-lg shadow-md">
		<!-- 列表标题 -->
		<view class="p-30rpx bg-primary text-white font-bold text-32rpx rounded-t-lg flex items-center">
			<view class="i-lucide-map-pin mr-10rpx"></view>
			<text>附近位置</text>
			<text class="text-24rpx ml-20rpx font-normal">{{ locations.length }}个结果</text>
		</view>
		
		<!-- 列表内容 -->
		<view class="p-20rpx divide-y divide-gray-100" v-if="locations.length > 0">
			<view class="py-20rpx px-10rpx hover:bg-gray-50 transition-colors duration-200 rounded-lg" 
				v-for="(item, index) in locations" :key="index" @tap="onItemTap(item)">
				<view class="flex items-center">
					<!-- 位置图标 -->
					<view class="w-60rpx h-60rpx rounded-full bg-primary flex items-center justify-center mr-20rpx flex-shrink-0">
						<text class="text-white text-24rpx font-bold">{{ index + 1 }}</text>
					</view>
					
					<!-- 位置信息 -->
					<view class="flex-1 mr-20rpx">
						<text class="block text-30rpx text-gray-800 font-medium mb-10rpx">{{ item.name }}</text>
						<view class="flex items-center text-24rpx text-gray-400 mb-10rpx">
							<view class="i-lucide-map-pin w-30rpx h-30rpx mr-5rpx"></view>
							<text>{{ item.address }}</text>
						</view>
						<view class="mt-10rpx">
							<text class="text-20rpx text-primary bg-primary/10 px-12rpx py-4rpx rounded-full">{{ item.category || '未分类' }}</text>
						</view>
					</view>
					
					<!-- 距离信息 -->
					<view class="bg-gray-100 px-20rpx py-10rpx rounded-full text-24rpx text-gray-600 flex items-center">
						<view class="i-lucide-navigation w-24rpx h-24rpx mr-5rpx"></view>
						<text>{{ item.distance }}km</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="locations.length === 0" class="py-100rpx flex flex-col items-center justify-center text-gray-400">
			<view class="i-lucide-map-off w-100rpx h-100rpx mb-20rpx"></view>
			<text class="text-28rpx">暂无位置信息</text>
		</view>
	</view>
</template>

<style>
.bg-primary {
	background-color: #4CAF50;
}

.text-primary {
	color: #4CAF50;
}
</style>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
	locations: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['select'])

const onItemTap = (item) => {
	emit('select', item)
}
</script>