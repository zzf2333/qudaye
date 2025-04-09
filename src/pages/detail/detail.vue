<template>
	<view class="detail-page bg-gray-100 min-h-screen">
		<!-- 主内容区域 -->
		<view class="content-area">
			<!-- 基本信息卡片 -->
			<view class="bg-white shadow-md mb-4">
				<!-- 地图预览 -->
				<view class="map-container h-200px rounded mb-3">
					<MapViewer v-if="spotDetails.location?.latitude" :latitude="spotDetails.location.latitude"
						:longitude="spotDetails.location.longitude" :scale="16" :markers="mapMarkers"
						:show-location-button="false" :enable-satellite="true" class="w-full h-full" />
					<view v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
						地图加载中...
					</view>
				</view>

				<view class="px-4 pb-4">
					<!-- 地点名称 -->
					<view class="flex">
						<text class="text-lg font-bold block mb-1 flex-1">{{ spotDetails.title }}</text>
						<view class="flex bg-comet-50 text-comet-500 items-center text-26 px-4 rounded-sm">
							<view class="i-lucide-bookmark-plus text-gray-500 mr-1 text-30"></view>
							收藏
						</view>
					</view>

					<!-- 分类与难度 -->
					<view class="flex items-center text-sm mb-2">
						<view v-if="categoryInfo"
							class="flex items-center mr-3 bg-comet-100 text-comet-600 px-2 py-1 rounded text-xs">
							<text>分类：{{ categoryInfo.label }} {{ categoryInfo.emoji }}</text>
						</view>
						<view class="flex items-center bg-comet-100 text-comet-600 px-2 py-1 rounded text-xs">
							<text>难度：{{ difficultyLabel }}</text>
						</view>
						<view v-if="seasonInfo"
							class="flex items-center ml-3 bg-comet-100 text-comet-600 px-2 py-1 rounded text-xs">
							<text>季节：{{ seasonInfo.label }}</text>
						</view>
					</view>

					<!-- 距离 -->
					<view class="flex items-center justify-between text-xs text-comet-500 mb-2">
						<view class="flex items-center mr-3">
							<view class="i-lucide-map-pin mr-10rpx"></view>
							<text class="flex-1">{{ spotDetails.address }}</text>
						</view>
						<view class="flex items-center">
							<view class="i-lucide-navigation mr-1"></view>
							<text>{{ spotDetails.distance }} KM</text>
						</view>
					</view>

					<!-- 物产种类 -->
					<view v-if="spotDetails.productTypes.length > 0" class="product-types flex flex-wrap gap-2 mb-3">
						<view v-for="ptype in spotDetails.productTypes" :key="ptype"
							class="bg-primary-50 text-primary-500 px-2 py-1 rounded text-xs">
							{{ ptype }}
						</view>
					</view>

					<!-- 图片展示 -->
					<view class="image-gallery mb-3">
						<scroll-view scroll-x class="whitespace-nowrap" :show-scrollbar="false" enhanced>
							<image v-for="(img, index) in displayImages" :key="index" :src="img"
								mode="aspectFill" class="w-80% h-300rpx inline-block mr-2 bg-gray-200 rounded-lg"
								@tap="previewImage(index)">
							</image>
						</scroll-view>
					</view>

					<!-- 描述 -->
					<text class="text-comet-400 text-sm block mb-3 mt-3">{{ spotDetails.description }}</text>

					<!-- 标签 -->
					<view v-if="spotDetails.tags.length > 0" class="tags flex flex-wrap gap-2 mb-3">
						<view v-for="tag in spotDetails.tags" :key="tag"
							class="text-primary-500 px-2 py-1 rounded text-xs">
							#{{ tag }}
						</view>
					</view>

					<!-- 去过的人 (占位) -->
					<!-- <view class="visitors flex items-center text-sm text-comet-500 mb-4">
						<view class="flex -space-x-2 mr-2">
							<view v-for="i in 5" :key="i" class="w-64 h-64 rounded-full bg-gray-300 border-2 border-white">
							</view>
						</view>
						<text>+{{ spotDetails.visitorCount }} 人来过这里</text>
					</view> -->

					<!-- 签到按钮 (占位) -->
					<button
						class=" bg-primary-500 text-white w-full flex items-center justify-center rounded-bs text-sm  py-2 hover:bg-primary-600">
						<view class="i-lucide-navigation mr-1"></view>
						去这里
					</button>
				</view>
			</view>

			<!-- 分隔线 -->
			<!-- <view class="h-2 bg-gray-100 my-4"></view> -->

			<!-- 评论列表区域 -->
			<view class="recommendations-card bg-white">
				<view class="flex justify-between items-center mb-3 p-3">
					<text class="text-30 font-bold">{{ spotDetails.recommendations.length }}条评论</text>
					<view class="flex items-center py-1.5 rounded-sm  cursor-pointer" @tap="openCommentDialog">
						<view class="i-lucide-square-pen mr-1"></view>
						<text class="text-sm">发表评论</text>
					</view>
				</view>
				<view class="comment-list space-y-4">
					<!-- 使用 CommentItem 组件渲染评论 -->
					<CommentItem v-for="comment in spotDetails.recommendations" :key="comment.id" :comment="comment" mode="detail" />
					<!-- 暂无评论展示 -->
					<NoData v-if="!spotDetails.recommendations.length" text="暂无评论" />
				</view>
			</view>
		</view>
		<CommentDialog ref="commentDialog" @submit="handleCommentSubmit" />
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import Header from '@/components/Header.vue';
import CommentItem from '@/components/common/CommentItem.vue';
import MapViewer from '@/components/common/MapViewer.vue'; // 导入 MapViewer
import NoData from '@/components/NoData.vue';
import CommentDialog from '@/components/common/CommentDialog.vue';
import { categories, seasonOptions, difficultyLevels } from '@/config/categories';

