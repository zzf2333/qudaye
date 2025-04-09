<template>
	<view class="relative">
		<Header
			leftIcon="i-lucide-filter"
			@leftClick="showFilterDrawer"
		>
			<template #center>
				<!-- Display loading state or location count -->
				<view v-if="viewMode === 'map'" class="z-1 text-xs flex items-center">
					<text>附近有 {{ locationList.length }} 个点位</text>
				</view>
				<view v-else class="flex items-center rounded-full px-4 py-3">
					<view class="i-lucide-search w-36rpx h-36rpx mr-2"></view>
					<!-- Use debounce or trigger fetch on change/blur -->
					<input type="text" v-model="searchQuery" placeholder="搜索物质名称" class="flex-1 text-xs outline-none" @input="handleSearchInput" />
				</view>
			</template>
		</Header>
		
		<!-- 筛选抽屉 -->
		<filter-drawer v-model:visible="filterVisible" :selected-filters="selectedFilters" @confirm="onFilterConfirm" />
		 
		<!-- 视图切换按钮 -->
		<view 
			class="fixed right-30rpx text-white z-50 bg-primary-500 rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
			:class="$isH5 ? 'bottom-140rpx' : 'bottom-60rpx'"
			@click="toggleViewMode"
		>
			<view :class="[viewMode !== 'map' ? 'i-lucide-map' : 'i-lucide-layout-list', 'w-38rpx h-38rpx']"></view>
		</view>

		<!-- 地图视图 (Using MapViewer) -->
		<view v-if="viewMode === 'map'" class="w-full h-full fixed"> 
			<MapViewer 
				:latitude="latitude" 
				:longitude="longitude" 
				:scale="scale"
				:markers="markers" 
				@update:latitude="latitude = $event"
				@update:longitude="longitude = $event"
				@update:scale="scale = $event"
				@markerTap="handleMarkerTap" 
				@located="handleLocated" 
			></MapViewer> 
		</view>
		
		<!-- 列表视图 -->
		<view v-else class="transition-all duration-300 ease-in-out relative" > 
			<!-- Show loading indicator -->
			<location-list 
				:locations="locationList"
				:current-latitude="latitude" 
				:current-longitude="longitude" 
				@select="onLocationSelect" 
			></location-list>
		</view>
	</view>
</template>

<style>
/* Keep existing styles */
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
import { ref, onMounted, watch } from 'vue' // Removed computed if not used
import LocationList from '@/components/common/LocationList.vue'
import FilterDrawer from '@/components/FilterDrawer.vue'
import Header from '@/components/Header.vue'
import MapViewer from '@/components/common/MapViewer.vue'; 
import { useLocations } from '@/composables/useLocations'; // Import the composable

// --- Page State ---
const filterVisible = ref(false)
const selectedFilters = ref([]) // Filters applied (e.g., array of IDs)
const viewMode = ref('list'); 
const searchQuery = ref('');

// --- Map State (Still managed by the page for MapViewer binding) ---
const latitude = ref(30.909) // Default initial location
const longitude = ref(104.307)
const scale = ref(14)

// --- Use the Locations Composable ---
const { 
	isLoading,      // Loading state (ref)
	locationList,   // Filtered and sorted locations (ref)
	markers,        // Map markers including user location (ref)
	fetchLocations  // Function to fetch/refresh locations
} = useLocations({ 
	currentLatitude: latitude, 
	currentLongitude: longitude, 
	selectedFilters, 
	searchQuery 
	// initialUserLocation can be omitted if we get location first
});

// --- Methods related to page logic ---

// Get initial location (updates latitude/longitude refs)
const getInitialLocation = () => {
	// isLoading state is now managed by useLocations, but we might want a separate initial loading state
	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			latitude.value = res.latitude
			longitude.value = res.longitude
			// No need to call addUserLocationMarker here, composable handles it via watch
			// Now fetch locations based on the obtained coordinates
			fetchLocations(); 
		},
		fail: () => {
			uni.showToast({ title: '获取位置失败，使用默认位置', icon: 'none' })
			// Fetch locations using default coordinates if geolocation fails
			fetchLocations(); 
		}
	})
}

// --- UI Interaction Methods ---

const toggleViewMode = () => {
	viewMode.value = viewMode.value === 'map' ? 'list' : 'map'
}

const showFilterDrawer = () => {
	filterVisible.value = true
}

// Update selectedFilters ref; watcher in useLocations will trigger fetch
const onFilterConfirm = (filters) => {
	// Assuming filters is an array of selected filter objects { id, name }
	selectedFilters.value = filters.map(f => f.id); 
	// No need to call fetchLocations() here, watcher handles it
}

// Handle search input (optional debounce can be added)
const handleSearchInput = () => {
	// Watcher in useLocations handles searchQuery changes
	// If debounce is needed, implement it here before updating searchQuery.value
}

// Handle location selection from the list
const onLocationSelect = (location) => {
	if (!location || !location.id) {
		console.error('Invalid location selected:', location);
		uni.showToast({ title: '无法打开详情', icon: 'none' });
		return;
	}
	uni.navigateTo({
		url: `/pages/detail/detail?id=${location.id}`
	});
}

// Handle marker tap event from MapViewer
const handleMarkerTap = (detail) => {
	console.log('Marker tapped in index page:', detail.markerId);
	// 假设用户位置标记的 ID 不是数字类型或者是一个特殊值 (例如 'user-location')
	// 需要根据 useLocations.js 中 markers 的实际结构来判断
	if (typeof detail.markerId === 'number' || (typeof detail.markerId === 'string' && !isNaN(parseInt(detail.markerId)))) {
		const locationId = parseInt(detail.markerId); // 确保是数字 ID
		const tappedLocation = locationList.value.find(loc => loc.id === locationId);
		if (tappedLocation) {
			uni.navigateTo({
				url: `/pages/detail/detail?id=${tappedLocation.id}`
			});
		} else {
			console.warn(`Location with ID ${locationId} not found in locationList.`);
			// 可以选择性地显示一个提示
			// uni.showToast({ title: '无法打开详情', icon: 'none' });
		}
	} else {
		console.log('Tapped on a non-location marker (e.g., user location).');
		// 可以选择性地执行其他操作，例如显示用户信息
	}
}

// Handle location update from MapViewer's locate button
const handleLocated = (location) => {
    console.log('Located via MapViewer button:', location);
    // Latitude/Longitude/Scale are already updated via v-model
    // Trigger refetch if necessary (e.g., if distance calculation depends on it)
    fetchLocations(); 
}

// --- Lifecycle Hook ---

onMounted(() => {
	getInitialLocation(); // Get location first, then fetch
})

// Removed mockLocations, fetchLocationList, updateMapMarkers, addUserLocationMarker
// Removed calculateDistance import (now inside useLocations)

</script>
