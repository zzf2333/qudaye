<template>
  <view class="mine-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <u-avatar
        :src="userInfo.avatar || '/static/default-avatar.png'"
        size="140"
        @click="handleAvatarClick"
      />
      <view class="user-name">{{ userInfo.nickname || '未登录' }}</view>
      <view class="user-id" v-if="userInfo.id">ID: {{ userInfo.id }}</view>
    </view>
    
    <!-- 功能列表区域 -->
    <view class="function-section">
      <u-cell-group>
        <u-cell
          title="我的发布"
          icon="edit-pen"
          isLink
          @click="handleNavigate('/pages/my-posts/index')"
        />
        <u-cell
          title="我的收藏"
          icon="star"
          isLink
          @click="handleNavigate('/pages/my-favorites/index')"
        />
      </u-cell-group>
    </view>
    
    <!-- 系统设置区域 -->
    <view class="setting-section">
      <u-cell-group>
        <u-cell
          title="账号安全"
          icon="lock"
          isLink
          @click="handleNavigate('/pages/account-security/index')"
        />
        <u-cell
          title="关于我们"
          icon="info-circle"
          isLink
          @click="handleNavigate('/pages/about/index')"
        />
        <u-cell
          v-if="userInfo.id"
          title="退出登录"
          icon="logout"
          @click="handleLogout"
        />
      </u-cell-group>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import userApi from '@/api/user'

const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await userApi.getUserInfo()
    userStore.setUserInfo(res.data)
    userInfo.value = res.data
  } catch (error) {
    console.error('获取用户信息失败：', error)
  }
}

// 处理头像点击
const handleAvatarClick = () => {
  if (!userInfo.value.id) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }
}

// 页面跳转
const handleNavigate = (url) => {
  if (!userInfo.value.id) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return
  }
  uni.navigateTo({ url })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        userInfo.value = {}
      }
    }
  })
}

onMounted(() => {
  if (userStore.token) {
    getUserInfo()
  }
})
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  
  .user-info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;
    background-color: #fff;
    margin-bottom: 20rpx;
    
    .user-name {
      margin-top: 20rpx;
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .user-id {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .function-section,
  .setting-section {
    margin-bottom: 20rpx;
  }
}
</style>