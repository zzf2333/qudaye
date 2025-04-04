<template>
	<view class="relative">
		<!-- 标题 -->
		<view class="fixed w-full z-1">
			<view class="flex h-100rpx justify-between items-center gradient-bg-horizontal">
				<view class="i-lucide-filter ml-2 w-38rpx h-38rpx cursor-pointer" @tap="showFilterDrawer"></view>
				<view class="z-1 c-primary-500 text-md">附近有 {{ locationList.length }} 个点位</view>
				<view :class="[viewMode !== 'map' ?'i-lucide-map' : 'i-lucide-layout-list', 'mr-2 w-38rpx h-38rpx']" @click="toggleViewMode"></view>
			</view>
		</view>
		
		<!-- 筛选抽屉 -->
		<filter-drawer v-model:visible="filterVisible" :selected-filters="selectedFilters" @confirm="onFilterConfirm" />
		 
		<!-- 地图视图 -->
		<map v-if="viewMode === 'map'" id="map" class="w-full h-full fixed" 
			:latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale"
			show-location @tap="onMapTap"></map>
		
		<!-- 列表视图 -->
		<view v-else class="transition-all duration-300 ease-in-out">
			<location-list :locations="locationList" @select="onLocationSelect" />
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
.gradient-bg-horizontal::before {
	content: "";
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #fff;
	z-index: 0;
	opacity: 0.8;
	box-shadow: 0 30rpx 30rpx #fff;
}
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

const filterVisible = ref(false)
// 已选中的筛选标签
const selectedFilters = ref([])
const viewMode = ref('map');
// 加载状态
const isLoading = ref(false);

// 地图中心点坐标
const latitude = ref(39.909)
const longitude = ref(116.397)
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
		width: 40,
		height: 40,
		anchor: {
			x: 0.5,
			y: 0.5
		},
		callout: {
			content: '当前位置',
			color: '#FFFFFF',
			fontSize: 12,
			borderRadius: 4,
			bgColor: '#00CA9D',
			padding: 8,
			display: 'ALWAYS'
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
		id: 'loc-1',
		name: '示例位置 1',
		address: '北京市朝阳区 xxx 街道',
		distance: '0.5',
		latitude: 39.915,
		longitude: 116.404,
		category: '餐饮',
		tags: [11, 15] // 中餐、火锅
	},
	{
		id: 'loc-2',
		name: '示例位置 2',
		address: '北京市海淀区 xxx 街道',
		distance: '1.2',
		latitude: 39.902,
		longitude: 116.391,
		category: '购物',
		tags: [21, 22] // 超市、商场
	},
	{
		id: 'loc-3',
		name: '示例位置 3',
		address: '北京市西城区 xxx 街道',
		distance: '2.3',
		latitude: 39.925,
		longitude: 116.387,
		category: '休闲',
		tags: [31, 35] // 电影院、公园
	}
]

// 获取位置列表数据
const fetchLocationList = () => {
	isLoading.value = true
	// 模拟网络请求延迟
	setTimeout(() => {
		// 根据筛选条件过滤数据
		const filteredData = selectedFilters.value.length > 0
			? mockLocations.filter(location =>
				location.tags.some(tag => selectedFilters.value.includes(tag))
			)
			: mockLocations
		
		locationList.value = filteredData
		// 更新地图标记点
		updateMapMarkers(filteredData)
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
			iconPath: '/static/icon/location.png',
			width: 36,
			height: 36,
			anchor: {
				x: 0.5,
				y: 0.5
			},
			callout: {
				content: loc.name,
				color: '#333333',
				fontSize: 14,
				borderRadius: 8,
				bgColor: '#FFFFFF',
				padding: 8,
				display: 'BYCLICK'
			},
			label: {
				content: loc.category,
				color: '#FFFFFF',
				fontSize: 12,
				bgColor: '#4CAF50',
				borderRadius: 4,
				padding: 4,
				x: loc.longitude,
				y: loc.latitude - 0.001,
				anchorX: 0.5,
				anchorY: 1
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

