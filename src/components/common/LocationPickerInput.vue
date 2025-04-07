<template>
	<view class="location-picker-input">
		<view class="input flex items-center justify-center cursor-pointer" @click="openMap">
			<view class="flex-1">
				<!-- Display the selected address using the modelValue prop -->
				<input class="w-full outline-none text-sm" :value="modelValue" :placeholder="placeholder" disabled />
			</view>
			<view class="i-lucide-map-pin text-comet-500 w-36rpx h-36rpx"></view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	modelValue: { // For v-model binding (address string)
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: '点击选择位置'
	}
});

const emit = defineEmits(['update:modelValue', 'locationSelected']);

const openMap = () => {
	uni.chooseLocation({
		// Optionally pass initial latitude/longitude if available
		// latitude: initialLat, 
		// longitude: initialLng,
		success: (res) => {
			// Update the address string via v-model
			emit('update:modelValue', res.address);

			// Emit the full location details
			emit('locationSelected', {
				address: res.address,
				latitude: res.latitude,
				longitude: res.longitude,
				name: res.name // Include the location name if needed
			});
		},
		fail: (err) => {
			console.error('chooseLocation failed:', err);
			uni.showToast({
				title: '位置选择失败',
				icon: 'none'
			});
		}
	});
};
</script>

<style lang="scss" scoped>
</style>