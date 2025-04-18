<template>
	<view class="profile-page bg-comet-50 min-h-screen"> 
		<view class="bg-white" :class="$isH5 ? '' : 'pt-65px'">
			<!-- 用户信息头部 -->
			<UserProfileHeader 
				ref="userProfileHeader"
				:user-info="userInfo" 
				:published-count="publishedCount"
				@avatarClick="handleAvatarClick" 
			>
			</UserProfileHeader>
		</view>
		<!-- Tab 视图 -->
		<TabbedView :tabs="tabList" v-model="currentTab"></TabbedView>
		<view class="tab-content">
			<!-- 收藏列表 -->
			<view v-show="currentTab === 0" class="content-container p-3">
				<Loading v-if="isLoadingFavorites" text="加载收藏中" />
				<CardGridList 
					v-else
					card-type="LocationCard"
					:items="favoriteList"
					:card-component="markRaw(LocationCard)" 
					empty-text="暂无收藏" 
				></CardGridList>
			</view>

			<!-- 发布列表 -->
			<view v-show="currentTab === 1" class="content-container p-3">
				<Loading v-if="isLoadingPublished" text="加载发布中" />
				<CardGridList 
					v-else
					card-type="LocationCard"
					:items="publishedList"
					:card-component="markRaw(LocationCard)" 
					empty-text="暂无发布" 
				></CardGridList>
			</view>

			<!-- 评论列表 -->
			<view v-show="currentTab === 2" class="content-container p-3">
				<Loading v-if="isLoadingComments" text="加载评论中" />
				<view v-else class="space-y-3">
					<CommentItem v-for="comment in commentList" :key="comment.id" :comment="comment" />
					<view v-if="!isLoadingComments && commentList.length === 0" class="text-center py-10 text-gray-400">暂无评论</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, markRaw, watch, getCurrentInstance } from 'vue'; // Import watch
import { useUserStore } from '@/store/modules/user';
import { onShow, onReady, onUnload } from '@dcloudio/uni-app';
import LocationCard from '@/components/common/LocationCard.vue'; 
import UserProfileHeader from '@/components/common/UserProfileHeader.vue';
import TabbedView from '@/components/common/TabbedView.vue'; 
import CommentItem from '@/components/common/CommentItem.vue'; 
import CardGridList from '@/components/common/CardGridList.vue'; 
import Loading from '@/components/Loading.vue';
import { useUserProfile } from '@/composables/useUserProfile'; // Import the composable

const userStore = useUserStore();
const currentTab = ref(0);
const chartRenderer = ref(null);
const tabList = ref([ 
	{ name: '收藏' },
	{ name: '发布' },
	{ name: '评论' },
]);

// --- Use the User Profile Composable ---
const {
	isLoading, // Consider if this top-level loading is needed or just tab-specific ones
    isLoadingFavorites,
    isLoadingPublished,
    isLoadingComments,
    userInfo, 
    favoriteList,
    publishedList,
    commentList,
    activityData,
    publishedCount,
    loadTabData, 
    fetchUserInfo // Can be used to explicitly refresh
} = useUserProfile();

// Use computed for reactive access to store state if needed outside composable
const reactiveUserInfoFromStore = computed(() => userStore.userInfo);

// --- Methods ---

// Handle avatar click: Navigate to login if not logged in
const handleAvatarClick = () => {
	// Access userInfo from the composable
	if (!userInfo.value || !userInfo.value.id) { 
		console.log('User not logged in, navigating to login.');
		uni.navigateTo({
			url: '/pages/login/index', // Adjust login page path if needed
		});
	} else {
		console.log('User logged in, avatar clicked.');
		// Optional: Navigate to profile edit page
		// uni.navigateTo({ url: '/pages/profile-edit/index' });
	}
};

// Handle logout
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				userStore.logout(); // Call store action
				// Composable's watcher should handle resetting state
				currentTab.value = 0; // Reset tab
				// Navigate to index or login page after logout
				uni.reLaunch({ url: '/pages/index/index' }); 
			}
		},
	});
};

// Watch for tab changes to load data
watch(currentTab, (newTabIndex) => {
	if (userStore.token) { // Only load if logged in
		loadTabData(newTabIndex);
	}
}, { immediate: true }); // Load data for the initial tab immediately

// 监听数据变化，触发重绘
watch(() => activityData.value, (newVal) => {
	if (chartRenderer.value && newVal && newVal.length > 0) {
		chartRenderer.value.setActivityData(newVal);
	}
}, { deep: true });

// 组件卸载时清理
onUnload(() => {
	if (chartRenderer.value) {
		chartRenderer.value.destroy();
	}
});

// onShow: Ensure user info is fresh and load initial tab data if logged in
onShow(() => {
	if (userStore.token) {
		// fetchUserInfo(); // Explicitly refresh user info if needed on every show
		// Ensure data for the current tab is loaded (or reloaded if necessary)
		loadTabData(currentTab.value); 
	} else {
		console.log('User has no token on show.');
		// State should be reset by the watcher inside useUserProfile
	}
});
</script>

<style lang="scss">
/* Keep existing styles or add new ones */
</style>