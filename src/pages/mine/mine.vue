<template>
	<view class="profile-page bg-comet-50 min-h-screen"> 
		<view class="bg-white">
			<!-- 用户信息头部 -->
			<UserProfileHeader 
				:user-info="userInfo" 
				:activity-data="activityData" 
				:published-count="publishedCount"
				@avatarClick="handleAvatarClick" 
			></UserProfileHeader>
		</view>
		
		<!-- Tab 视图 -->
		<TabbedView :tabs="tabList" v-model="currentTab">
			<!-- 收藏列表插槽 -->
			<template #tab-0>
				<view class="content-container p-3">
					<view v-if="isLoadingFavorites" class="text-center py-10 text-gray-400">加载收藏中...</view>
					<CardGridList 
						v-else
						:items="favoriteList"
						:card-component="markRaw(LocationCard)" 
						empty-text="暂无收藏" 
					></CardGridList> <!-- Correctly closed tag -->
				</view>
			</template>

			<!-- 发布列表插槽 -->
			<template #tab-1>
				<view class="content-container p-3">
					<view v-if="isLoadingPublished" class="text-center py-10 text-gray-400">加载发布中...</view>
					<CardGridList 
						v-else
						:items="publishedList"
						:card-component="markRaw(LocationCard)" 
						empty-text="暂无发布" 
					></CardGridList> <!-- Correctly closed tag -->
				</view>
			</template>

			<!-- 评论列表插槽 -->
			<template #tab-2>
				<view class="content-container p-3">
					<view v-if="isLoadingComments" class="text-center py-10 text-gray-400">加载评论中...</view>
					<view v-else class="space-y-3">
						<CommentItem v-for="comment in commentList" :key="comment.id" :comment="comment" /> <!-- Use commentList from composable -->
						<!-- Corrected empty state check with && -->
						<view v-if="!isLoadingComments &amp;&amp; commentList.length === 0" class="text-center py-10 text-gray-400">暂无评论</view>
					</view>
				</view>
			</template>
		</TabbedView>

	</view>
</template>

<script setup>
import { ref, computed, markRaw, watch } from 'vue'; // Import watch
import { useUserStore } from '@/store/modules/user';
import { onShow } from '@dcloudio/uni-app';
import LocationCard from '@/components/common/LocationCard.vue'; 
import UserProfileHeader from '@/components/common/UserProfileHeader.vue';
import TabbedView from '@/components/common/TabbedView.vue'; 
import CommentItem from '@/components/common/CommentItem.vue'; 
import CardGridList from '@/components/common/CardGridList.vue'; 
import { useUserProfile } from '@/composables/useUserProfile'; // Import the composable

const userStore = useUserStore();
const currentTab = ref(0); 
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