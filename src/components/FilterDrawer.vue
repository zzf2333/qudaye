<template>
	<uni-drawer ref="drawerRef" title="标签筛选" @change="handleVisibleChange">
		<scroll-view scroll-y class="py-6" :class="$isH5 ? '' : 'pt-65px'">
			<view v-for="category in categories" :key="category.id" class="mb-10 px-4">
				<view class="text-xs c-comet-400 mb-3">{{ category.name }}</view>
				<view class="flex flex-wrap gap-[20rpx]">
					<view
						v-for="tag in category.tags"
						:key="tag.id"
						:class="[
							'px-4 py-2 text-xs bg-block rounded-md bg-comet-50',
							{ 'bg-comet-600 text-white': selectedTags.includes(tag.id) }
						]"
						@tap="toggleTag(tag.id)"
					>
						{{ tag.name }}
					</view>
				</view>
			</view>
		</scroll-view>
	</uni-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:visible', 'confirm'])

// 抽屉组件引用
const drawerRef = ref(null)

// 监听外部 visible 属性变化
watch(() => props.visible, (newVal) => {
	if (newVal) {
		drawerRef.value?.open()
	} else {
		drawerRef.value?.close()
	}
})

// 处理抽屉显示状态变化
const handleVisibleChange = (val) => {
	if(!val) emit('update:visible', false)
}

// 分类和标签数据
const categories = ref([
	{
		id: 1,
		name: '餐饮',
		tags: [
			{ id: 11, name: '中餐' },
			{ id: 12, name: '西餐' },
			{ id: 13, name: '日料' },
			{ id: 14, name: '韩餐' },
			{ id: 15, name: '火锅' }
		]
	},
	{
		id: 2,
		name: '购物',
		tags: [
			{ id: 21, name: '超市' },
			{ id: 22, name: '商场' },
			{ id: 23, name: '便利店' },
			{ id: 24, name: '市场' }
		]
	},
	{
		id: 3,
		name: '休闲',
		tags: [
			{ id: 31, name: '电影院' },
			{ id: 32, name: '咖啡厅' },
			{ id: 33, name: '茶馆' },
			{ id: 34, name: '健身房' },
			{ id: 35, name: '公园' }
		]
	}
])

// 已选中的标签
const selectedTags = ref([])

// 切换标签选中状态
const toggleTag = (tagId) => {
    selectedTags.value = [tagId]
    onConfirm()
}

// 确认选择
const onConfirm = () => {
	emit('confirm', selectedTags.value)
	emit('update:visible', false)
}
</script>