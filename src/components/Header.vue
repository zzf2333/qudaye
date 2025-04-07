<template>
	<view class="fixed w-full z-1">
		<view class="flex bg-white h-100rpx justify-between items-center shadow-lg c-comet-600">
			<view v-if="leftIcon" class="ml-2 w-36rpx h-36rpx cursor-pointer font-bold" :class="leftIcon" @tap="onLeftClick"></view>
			<view class="flex-1 mx-4">
				<slot name="center">
					<text class="text-md">{{ title }}</text>
				</slot>
			</view>
			<view class="mr-2 w-36rpx h-36rpx cursor-pointer font-bold" :class="rightIcon" @tap="onRightClick"></view>
		</view>
	</view>
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
		default: 'i-lucide-map'
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