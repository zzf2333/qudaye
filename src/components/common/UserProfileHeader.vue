<template>
	<view class="user-profile-header bg-white">
		<!-- 顶部用户信息区域 -->
		<view class="user-info-container flex flex-col items-center pt-10 pb-6">
			<!-- 头像 -->
			<view class="avatar-wrapper relative mb-3">
				<image class="avatar-image w-140rpx h-140rpx rounded-full border-2 border-gray-200 shadow-md"
					:src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" @click="handleAvatarClick" />
				<!-- 等级/数字角标 (示例，可根据需要传入) -->
				<view v-if="userInfo.level"
					class="level-badge absolute -bottom-1 -right-1 w-44rpx h-44rpx rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow"
					style="background-color: #10b981;">
					{{ userInfo.level }}
				</view>
			</view>
			<!-- 昵称 -->
			<view class="nickname text-xl font-semibold text-comet-800 mb-1">
				{{ userInfo.nickname || '点击登录' }}
			</view>
			<!-- 地点 -->
			<view class="location text-sm text-comet-400 uppercase tracking-wider">
				{{ userInfo.location || '未知地点' }}
			</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({})
	},
	publishedCount: {
		type: Number,
		default: 0
	}
});

const emit = defineEmits(['avatarClick']);

const handleAvatarClick = () => {
	emit('avatarClick');
};
</script>

<style lang="scss" scoped>
/* 可以添加组件特定的样式 */
</style>