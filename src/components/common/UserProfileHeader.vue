<template>
	<view class="user-profile-header bg-white">
		<!-- 顶部用户信息区域 -->
		<view class="user-info-container flex flex-col items-center pt-10 pb-6">
			<!-- 头像 -->
			<view class="avatar-wrapper relative mb-3">
				<image class="avatar-image w-140rpx h-140rpx rounded-full border-2 border-gray-200 shadow-md"
					:src="userProfile.avatar || '/static/logo.png'" mode="aspectFill" @click="handleAvatarClick" />
				<!-- 等级/数字角标 (示例，可根据需要传入) -->
				<view
					class="bg-primary-500 absolute -bottom-1 -right-1 w-44rpx h-44rpx rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow">
					{{ publishedCount }}
				</view>
			</view>
			<!-- 昵称 -->
			<view @click="!isLoggedIn && login()" class="nickname text-xl font-semibold text-comet-800 mb-1">
				{{ userProfile.nickname || '点击登录' }}
			</view>
			<!-- 地点 -->
			<view class="location text-sm text-comet-400 uppercase tracking-wider">
				{{ userProfile.city ? `${userProfile.province}.${userProfile.city}` : '未知地点' }}
			</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useUserStore } from '@/store/modules/user';

const props = defineProps({
	publishedCount: {
		type: Number,
		default: 0
	}
});

const emit = defineEmits(['avatarClick']);
const userStore = useUserStore();

// 使用 computed 属性来获取用户信息
const isLoggedIn = computed(() => userStore.token);
const userProfile = computed(() => userStore.userInfo || {});

const handleAvatarClick = () => {
	emit('avatarClick');
};

async function login() {
	try {
		await userStore.loginWithWeixin();
	} catch (error) {
		console.error('登录失败：', error);
	}
}
</script>

<style lang="scss" scoped>
/* 可以添加组件特定的样式 */
</style>