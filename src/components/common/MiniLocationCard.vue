<template>
	<!-- Add wrapper view with click handler -->
	<view v-if="location" @click="navigateToDetail">
		<view class="mini-location-card bg-gray-50 rounded-lg overflow-hidden">
			<view class="flex items-start">
				<!-- Location image -->
				<view class="w-165rpx h-165rpx flex-shrink-0">
					<image :src="location.cover" mode="aspectFill" class="w-full h-full"></image>
				</view>
				<!-- Location info -->
				<view class="flex-1 p-2">
					<view class="text-base font-medium text-comet-500 mb-1">{{ location.name }}</view>
					<view class="text-xs flex items-center text-comet-300 mb-2 line-clamp-1">
						<view class="i-lucide-map-pin w-28rpx h-28rpx mr-10rpx"></view>
						<text class="flex-1">{{ location.address }}</text>
					</view>
					<view class="text-xs flex items-center text-comet-300">
						<view class="i-lucide-navigation w-28rpx h-28rpx mr-8rpx"></view>
						<text>{{ location.distance || '未知' }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	location: {
		type: Object,
		required: true,
		default: () => null // Default to null if no location data
	}
});

// Navigation function
const navigateToDetail = () => {
	// Ensure location and location.id exist before navigating
	if (props.location && props.location.id) {
		uni.navigateTo({
			url: `/pages/detail/detail?id=${props.location.id}`
		});
	} else {
		console.warn('MiniLocationCard: Missing location id for navigation.', props.location);
		uni.showToast({ title: '无法跳转详情', icon: 'none' });
	}
}
</script>

<style lang="scss" scoped>
/* Optional: Add cursor pointer for web */
/* #ifdef H5 */
.mini-location-card {
	cursor: pointer;
}

/* #endif */
</style>