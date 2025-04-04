<template>
  <view class="publish-container">
    <view class="form-section">
      <up-form :model="formData" ref="uForm">
        <up-form-item label="标题" prop="title">
          <up-input v-model="formData.title" placeholder="请输入标题" />
        </up-form-item>
        
        <up-form-item label="描述" prop="description">
          <up-textarea v-model="formData.description" placeholder="请输入描述信息" />
        </up-form-item>
        
        <up-form-item label="图片" prop="images">
          <up-upload
            :fileList="formData.images"
            @afterRead="afterRead"
            @delete="deletePic"
            name="1"
            multiple
            :maxCount="9"
          />
        </up-form-item>
      </up-form>
    </view>
    
    <view class="submit-section">
      <up-button type="primary" @click="submitForm">发布</up-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  title: '',
  description: '',
  images: []
})

const uForm = ref(null)

// 图片上传后的回调
const afterRead = (event) => {
  const { file } = event
  formData.value.images.push({
    url: file.url,
    status: 'uploading',
    message: '上传中'
  })
  // TODO: 实现图片上传到服务器的逻辑
}

// 删除图片
const deletePic = (event) => {
  const index = event.index
  formData.value.images.splice(index, 1)
}

// 提交表单
const submitForm = () => {
  uForm.value.validate(valid => {
    if (valid) {
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      })
      // TODO: 实现表单提交逻辑
    }
  })
}
</script>

<style lang="scss">
.publish-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  
  .form-section {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
  }
  
  .submit-section {
    padding: 20rpx;
  }
}
</style>