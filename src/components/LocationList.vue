<template>
	<view :class="['bg-gray-50 overflow-auto pt-100rpx', $isH5 ? 'h-[calc(100vh-100rpx-50px)]' : 'h-[calc(100vh-100rpx)]']">
		<!-- 列表内容 -->
		<view class="p-30rpx space-y-30rpx" v-if="locations.length > 0">
			<view class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" 
				v-for="(item, index) in locations" :key="index" @tap="onItemTap(item)">
				<!-- 地点图片 -->
				<view class="h-300rpx w-full rounded-t-lg bg-gray-200 overflow-hidden">
					<image :src="item.cover || '/static/icon/default-place.png'" mode="aspectFill" class="w-full h-full"/>
				</view>
				
				<view class="p-20rpx">
					<!-- 标题和评分 -->
					<view class="flex items-center justify-between mb-10rpx">
						<view class="flex items-center">
						<text class="mr-10rpx">{{ item.category === 1 ? '🥬' : item.category === 2 ? '🐟' : item.category === 3 ? '🍎' : item.category === 4 ? '🍄' : '☘️' }}</text>
						<text class="text-32rpx text-gray-800 font-bold">{{ item.name }}</text>
					</view>
						<view class="flex items-center">
							<view v-for="i in 3" :key="i" class="w-24rpx h-24rpx mx-2rpx">
								<view :class="[i <= Math.floor(item.difficulty || 0) ? 'bg-primary-500' : 'bg-gray-300', 'rounded-full w-full h-full']"></view>
							</view>
							<text class="ml-10rpx text-24rpx text-gray-500">{{ item.difficulty || '0.0' }}/3.0</text>
						</view>
					</view>
					
					<!-- 地址信息 -->
					<view class="flex items-center text-xs text-comet-400 mb-15rpx">
						<view class="i-lucide-map-pin w-28rpx h-28rpx mr-10rpx"></view>
						<text class="flex-1">{{ item.address }}</text>
					</view>

					<!-- 特产信息 -->
					<view class="flex flex-wrap gap-10rpx mb-15rpx">
						<view v-for="(tag, tagIndex) in item.specialty" :key="tagIndex"
							class="px-15rpx py-5rpx bg-primary-50 rounded-sm text-xs">
							<text class="text-24rpx text-primary-600">{{ tag }}</text>
						</view>
					</view>
					
					<!-- 底部信息 -->
					<view class="flex items-center justify-between mt-15rpx text-comet-400">
						<view class="flex items-center mr-20rpx">
							<view class="i-lucide-calendar w-28rpx h-28rpx mr-8rpx"></view>
							<text class="text-24rpx">{{ item.season || '全年' }}</text>
						</view>
						<view class="flex items-center text-24rpx ">
							<view class="i-lucide-navigation w-28rpx h-28rpx mr-8rpx"></view>
							<text>{{ item.distance || '未知' }}km</text>
						</view>
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
</style>

<script setup>
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