<template>
	<view class="flex flex-col items-center justify-center" :class="absolute ? 'absolute-center' : 'h-full w-full'">
		<image src="/src/static/icon/loading.png" class="w-300rpx h-300rpx mb-4" />
		<view class="flex items-center text-primary-600">
			<view class="i-lucide-loader-circle w-36rpx h-36rpx animate-spin mr-2" />
			<text class="text-sm">{{ text }}</text>
		</view>
	</view>
</template>

<script setup>
defineProps({
	text: {
		type: String,
		default: '加载中...'
	},
    absolute: {
        type: Boolean,
        default: false
    }
})
</script>