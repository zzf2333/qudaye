<template>
    <view class="bg-comet-50 rounded-lg p-30rpx shadow-sm">
        <view class="flex flex-wrap gap-20rpx">
            <view v-for="(item, index) in modelValue" :key="index"
                class="relative w-150rpx h-150rpx rounded-lg overflow-hidden">
                <image :src="item.url" mode="aspectFill" class="w-full h-full" />
                <!-- 上传状态遮罩 -->
                <view v-if="item.status === 'uploading'" 
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <view class="i-lucide-loader-circle w-36rpx h-36rpx animate-spin text-white" />
                </view>
                <!-- 错误状态遮罩 -->
                <view v-if="item.status === 'error'"
                    class="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center"
                    @click="() => uni.showToast({ title: item.message, icon: 'none' })">
                    <view class="i-lucide-alert-circle w-36rpx h-36rpx text-white" />
                </view>
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
import COS from 'cos-wx-sdk-v5'
import { COS_CONFIG, generateFileKey } from '../config/cos.js'

// 初始化 COS 实例
const cos = new COS({
    SecretId: COS_CONFIG.SecretId,
    SecretKey: COS_CONFIG.SecretKey,
})

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

// 验证文件
const validateFile = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
        const fileType = tempFilePath.substring(tempFilePath.lastIndexOf('.')).toLowerCase()
        if (!allowedTypes.some(type => type.includes(fileType.slice(1)))) {
            reject('只支持 JPG、PNG、GIF 格式的图片')
            return
        }

        // 验证文件大小
        uni.getFileInfo({
            filePath: tempFilePath,
            success: (res) => {
                const maxSize = 5 * 1024 * 1024 // 5MB
                if (res.size > maxSize) {
                    reject('图片大小不能超过 5MB')
                    return
                }
                resolve()
            },
            fail: () => reject('获取文件信息失败')
        })
    })
}

// 上传文件
const uploadFile = async (tempFilePath, index) => {
    try {
        const fileKey = generateFileKey(tempFilePath)
        
        await new Promise((resolve, reject) => {
            cos.postObject({
                Bucket: COS_CONFIG.Bucket,
                Region: COS_CONFIG.Region,
                Key: fileKey,
                FilePath: tempFilePath,
                onProgress: (info) => {
                    // 更新上传进度
                    const updatedImages = [...props.modelValue]
                    updatedImages[index] = {
                        ...updatedImages[index],
                        progress: Math.floor(info.percent * 100)
                    }
                    emit('update:modelValue', updatedImages)
                }
            }, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(data)
            })
        })

        // 更新图片状态为成功
        const imageUrl = `https://${COS_CONFIG.Bucket}.cos.${COS_CONFIG.Region}.myqcloud.com/${fileKey}`
        const updatedImages = [...props.modelValue]
        updatedImages[index] = {
            url: imageUrl,
            status: 'success',
            message: '上传成功'
        }
        emit('update:modelValue', updatedImages)
    } catch (error) {
        console.error(error)
        // 更新图片状态为失败
        const updatedImages = [...props.modelValue]
        updatedImages[index] = {
            ...updatedImages[index],
            status: 'error',
            message: error.message || '上传失败'
        }
        emit('update:modelValue', updatedImages)
    }
}

// 选择图片
const chooseImage = () => {
    uni.chooseImage({
        count: props.maxCount - props.modelValue.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
            for (let i = 0; i < res.tempFilePaths.length; i++) {
                const tempFilePath = res.tempFilePaths[i]
                try {
                    await validateFile(tempFilePath)
                    const newImage = {
                        url: tempFilePath,
                        status: 'uploading',
                        message: '上传中'
                    }
                    const newImages = [...props.modelValue, newImage]
                    emit('update:modelValue', newImages)
                    const index = newImages.length - 1
                    await uploadFile(tempFilePath, index)
                } catch (error) {
                    uni.showToast({
                        title: error.message || error,
                        icon: 'none'
                    })
                }
            }
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