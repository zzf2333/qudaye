<template>
	<view class="relative">
		<!-- 标题 -->
		<view class="fixed w-full z-1">
			<view class="flex bg-white h-100rpx justify-between items-center shadow-lg c-comet-600">
				<view class="i-lucide-filter ml-2 w-36rpx h-36rpx cursor-pointer" @tap="showFilterDrawer"></view>
				<view v-if="viewMode === 'map'" class="z-1 text-xs">附近有 {{ locationList.length }} 个点位</view>
				<view v-else class="flex-1 mx-4">
					<view class="flex items-center rounded-full px-4 py-2">
						<view class="i-lucide-search w-36rpx h-36rpx mr-2"></view>
						<input type="text" v-model="searchQuery" placeholder="搜索物质名称" class="flex-1 text-xs outline-none" />
					</view>
				</view>
				<view :class="[viewMode !== 'map' ?'i-lucide-map' : 'i-lucide-layout-list', 'mr-2 w-36rpx h-36rpx']" @click="toggleViewMode"></view>
			</view>
		</view>
		
		<!-- 筛选抽屉 -->
		<filter-drawer v-model:visible="filterVisible" :selected-filters="selectedFilters" @confirm="onFilterConfirm" />
		 
		<!-- 地图视图 -->
		<map v-if="viewMode === 'map'" id="map" class="w-full h-full fixed" 
			:latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale"
			show-location :show-compass="false" :enable-satellite="true" :show-location="false" @tap="onMapTap"></map>
		
		<!-- 列表视图 -->
		<view v-else class="transition-all duration-300 ease-in-out">
			<location-list 
				:locations="locationList" 
				:current-latitude="latitude" 
				:current-longitude="longitude" 
				@select="onLocationSelect" 
			/>
		</view>

		<!-- 定位按钮 -->
		<view v-if="viewMode === 'map'" :class="['fixed right-20rpx z-10', $isH5 ? 'bottom-80rpx' : 'bottom-40rpx']">
			<view @click="moveToLocation">
				<img src="/static/icon/location.png" class="w-120rpx h-120rpx" />
			</view>
		</view>
	</view>
</template>

<style>
/* 地图标记点样式增强 */
:deep(.uni-map-callout) {
	border-radius: 8rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

:deep(.uni-map-callout:active) {
	transform: scale(1.05);
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import LocationList from '@/components/LocationList.vue'
import FilterDrawer from '@/components/FilterDrawer.vue'
import {calculateDistance} from '@/utils/distance';

const filterVisible = ref(false)
// 已选中的筛选标签
const selectedFilters = ref([])
const viewMode = ref('map');
// 加载状态
const isLoading = ref(false);
// 搜索关键词
const searchQuery = ref('');

// 地图中心点坐标
const latitude = ref(30.909)
const longitude = ref(104.307)
const scale = ref(14)

// 地图标记点和位置列表数据
const markers = ref([])
const locationList = ref([])

// 获取当前位置
const getLocation = () => {
	isLoading.value = true
	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			latitude.value = res.latitude
			longitude.value = res.longitude
			
			// 添加当前位置标记
			addUserLocationMarker(res.latitude, res.longitude)
			isLoading.value = false
		},
		fail: () => {
			uni.showToast({
				title: '获取位置失败',
				icon: 'none'
			})
			isLoading.value = false
		}
	})
}

// 添加用户位置标记
const addUserLocationMarker = (lat, lng) => {
	// 确保不重复添加用户位置标记
	const userMarkerIndex = markers.value.findIndex(m => m.id === 'user-location')
	if (userMarkerIndex >= 0) {
		markers.value.splice(userMarkerIndex, 1)
	}
	
	// 添加用户位置标记
	markers.value.push({
		id: 'user-location',
		latitude: lat,
		longitude: lng,
		iconPath: '/static/icon/user-location.png',
		width: 52,
		height: 52,
		anchor: {
			x: 0.5,
			y: 0.5
		}
	})
}

