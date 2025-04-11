<template>
    <view class="tag-input">
        <!-- 标签展示区域 -->
        <view class="flex mb-2 flex-wrap">
            <view v-for="(tag, index) in modelValue" :key="index" class="bg-comet-400 flex justify-center items-center px-3 py-2 rounded-lg text-white mr-2 mt-2">
                <text>{{ tag }}</text>
                <view @click.stop="removeTag(index)">
                    <view class="i-lucide-x w-28rpx h-28rpx ml-2"></view>
                </view>
            </view>
        </view>
        <!-- 输入框区域 -->
        <view class="flex items-center justify-center relative">
            <input type="text" v-model="inputValue" :placeholder="placeholder" @keypress.enter.prevent="addTag"
                class="input flex-1" />
            <view @click="addTag" class="i-lucide-square-plus text-2xl c-comet-600 m-auto z-11 absolute right-20"></view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    placeholder: {
        type: String,
        default: '输入标签后按回车或点击添加'
    },
    maxTags: {
        type: Number,
        default: 10
    }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')

// 添加标签
const addTag = () => {
    const value = inputValue.value.trim()
    if (!value) return

    console.log(value)

    if (props.modelValue.includes(value)) {
        uni.showToast({
            title: '该标签已存在',
            icon: 'none'
        })
        return
    }

    if (props.modelValue.length >= props.maxTags) {
        uni.showToast({
            title: `最多添加${props.maxTags}个标签`,
            icon: 'none'
        })
        return
    }

    emit('update:modelValue', [...props.modelValue, value])
    inputValue.value = ''
}

// 删除标签
const removeTag = (index) => {
    const newTags = [...props.modelValue]
    newTags.splice(index, 1)
    emit('update:modelValue', newTags)
}
</script>

<style lang="scss" scoped>
</style>