<template>
	<view class="card-grid-list">
		<view v-if="items && items.length > 0" :class="gridClass">
			<template v-for="item in items" :key="item[keyProp]">
				<LocationCard v-if="cardType === 'LocationCard'" :item="item" />
				<CommentItem v-else-if="cardType === 'CommentItem'" :item="item" />
				<!-- Add more card types as needed -->
			</template>
		</view>
		<NoData v-else :text="emptyText" />
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
import NoData from '../NoData.vue';
import LocationCard from './LocationCard.vue';
import CommentItem from './CommentItem.vue';

const props = defineProps({
	items: {
		type: Array,
		required: true,
		default: () => []
	},
	cardType: {
		type: String,
		required: true,
		validator: (value) => ['LocationCard', 'CommentItem'].includes(value)
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