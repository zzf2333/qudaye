<template>
	<view class="comment-item bg-white rounded-lg p-3 flex">
		<view v-if="mode === 'detail'" class="w-64 h-64 rounded-full overflow-hidden mr-2">
			<image :src="comment.user?.avatar" class="w-full h-full" />
		</view>
		<view class="flex-1">
			<!-- 评论者信息 -->
			<view class="flex items-start mb-2">
				<template v-if="mode === 'detail'">
					<view class="flex-1">
						<view class="text-26 text-comet-300">{{ comment.user?.name }}</view>
					</view>
					<view class="text-xs text-comet-300">{{ comment.createdAt }}</view>
				</template>
				<template v-else>
					<view class="text-xs text-comet-300">{{ comment.time }}</view>
				</template>
			</view>
			<!-- 评论内容 -->
			<view class="text-26 text-comet-600 mb-3">{{ comment.content }}</view>
			<!-- 地点信息卡片 (Using MiniLocationCard component) -->
			<MiniLocationCard v-if="mode !== 'detail'" :location="comment.target" />
		</view>
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
	},
	mode: {
		type: String,
		default: 'list',
		validator: (value) => ['list', 'detail'].includes(value)
	}
});
</script>

<style lang="scss" scoped>
</style>