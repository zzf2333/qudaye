<template>
	<view class="detail-page bg-gray-100 min-h-screen">
		<!-- 主内容区域 -->
		<view class="content-area pb-20rpx">
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
					
					<!-- 评分与距离 -->
					<view class="flex items-center text-xs text-comet-500 mb-2">
						<view class="flex items-center mr-3">
							<!-- 模拟评分 -->
							<view class="flex items-center">
								<view v-for="i in 3" :key="i" class="w-24rpx h-24rpx mx-2rpx">
									<view :class="[i <= Math.floor(spotDetails.difficulty || 0) ? 'bg-primary-500' : 'bg-comet-100', 'rounded-full w-full h-full']"></view>
								</view>
							</view>
							<text class="ml-2">低</text>
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

					<!-- 物产种类 -->
					<view v-if="spotDetails.productTypes.length > 0" class="product-types flex flex-wrap gap-2 mb-3">
						<view v-for="ptype in spotDetails.productTypes" :key="ptype"
							class="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
							{{ ptype }}
						</view>
					</view>

					<!-- 距离 -->
					<view class="flex items-center justify-between text-xs text-comet-500 mb-4">
						<view class="flex items-center mr-3">
							<view class="i-lucide-map-pin mr-10rpx"></view>
							<text class="flex-1">{{ spotDetails.address }}</text>
						</view>
						<view class="flex items-center">
							<view class="i-lucide-navigation mr-1"></view>
							<text>{{ spotDetails.distance }} KM</text>
						</view>
					</view>

					<!-- 图片展示 -->
					<view class="image-gallery mb-3">
						<view v-if="displayImages.length > 0" class="main-image mb-2">
							<image :src="displayImages[0]" mode="aspectFill"
								class="w-full h-200px rounded-lg bg-gray-200" @tap="previewImage(0)"></image>
						</view>
						<scroll-view scroll-x class="whitespace-nowrap" :show-scrollbar="false" enhanced>
							<image v-for="(img, index) in displayImages" :key="index" :src="img"
								mode="aspectFill" class="w-80px h-80px rounded-lg inline-block mr-2 bg-gray-200"
								@tap="previewImage(index + 1)">
							</image>
						</scroll-view>
					</view>

					<!-- 标签 -->
					<view v-if="spotDetails.tags.length > 0" class="tags flex flex-wrap gap-2 mb-3">
						<view v-for="tag in spotDetails.tags" :key="tag"
							class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
							#{{ tag }}
						</view>
					</view>

					<!-- 描述 -->
					<text class="text-comet-400 text-sm block mb-3 mt-3">{{ spotDetails.description }}</text>

					<!-- 去过的人 (占位) -->
					<view class="visitors flex items-center text-sm text-comet-500 mb-4">
						<view class="flex -space-x-2 mr-2">
							<view v-for="i in 5" :key="i" class="w-64 h-64 rounded-full bg-gray-300 border-2 border-white">
							</view>
						</view>
						<text>+{{ spotDetails.visitorCount }} 人来过这里</text>
					</view>

					<!-- 签到按钮 (占位) -->
					<button
						class=" bg-primary-500 text-white w-full flex items-center justify-center rounded-lg text-sm  py-3 hover:bg-primary-600">
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
					<text class="text-lg font-bold">{{ spotDetails.recommendations.length }}条评论</text>
				</view>
				<view class="comment-list space-y-4">
					<!-- 使用 CommentItem 组件渲染评论 -->
					<CommentItem v-for="comment in spotDetails.recommendations" :key="comment.id" :comment="comment" />
					<!-- 模拟评论项 -->
					<view v-if="!spotDetails.recommendations.length" class="text-gray-500 text-center py-4">暂无评论</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import Header from '@/components/Header.vue';
import CommentItem from '@/components/common/CommentItem.vue';
import MapViewer from '@/components/common/MapViewer.vue'; // 导入 MapViewer
import { categories, seasonOptions, difficultyLevels } from '@/config/categories';

const spotId = ref(null);

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
			user: { name: '张三', avatar: 'https://via.placeholder.com/40/FFA500/FFFFFF?text=Z' },
			rating: 5,
			content: '非常棒的地方，下次还来！风景绝了！',
			likes: 15,
			createdAt: '2 小时前'
		},
		{
			id: 2,
			user: { name: '李四', avatar: 'https://via.placeholder.com/40/4682B4/FFFFFF?text=L' },
			rating: 4,
			content: '还不错，就是周末人有点多。带孩子玩挺好的。',
			likes: 8,
			createdAt: '1 天前'
		},
		{
			id: 3,
			user: { name: '王五', avatar: 'https://via.placeholder.com/40/32CD32/FFFFFF?text=W' },
			rating: 3,
			content: '一般般吧，蚊子有点多，记得带驱蚊水。',
			likes: 2,
			createdAt: '3 天前'
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
		height: 80rpx;
		pointer-events: none;
		z-index: 1;
	}

	&::before {
		top: 0;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), transparent);
	}

	&::after {
		bottom: 0;
		background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
	}
}
</style>