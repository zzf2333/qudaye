import { ref, watch, computed } from 'vue';
import { calculateDistance } from '@/utils/distance'; // Assuming this utility exists

// Mock Data (Keep inside composable for now, replace with API later)
export const mockLocations = [
    { id: 1, name: '夹皮沟', address: '成都市新都区新繁镇夹皮沟村 123 号', latitude: 30.548, longitude: 104.062, cover: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', tags: ['农田', '路难走'], category: 1, difficulty: 1, season: '春季', specialty: ['竹笋', '小龙虾'] },
    { id: 2, name: '山泉谷', address: '成都市青白江区大弯镇山泉村 456 号', latitude: 30.535, longitude: 104.051, cover: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', tags: ['山地', '水源地'], category: 2, difficulty: 2, season: '夏季', specialty: ['松茸', '野生菌'] },
    { id: 3, name: '青龙湾', address: '成都市新都区泰兴镇青龙村 789 号', latitude: 30.544, longitude: 104.067, cover: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', tags: ['水域', '湿地'], category: 3, difficulty: 1, season: '四季', specialty: ['河虾', '莲藕'] },
    { id: 4, name: '云顶林场', address: '成都市青白江区姚渡镇云顶村 321 号', latitude: 30.539, longitude: 104.055, cover: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', tags: ['林地', '高海拔'], category: 4, difficulty: 3, season: '秋季', specialty: ['野生菌', '木耳'] },
    { id: 5, name: '红岩谷', address: '成都市新都区军屯镇红岩村 654 号', latitude: 30.537, longitude: 104.058, cover: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', tags: ['山地', '岩石'], category: 5, difficulty: 3, season: '春季', specialty: ['天麻', '川芎'] }
];

export function useLocations(options) {
    const {
        currentLatitude, // ref<Number> 当前纬度
        currentLongitude, // ref<Number> 当前经度
        selectedFilters, // ref<Array> 选中的筛选条件
        searchQuery, // ref<String> 搜索关键词
        initialUserLocation // 可选：{ latitude, longitude } 用户初始位置标记
    } = options;

    const isLoading = ref(true);
    const locationList = ref([]); // 带距离信息的位置列表数据
    const markers = ref([]); // 地图标记点

    // 添加用户位置标记的逻辑
    const addUserLocationMarker = (lat, lng) => {
        const userMarkerIndex = markers.value.findIndex(m => m.id === 'user-location');
        if (userMarkerIndex >= 0) {
            markers.value.splice(userMarkerIndex, 1);
        }
        if (lat && lng) { // 仅在经纬度有效时添加
            markers.value.push({
                id: 'user-location',
                latitude: lat,
                longitude: lng,
                iconPath: '/static/icon/user-location.png',
                width: 52, height: 52,
                anchor: { x: 0.5, y: 0.5 },
                zIndex: 10 // 确保用户标记显示在最上层
            });
        }
    };

    // 如果提供了初始用户位置，则初始化用户标记
    if (initialUserLocation?.latitude && initialUserLocation?.longitude) {
        addUserLocationMarker(initialUserLocation.latitude, initialUserLocation.longitude);
    }
    // 监听当前位置变化以更新用户标记
    watch([currentLatitude, currentLongitude], ([newLat, newLng]) => {
        addUserLocationMarker(newLat, newLng);
    }, { immediate: true }); // 如果经纬度已存在，则立即添加


    // 根据位置列表更新地图标记
    const updateMapMarkers = (locations) => {
        const userMarker = markers.value.find(m => m.id === 'user-location');
        const newMarkers = userMarker ? [userMarker] : []; // 保留用户标记

        locations.forEach((loc) => {
            newMarkers.push({
                id: loc.id,
                latitude: loc.latitude,
                longitude: loc.longitude,
                iconPath: '/static/icon/pin-1.png', // TODO: 根据分类动态设置图标
                label: {
                    content: loc.category === 1 ? '🥬' : loc.category === 2 ? '🐟' : loc.category === 3 ? '🍎' : loc.category === 4 ? '🍄' : '🌿',
                    color: '#333333', fontSize: 32,
                    anchorX: -12, anchorY: -12,
                    borderWidth: 0, borderRadius: 0,
                    bgColor: 'transparent', padding: 0
                },
                width: 32, height: 32,
                anchor: { x: 0.5, y: 0.5 },
                // callout: { content: loc.name, display: 'BYCLICK' } // Optional callout
            });
        });
        markers.value = newMarkers;
    };

    // 获取并处理位置数据
    const fetchLocations = () => {
        // 在函数内直接使用计算属性
        const lat = currentLatitude.value;
        const lng = currentLongitude.value;
        const filters = selectedFilters.value;
        const query = searchQuery.value;

        if (!lat || !lng) {
            console.warn('获取位置时当前位置不可用');
            // 可以选择向用户显示一条消息
            return;
        }

        isLoading.value = true;
        console.log('Fetching locations with filters:', filters, 'query:', query);

        // 模拟 API 调用
        return new Promise((resolve) => { // 返回 Promise
            setTimeout(() => {
                let filteredData = mockLocations;

                // 应用筛选条件（假设 filters 是 ID 数组）
                if (filters && filters.length > 0) {
                    filteredData = filteredData.filter(location =>
                        location.tags?.some(tag => filters.includes(tag)) // 示例：按标签筛选
                        // 根据实际筛选结构调整筛选逻辑（例如，按分类 ID 筛选）
                        // location.category === filters[0] // 示例：按单个分类 ID 筛选
                    );
                }

                // 应用搜索查询
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    filteredData = filteredData.filter(location =>
                        location.name.toLowerCase().includes(lowerQuery) ||
                        location.address.toLowerCase().includes(lowerQuery) ||
                        location.specialty?.some(s => s.toLowerCase().includes(lowerQuery)) // Search specialties
                    );
                }

                // 计算距离
                const locationsWithDistance = filteredData.map(location => ({
                    ...location,
                    distance: calculateDistance(lat, lng, location.latitude, location.longitude)
                }));

                // 按距离排序（可选）
                locationsWithDistance.sort((a, b) => a.distance - b.distance);

                locationList.value = locationsWithDistance;
                updateMapMarkers(locationsWithDistance);
                isLoading.value = false;
                console.log('Fetched locations:', locationsWithDistance.length);
                resolve(locationsWithDistance); // Resolve the promise
            }, 4000);
        });
    };

    // 当依赖项变化时重新获取数据的观察者
    watch([selectedFilters, searchQuery], () => {
        fetchLocations();
    }, { deep: true }); // 如果 selectedFilters 是对象数组，使用深度监听

    // 暴露响应式状态和方法
    return {
        isLoading,
        locationList,
        markers,
        fetchLocations,
        addUserLocationMarker // 如果需要在外部使用（例如，在初始手动定位后）
    };
}