// 移动到当前位置
const moveToLocation = () => {
	getLocation()
}

// 地图缩放控制
const zoomIn = () => {
	if (scale.value < 20) scale.value++
}

const zoomOut = () => {
	if (scale.value > 3) scale.value--
}

// 视图模式切换
const toggleViewMode = () => {
	viewMode.value = viewMode.value === 'map' ? 'list' : 'map'
}

// 显示筛选抽屉
const showFilterDrawer = () => {
	filterVisible.value = true
}

// 筛选确认回调
const onFilterConfirm = (filters) => {
	selectedFilters.value = filters.map(f => f.id)
	// 重新获取数据
	fetchLocationList()
}

// 模拟位置数据
const mockLocations = [
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
]

// 获取位置列表数据
const fetchLocationList = () => {
	isLoading.value = true
	// 模拟网络请求延迟
	setTimeout(() => {
		// 根据筛选条件和搜索关键词过滤数据
		let filteredData = selectedFilters.value.length > 0
			? mockLocations.filter(location =>
				location.tags.some(tag => selectedFilters.value.includes(tag))
			)
			: mockLocations
		
		// 搜索关键词过滤
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase()
			filteredData = filteredData.filter(location =>
				location.name.toLowerCase().includes(query) ||
				location.address.toLowerCase().includes(query) ||
				location.category.toLowerCase().includes(query)
			)
		}

		// 计算每个位置的距离
		const locationsWithDistance = filteredData.map(location => ({
			...location,
			distance: calculateDistance(
				latitude.value,
				longitude.value,
				location.latitude,
				location.longitude
			)
		}))
		
		locationList.value = locationsWithDistance
		// 更新地图标记点
		updateMapMarkers(locationsWithDistance)
		isLoading.value = false
	}, 800)
}

// 更新地图标记点
const updateMapMarkers = (locations) => {
	// 保留用户位置标记
	const userMarker = markers.value.find(m => m.id === 'user-location')
	markers.value = userMarker ? [userMarker] : []
	
	// 添加位置标记
	locations.forEach((loc, index) => {
		markers.value.push({
			id: loc.id,
			latitude: loc.latitude,
			longitude: loc.longitude,
			iconPath: '/static/icon/pin-1.png',
			label: {
				content: loc.category === 1 ? '🥬' : loc.category === 2 ? '🐟' : loc.category === 3 ? '🍎' : loc.category === 4 ? '🍄' : '☘️',
				color: '#333333',
				fontSize: 32,
				anchorX: -12,
				anchorY: -12,
				borderWidth: 0,
				borderRadius: 0,
				bgColor: 'transparent',
				padding: 0
			},
			width: 32,
			height: 32,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		})
	})
}

// 地图点击事件处理优化
const onMapTap = (e) => {
	const { latitude: lat, longitude: lng } = e.detail
	// 关闭所有标记的 callout
	markers.value.forEach(marker => {
		if (marker.callout && marker.callout.display === 'BYCLICK') {
			marker.callout.display = 'BYCLICK'
		}
	})
}

// 列表项点击事件优化
const onLocationSelect = (location) => {
	viewMode.value = 'map'
	latitude.value = location.latitude
	longitude.value = location.longitude
	
	// 高亮选中的标记
	const selectedMarker = markers.value.find(m => m.id === location.id)
	if (selectedMarker && selectedMarker.callout) {
		selectedMarker.callout.display = 'ALWAYS'
	}
	
	// 添加平滑过渡动画
	setTimeout(() => {
		scale.value = 16 // 放大地图以聚焦选中位置
	}, 300)
}

// 页面加载时获取位置和数据
onMounted(() => {
	// 先获取位置，再获取数据
	getLocation()
	// 延迟加载数据，确保地图已经渲染
	setTimeout(() => {
		fetchLocationList()
	}, 500)
})
</script>

