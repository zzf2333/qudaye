<template>
	<view class="bg-white rounded-lg shadow-md overflow-hidden mb-4 animate-pulse">
		<!-- 图片占位 -->
		<view class="h-300rpx w-full bg-gray-200"></view>
		
		<view class="p-20rpx">
			<!-- 标题和评分占位 -->
			<view class="flex items-center justify-between mb-10rpx">
				<view class="flex items-center">
					<view class="w-30rpx h-30rpx bg-gray-200 rounded-full mr-10rpx"></view>
					<view class="w-200rpx h-30rpx bg-gray-200 rounded"></view>
				</view>
				<view class="flex items-center">
					<view v-for="i in 3" :key="i" class="w-24rpx h-24rpx mx-2rpx bg-gray-200 rounded-full"></view>
				</view>
			</view>
			
			<!-- 地址占位 -->
			<view class="flex items-center mb-15rpx">
				<view class="w-28rpx h-28rpx bg-gray-200 rounded mr-10rpx"></view>
				<view class="w-300rpx h-24rpx bg-gray-200 rounded"></view>
			</view>

			<!-- 底部信息占位 -->
			<view class="flex items-center justify-between mt-15rpx">
				<view class="flex items-center mr-20rpx">
					<view class="w-28rpx h-28rpx bg-gray-200 rounded mr-8rpx"></view>
					<view class="w-100rpx h-24rpx bg-gray-200 rounded"></view>
				</view>
				<view class="flex items-center">
					<view class="w-28rpx h-28rpx bg-gray-200 rounded mr-8rpx"></view>
					<view class="w-80rpx h-24rpx bg-gray-200 rounded"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<style>
.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: .5;
	}
}
</style>