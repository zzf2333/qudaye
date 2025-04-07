<template>
    <view class="bg-comet-50 rounded-lg p-30rpx shadow-sm">
        <view class="flex flex-wrap gap-20rpx">
            <view v-for="(item, index) in modelValue" :key="index"
                class="relative w-150rpx h-150rpx rounded-lg overflow-hidden">
                <image :src="item.url" mode="aspectFill" class="w-full h-full" />
                <view
                    class="absolute top-10rpx right-10rpx w-40rpx h-40rpx bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                    @click="deleteImage(index)">
                    <text class="text-white text-24rpx">×</text>
                </view>
            </view>
            <view v-if="modelValue.length < maxCount"
                class="w-150rpx h-150rpx rounded-lg border-2 border-dashed border-comet-300 flex items-center justify-center"
                @click="chooseImage">
                <view class="i-lucide-camera text-comet-500 w-60rpx h-60rpx"></view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    maxCount: {
        type: Number,
        default: 6
    }
})

const emit = defineEmits(['update:modelValue'])

// 选择图片
const chooseImage = () => {
    uni.chooseImage({
        count: props.maxCount - props.modelValue.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            const newImages = res.tempFilePaths.map(url => ({
                url,
                status: 'uploading',
                message: '上传中'
            }))
            emit('update:modelValue', [...props.modelValue, ...newImages])
        }
    })
}

// 删除图片
const deleteImage = (index) => {
    const updatedImages = [...props.modelValue]
    updatedImages.splice(index, 1)
    emit('update:modelValue', updatedImages)
}
</script>