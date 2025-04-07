<template>
	<view class="profile-page bg-comet-50"> 
		<view class="bg-white">
			<!-- 顶部用户信息区域 -->
			<view class="user-info-container flex flex-col items-center pt-10 pb-6">
				<!-- 头像 -->
				<view class="avatar-wrapper relative mb-3">
					<image class="avatar-image w-140rpx h-140rpx rounded-full border-2 border-gray-200 shadow-md"
						:src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" @click="handleAvatarClick" />
					<!-- 等级/数字角标 -->
					<view
						class="level-badge absolute -bottom-1 -right-1 w-44rpx h-44rpx rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow"
						style="background-color: #10b981;"> <!-- 使用图片中的绿色 -->
						27
					</view>
				</view>
				<!-- 昵称 -->
				<view class="nickname text-xl font-semibold text-comet-800 mb-1">
					{{ userInfo.nickname || '点击登录' }}
				</view>
				<!-- 地点 -->
				<view class="location text-sm text-comet-400 uppercase tracking-wider">
					{{ userInfo.location || '未知地点' }} <!-- 示例：POZNAŃ, POLAND -->
				</view>
			</view>

			<!-- 统计区域 -->
			<view class="stats-container flex items-end justify-center px-6 pb-6">
				<!-- Check-ins 数量 -->
				<view class="check-ins mr-6 text-right">
					<view class="label text-xs text-gray-400 uppercase tracking-wider mb-1">发布点位</view>
					<view class="value text-4xl font-bold text-comet-800 leading-none">
						72 <!-- 实际数据 -->
					</view>
				</view>
				<!-- 活跃度图表 -->
				<ActivityChart :activity-data="activityData" />
			</view>
			<!-- Tab 切换区域 -->
			<view class="tabs-container flex border-b">
				<view v-for="(tab, index) in tabList" :key="index"
					class="tab-item flex-1 py-3 text-center text-sm font-medium cursor-pointer relative c-comet-500"
					:class="{ 'c-primary-500': currentTab === index }" @click="handleTabChange(index)">
					{{ tab.name }}
					<!-- Active state indicator (underline) -->
					<view v-if="currentTab === index"
						class="bg-primary-500 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full"
						></view>
				</view>
			</view>
		</view>
		
		<!-- 内容列表区域 -->
		<view class="content-container p-3"> <!-- 背景色设为浅灰 -->
			<!-- 收藏列表 -->
			<view v-show="currentTab === 0" class="grid grid-cols-2 gap-3">
				<LocationCard v-for="item in favoriteList" :key="item.id" :item="item" />
				<view v-if="favoriteList.length === 0" class="col-span-2 text-center py-10 text-gray-400">暂无收藏</view>
			</view>

			<!-- 发布列表 -->
			<view v-show="currentTab === 1" class="grid grid-cols-2 gap-3">
				<LocationCard v-for="item in publishedList" :key="item.id" :item="item" />
				<view v-if="publishedList.length === 0" class="col-span-2 text-center py-10 text-gray-400">暂无发布</view>
			</view>

			<!-- 评论列表 (暂时沿用之前的单列样式) -->
			<view v-show="currentTab === 2" class="space-y-3">
				<view v-for="comment in commentList" :key="comment.id"
					class="comment-item bg-white rounded-lg shadow-sm p-4">
					<!-- 评论者信息 -->
					<view class="flex items-start mb-3">
						<view class="w-60rpx h-60rpx rounded-full mr-2 flex-shrink-0">
							<image :src="comment.userAvatar" class="w-full h-full block"></image>
						</view>
						<view class="flex-1">
							<view class="text-sm font-medium text-comet-600">{{ comment.userName }}</view>
							<view class="text-xs text-comet-300">{{ comment.time }}</view>
						</view>
					</view>
					<!-- 评论内容 -->
					<view class="text-sm text-comet-800 mb-3">{{ comment.content }}</view>
					<!-- 地点信息卡片 -->
					<view class="bg-gray-50 rounded-lg overflow-hidden">
						<view class="flex items-start">
							<!-- 地点图片 -->
							<view class="w-165rpx h-165rpx flex-shrink-0">
								<image :src="comment.target.cover" mode="aspectFill" class="w-full h-full"></image>
							</view>
							<!-- 地点信息 -->
							<view class="flex-1 p-2">
								<view class="text-base font-medium text-comet-500 mb-1">{{ comment.target.name }}</view>
								<view class="text-xs flex items-center text-comet-300 mb-2 line-clamp-1">
									<view class="i-lucide-map-pin w-28rpx h-28rpx mr-10rpx"></view>
									<text class="flex-1">{{  comment.target.address }}</text>
								</view>
								<view class="text-xs flex items-center text-comet-300">
									<view class="i-lucide-navigation w-28rpx h-28rpx mr-8rpx"></view>
                    				<text>{{ comment.target.distance || '未知' }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="commentList.length === 0" class="text-center py-10 text-gray-400">暂无评论</view>
			</view>
		</view>
		<!-- 内容列表区域 (后续添加) -->

	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/store/modules/user';
import userApi from '@/api/user';
import { onShow } from '@dcloudio/uni-app';
import LocationCard from '@/components/LocationCard.vue';
import ActivityChart from '@/components/ActivityChart.vue';

const userStore = useUserStore();
const userInfo = ref({}); // 初始化为空对象
const currentTab = ref(0); // 当前选中的 Tab 索引
const tabList = ref([ // Tab 列表
	{ name: '收藏' },
	{ name: '发布' },
	{ name: '评论' },
]);

// --- 模拟数据 ---
const favoriteList = ref([
{
		id: 1,
		name: '夹皮沟', // 名称
		address: '成都市新都区新繁镇夹皮沟村 123 号', // 地址
		latitude: 30.548, // 纬度
		longitude: 104.062, // 经度
		cover: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // 封面图片
		tags: ['农田', '路难走'], // 标签
		category: 1, // 类别 1 = 野菜 2 = 水产 3 = 野果 4 = 菌类 5 = 药材
		difficulty: 1, // 难度等级 1=低 2=中 3=高
		season: '春季', // 季节
		specialty: ['竹笋', '小龙虾'] // 特产
	},
	{
		id: 2,
		name: '山泉谷',
		address: '成都市青白江区大弯镇山泉村 456 号',
		latitude: 30.535,
		longitude: 104.051,
		cover: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['山地', '水源地'],
		category: 2,
		difficulty: 2,
		season: '夏季',
		specialty: ['松茸', '野生菌']
	},
	{
		id: 3,
		name: '青龙湾',
		address: '成都市新都区泰兴镇青龙村 789 号',
		latitude: 30.544,
		longitude: 104.067,
		cover: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['水域', '湿地'],
		category: 3,
		difficulty: 1,
		season: '四季',
		specialty: ['河虾', '莲藕']
	},
	{
		id: 4,
		name: '云顶林场',
		address: '成都市青白江区姚渡镇云顶村 321 号',
		latitude: 30.539,
		longitude: 104.055,
		cover: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['林地', '高海拔'],
		category: 4,
		difficulty: 3,
		season: '秋季',
		specialty: ['野生菌', '木耳']
	},
	{
		id: 5,
		name: '红岩谷',
		address: '成都市新都区军屯镇红岩村 654 号',
		latitude: 30.537,
		longitude: 104.058,
		cover: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['山地', '岩石'],
		category: 5,
		difficulty: 3,
		season: '春季',
		specialty: ['天麻', '川芎']
	}
]);
const publishedList = ref([
{
		id: 1,
		name: '夹皮沟', // 名称
		address: '成都市新都区新繁镇夹皮沟村 123 号', // 地址
		latitude: 30.548, // 纬度
		longitude: 104.062, // 经度
		cover: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // 封面图片
		tags: ['农田', '路难走'], // 标签
		category: 1, // 类别 1 = 野菜 2 = 水产 3 = 野果 4 = 菌类 5 = 药材
		difficulty: 1, // 难度等级 1=低 2=中 3=高
		season: '春季', // 季节
		specialty: ['竹笋', '小龙虾'] // 特产
	},
	{
		id: 2,
		name: '山泉谷',
		address: '成都市青白江区大弯镇山泉村 456 号',
		latitude: 30.535,
		longitude: 104.051,
		cover: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['山地', '水源地'],
		category: 2,
		difficulty: 2,
		season: '夏季',
		specialty: ['松茸', '野生菌']
	},
	{
		id: 3,
		name: '青龙湾',
		address: '成都市新都区泰兴镇青龙村 789 号',
		latitude: 30.544,
		longitude: 104.067,
		cover: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['水域', '湿地'],
		category: 3,
		difficulty: 1,
		season: '四季',
		specialty: ['河虾', '莲藕']
	},
	{
		id: 4,
		name: '云顶林场',
		address: '成都市青白江区姚渡镇云顶村 321 号',
		latitude: 30.539,
		longitude: 104.055,
		cover: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['林地', '高海拔'],
		category: 4,
		difficulty: 3,
		season: '秋季',
		specialty: ['野生菌', '木耳']
	},
	{
		id: 5,
		name: '红岩谷',
		address: '成都市新都区军屯镇红岩村 654 号',
		latitude: 30.537,
		longitude: 104.058,
		cover: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		tags: ['山地', '岩石'],
		category: 5,
		difficulty: 3,
		season: '春季',
		specialty: ['天麻', '川芎']
	}
]);
// 活跃度数据
const activityData = ref([
	{ date: '2024-01-01', value: 5 },
	{ date: '2024-01-02', value: 8 },
	{ date: '2024-01-03', value: 3 },
	{ date: '2024-01-04', value: 12 },
	{ date: '2024-01-05', value: 7 },
	{ date: '2024-01-06', value: 10 },
	{ date: '2024-01-07', value: 6 }
]);

const commentList = ref([
	{
		id: 1,
		userAvatar: '/static/logo.png',
		userName: '测试用户 A',
		time: '2 小时前',
		content: '这里的风景真的很不错，推荐大家去看看！',
		target: {
			id: 2,
			name: '山泉谷',
			address: '成都市青白江区大弯镇山泉村 456 号',
			cover: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			distance: '3.2km'
		}
	},
	{
		id: 2,
		userAvatar: '/static/logo.png',
		userName: '测试用户 B',
		time: '昨天',
		content: '评论内容示例，这个地方值得一去。',
		target: {
			id: 5,
			name: '红岩谷',
			address: '成都市新都区军屯镇红岩村 654 号',
			cover: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			distance: '5.8km'
		}
	}
]);
// --- 模拟数据结束 ---

// 使用 computed 属性确保响应性
const reactiveUserInfo = computed(() => userStore.userInfo);

// 获取用户信息
const getUserInfo = async () => {
	try {
		if (userStore.userInfo && userStore.userInfo.id) {
			userInfo.value = userStore.userInfo;
			console.log('Using user info from store:', userInfo.value);
			return;
		}
		console.log('Fetching user info from API...');
		const res = await userApi.getUserInfo();
		if (res && res.data) {
			userStore.setUserInfo(res.data);
			userInfo.value = res.data;
			console.log('Fetched user info from API:', userInfo.value);
		} else {
			console.error('获取用户信息失败：API 未返回有效数据');
			userInfo.value = {};
			if (!userStore.token) {
				handleAvatarClick();
			}
		}
	} catch (error) {
		console.error('获取用户信息异常：', error);
		userInfo.value = {};
		if (!userStore.token) {
			handleAvatarClick();
		}
	}
};

// 处理头像点击：未登录时跳转登录页
const handleAvatarClick = () => {
	if (!reactiveUserInfo.value || !reactiveUserInfo.value.id) {
		console.log('User not logged in, navigating to login.');
		uni.navigateTo({
			url: '/pages/login/index', // 假设登录页路径
		});
	} else {
		console.log('User logged in, avatar clicked.');
		// uni.navigateTo({ url: '/pages/profile-edit/index' });
	}
};

// 处理 Tab 切换
const handleTabChange = (index) => {
	currentTab.value = index;
	console.log(`Tab changed to: ${tabList.value[index].name}`);
	loadTabData(index);
};

// 退出登录 (如果需要的话)
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				userStore.logout();
				userInfo.value = {};
				currentTab.value = 0;
				uni.reLaunch({ url: '/pages/index/index' });
			}
		},
	});
};

// 加载对应 Tab 的数据（占位函数）
const loadTabData = (tabIndex) => {
	console.log(`Loading data for tab ${tabIndex}...`);
	// 根据 tabIndex 发起不同的 API 请求获取数据
};

// onShow 生命周期函数
onShow(() => {
	if (userStore.token) {
		console.log('User has token, getting user info on show.');
		getUserInfo();
	} else {
		console.log('User has no token on show.');
		userInfo.value = {};
	}
	// 可以在这里加载初始 Tab 数据
	loadTabData(currentTab.value);
});

</script>

<style lang="scss">
</style>