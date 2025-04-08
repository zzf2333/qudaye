<template>
	<view class="tabbed-view">
		<!-- Tab 切换区域 -->
		<view class="tabs-container flex border-b bg-white"> <!-- Added bg-white for consistency -->
			<view v-for="(tab, index) in tabs" :key="index"
				class="tab-item flex-1 py-3 text-center text-sm font-medium cursor-pointer relative c-comet-500"
				:class="{ 'c-primary-500': modelValue === index }" @click="handleTabClick(index)">
				{{ tab.name }}
				<!-- Active state indicator (underline) -->
				<view v-if="modelValue === index"
					class="active-indicator bg-primary-500 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-4 rounded-full"
					:style="{ width: indicatorWidth }"></view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="tab-content">
			<!-- Use dynamic component or v-show based on slots -->
			<slot :name="`tab-${modelValue}`">
				<!-- Default content if slot is not provided -->
			</slot>
		</view>
	</view>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
	tabs: {
		type: Array,
		required: true,
		default: () => [] // e.g., [{ name: 'Tab 1' }, { name: 'Tab 2' }]
	},
	modelValue: { // Used for v-model
		type: Number,
		required: true,
		default: 0
	},
	indicatorWidth: { // Optional prop for indicator style
		type: String,
		default: '60%'
	}
});

const emit = defineEmits(['update:modelValue']);

const handleTabClick = (index) => {
	if (props.modelValue !== index) {
		emit('update:modelValue', index);
	}
};

// Example of using computed if needed, e.g., for dynamic styles
// const activeTabStyle = computed(() => { ... });
</script>

<style lang="scss" scoped>
.tab-item {
	transition: color 0.3s ease;
	// Ensure enough touch area
	min-height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.active-indicator {
	transition: width 0.3s ease;
}
</style>