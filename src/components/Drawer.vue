<template>
	<view v-if="visible" class="drawer">
		<view class="mask" @tap="startClose"></view>
		<view :class="['drawer-content', { 'slide-out': isClosing }]" @animationend="onAnimationEnd">
			<!-- 抽屉头部 -->
			<view class="drawer-header">
				<text class="title c-comet-600">{{ title }}</text>
				<view class="i-lucide-x w-40rpx h-40rpx c-comet-600" @tap="onClose"></view>
			</view>

			<!-- 抽屉内容区域 -->
			<view class="drawer-body">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<style>
.drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 100;
}

.mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.4);
	opacity: 1;
	transition: opacity 0.3s ease-out;
}

.slide-out .mask {
	opacity: 0;
}

.drawer-content {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 80%;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	animation: slideIn 0.3s ease-out;
}

.drawer-content.slide-out {
	animation: slideOut 0.3s ease-out forwards;
}

@keyframes slideIn {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(0);
	}
}

@keyframes slideOut {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-100%);
	}
}

.drawer-header {
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #eee;
}

.drawer-header .title {
	font-size: 32rpx;
	font-weight: bold;
}

.drawer-body {
	flex: 1;
	overflow-y: auto;
}
</style>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['update:visible'])

// 关闭状态
const isClosing = ref(false)

// 开始关闭
const startClose = () => {
	isClosing.value = true
}

// 动画结束处理
const onAnimationEnd = (e) => {
	if (isClosing.value) {
		isClosing.value = false
		emit('update:visible', false)
	}
}

// 关闭抽屉
const onClose = () => {
	startClose()
}
</script>