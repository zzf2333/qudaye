<template>
	<view class="no-data-container flex flex-col items-center justify-center py-10">
		<image src="/static/icon/nodata.png" class="w-300rpx h-300rpx mb-4" mode="aspectFit" />
		<text class="text-comet-300 text-sm">{{ text }}</text>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	text: {
		type: String,
		default: '暂无数据'
	}
});
</script>

<style lang="scss" scoped>
.no-data-container {
	min-height: 300rpx;
}
</style>