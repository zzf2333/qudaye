<template>
	<uni-nav-bar
		:fixed="true"
		:status-bar="true"
		:border="false"
		:height="$isH5 ? '44px' : '48px'"
		shadow
	>
		<template #left>
			<view v-if="leftIcon" class="w-36rpx h-36rpx cursor-pointer" :class="leftIcon" @click="onLeftClick"></view>
		</template>
		
		<view class="flex-1 flex items-center" v-if="$slots.center">
			<slot name="center"></slot>
		</view>
		<view class="flex-1 flex items-center" v-else>
			<text class="text-base font-medium">{{ title }}</text>
		</view>
		
		<template #right>
			<view v-if="rightIcon" class="w-36rpx h-36rpx cursor-pointer" :class="rightIcon" @click="onRightClick"></view>
		</template>
	</uni-nav-bar>
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	leftIcon: {
		type: String,
		default: ''
	},
	rightIcon: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['leftClick', 'rightClick'])

const onLeftClick = () => {
	emit('leftClick')
}

const onRightClick = () => {
	emit('rightClick')
}
</script>