const spotId = ref(null);
const commentDialog = ref(null);

const openCommentDialog = () => {
  commentDialog.value?.open();
};

const handleCommentSubmit = (content) => {
  // TODO: 实现评论提交逻辑
  console.log('提交评论：', content);
  uni.showToast({
    title: '评论发布成功',
    icon: 'success'
  });
};

// 模拟地点详情数据
// 限制显示的图片数量为 6 张
const displayImages = computed(() => spotDetails.value.images.slice(0, 6));

// 图片预览方法
function previewImage(index) {
	uni.previewImage({
		current: index,
		urls: displayImages.value,
		indicator: 'number'
	});
}

const spotDetails = ref({
	title: '美丽的湖边野餐地',
	address: 'XX 省 XX 市 XX 区 风景路 123 号',
	location: { latitude: 30.123, longitude: 120.456 },
	description: '这是一个非常适合家庭出游和朋友聚会的湖边地点，风景优美，空气清新。可以钓鱼、烧烤、放风筝。注意保护环境哦！',
	images: [
		'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
		'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bGFrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
		'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bGFrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
		'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bGFrZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
		'https://plus.unsplash.com/premium_photo-1668017178993-4c8fc9f59872?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://plus.unsplash.com/premium_photo-1669863284071-06345764d4c2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
	],
	category: 'mountain_delicacy',
	tags: ['钓鱼', '烧烤', '风景好', '适合家庭'],
	difficulty: 1,
	season: 'spring',
	productTypes: ['鲫鱼', '野菜'],
	rating: 4.5,
	distance: 2.1,
	visitorCount: 82,
	recommendations: [
		{
			id: 1,
			user: {
				avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
				name: '钓鱼达人'
			},
			content: '这个地方真是个钓鱼的好去处！水质清澈，环境安静，特别适合周末来放松。我在这里钓到了不少鲫鱼，个头都不小。建议大家带上遮阳伞，夏天中午太阳还是很晒的。',
			rating: 5,
			createdAt: '2024-01-15',
			images: [
				'https://images.unsplash.com/photo-1516992654410-9309d4587e94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmlzaGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
			]
		},
		{
			id: 2,
			user: {
				avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
				name: '野趣生活'
			},
			content: '带着家人来野餐，孩子们玩得很开心！这里的野菜特别新鲜，我们采了一些回去做汤，味道很鲜美。傍晚的景色特别美，还看到了落日，值得一来！',
			rating: 4,
			createdAt: '2024-01-20',
			images: [
				'https://images.unsplash.com/photo-1526999185883-1925e82a0e27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGljbmljfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
			]
		},
		{
			id: 3,
			user: {
				avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
				name: '自然探索者'
			},
			content: '这里的环境保护得很好，空气清新，适合亲近自然。不过建议大家带好防蚊喷雾，夏天蚊虫还是比较多的。总的来说是个放松身心的好地方！',
			rating: 4,
			createdAt: '2024-01-25'
		}
	]
});

// 计算属性，用于显示分类、难度和季节的标签
const categoryInfo = computed(() => categories.find(c => c.value === spotDetails.value.category));
const difficultyLabel = computed(() => difficultyLevels.find(d => d.value === spotDetails.value.difficulty)?.label || '未知');
const seasonInfo = computed(() => seasonOptions.find(s => s.value === spotDetails.value.season));

// 计算属性，生成地图标记
const mapMarkers = computed(() => {
	if (!spotDetails.value || !spotDetails.value.location?.latitude) {
		return [];
	}
	return [{
		id: spotId.value || 1, // Use spotId if available, otherwise fallback
		latitude: spotDetails.value.location.latitude,
		longitude: spotDetails.value.location.longitude,
		title: spotDetails.value.title,
		iconPath: '/static/icon/pin.png', // 使用项目中的图标
		width: 30,
		height: 30,
		anchor: { x: 0.5, y: 1 } // 设置标记锚点，使图标底部尖端指向坐标
	}];
});


onLoad((options) => {
	console.log('Detail page loaded with options:', options);
	if (options.id) {
		spotId.value = options.id;
		// TODO: 调用 API 获取真实数据并更新 spotDetails.value
		fetchSpotDetails(spotId.value);
		console.log('Attempting to load details for Spot ID:', spotId.value);
	} else {
		console.error('Missing spot ID in route options');
		uni.showToast({ title: '无效的地点 ID', icon: 'none' });
		// uni.navigateBack();
	}
});

// TODO: 实现真实的 API 调用函数
async function fetchSpotDetails(id) {
	console.log(`Fetching details for spot ${id}... (模拟)`);
	await new Promise(resolve => setTimeout(resolve, 500));
	try {
		// const response = await yourApiCall(id);
		// spotDetails.value = { ...spotDetails.value, ...response.data };
		console.log('Successfully fetched (simulated) details for spot:', id);
	} catch (error) {
		console.error('Failed to fetch spot details:', error);
		uni.showToast({ title: '加载详情失败', icon: 'none' });
	}
}

</script>

<style lang="scss" scoped>
.map-container {
	position: relative;

	&::before,
	&::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 40rpx;
		pointer-events: none;
		z-index: 1;
	}

	&::before {
		top: 0;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent);
	}

	&::after {
		bottom: 0;
		background: linear-gradient(to top, rgba(255, 255, 255, 1), transparent);
	}
}
</style>