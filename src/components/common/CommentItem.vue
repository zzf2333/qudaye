<template>
	<view class="comment-item bg-white rounded-lg shadow-sm p-4">
		<!-- 评论者信息 -->
		<view class="flex items-start mb-2">
			<view class="text-xs text-comet-300">{{ comment.time }}</view>
		</view>
		<!-- 评论内容 -->
		<view class="text-sm text-comet-800 mb-3">{{ comment.content }}</view>
		<!-- 地点信息卡片 (Using MiniLocationCard component) -->
		<MiniLocationCard :location="comment.target" />
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
import MiniLocationCard from './MiniLocationCard.vue'; // Import MiniLocationCard

const props = defineProps({
	comment: {
		type: Object,
		required: true,
		default: () => ({})
	}
});
</script>

<style lang="scss" scoped>
</style>