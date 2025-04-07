<template>
	<view class="list-card bg-white rounded-lg shadow-sm overflow-hidden">
        <view class="h-300rpx w-full rounded-t-lg bg-gray-200 overflow-hidden relative">
            <image :src="item.cover" mode="aspectFill" class="w-full h-full block"></image>
            <!-- 特产信息 -->
            <view class="absolute bottom-10rpx right-10rpx flex flex-wrap gap-10rpx justify-end max-w-[70%]">
                <view v-for="(tag, tagIndex) in item.specialty" :key="tagIndex"
                    class="px-10rpx py-5rpx bg-primary-500 bg-opacity-50 rounded-sm">
                    <text class="text-xs text-white">{{ tag }}</text>
                </view>
            </view>
        </view>
        <view class="p-2">
            <!-- 标题和评分 -->
            <view class="flex items-center justify-between mb-10rpx">
                <view class="flex items-center">
                    <text class="mr-10rpx">{{ getCategoryEmoji(item.category) }}</text>
                    <text class="text-base text-comet-800 font-bold">{{ item.name }}</text>
                </view>
            </view>
            <!-- 底部信息 -->
            <view class="flex items-center justify-between mt-15rpx text-comet-300">
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
</template>

<script setup>
import { categories } from '@/config/categories';
defineProps({
	item: {
		type: Object,
		required: true,
		default: () => ({})
	}
});

const getCategoryEmoji = (category) => {
	const found = categories.find(c => c.value === category)
	return found ? found.emoji : '☘️'
}
</script>

<style lang="scss" scoped>
.list-card {
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}
</style>