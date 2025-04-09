<template>
	<uni-popup ref="popup" type="top">
		<view class="comment-dialog bg-white rounded-b-lg p-4" :class="$isH5 ? '' : 'pt-65px'">
			<view class="flex justify-between items-center mb-4">
				<text class="text-lg font-bold">发表评论</text>
				<view class="i-lucide-x text-comet-400" @tap="handleClose"></view>
			</view>

			<textarea v-model="commentText" class="w-full min-h-120px p-3 mb-4 bg-gray-50 rounded-lg text-sm"
				placeholder="写下你的评论..." :maxlength="maxLength" />

			<view class="flex justify-end items-center gap-3">
				<view class="px-4 py-3 flex-1 text-center rounded-lg shadow border bg-comet-50 border-gray-200 text-sm" @tap="handleClose">
					取消
				</view>
				<view class="px-4 py-3 flex-1 text-center rounded-lg shadow bg-primary-500 text-white text-sm" :disabled="!commentText.trim()"
					@tap="handleSubmit">
					发布
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref } from 'vue';

const popup = ref(null);
const commentText = ref('');
const maxLength = 500;

const emit = defineEmits(['submit']);

const open = () => {
	popup.value?.open();
};

const handleClose = () => {
	popup.value?.close();
	commentText.value = '';
};

const handleSubmit = () => {
	if (!commentText.value.trim()) return;
	emit('submit', commentText.value.trim());
	handleClose();
};

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.comment-dialog {
	min-height: 300px;
}
</style>