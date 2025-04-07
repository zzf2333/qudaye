<template>
	<view class="card-grid-list">
		<view v-if="items && items.length > 0" :class="gridClass">
			<component v-for="item in items" :key="item[keyProp]" :is="cardComponent" :item="item" />
			<!-- Pass item data to the card component -->
		</view>
		<view v-else class="empty-state col-span-full text-center py-10 text-gray-400">
			<!-- Ensure empty state spans full width if needed -->
			{{ emptyText }}
		</view>
	</view>
</template>

<script setup>
import { defineProps, markRaw } from 'vue';
// Note: For <component :is="...">, it's generally recommended to pass the actual component object.
// If passing component name as string, ensure it's globally registered or locally imported and registered.
// Passing the component object directly via props is often safer.

const props = defineProps({
	items: {
		type: Array,
		required: true,
		default: () => []
	},
	// Pass the actual imported component object here
	cardComponent: {
		type: Object, // Or String if using globally registered names
		required: true,
		// markRaw is important if passing component objects to prevent reactivity overhead
		default: () => markRaw({})
	},
	keyProp: {
		type: String,
		default: 'id'
	},
	gridClass: {
		type: String,
		default: 'grid grid-cols-2 gap-3' // Default grid layout
	},
	emptyText: {
		type: String,
		default: '暂无数据' // Default empty state text
	}
});
</script>

<style lang="scss" scoped></style>