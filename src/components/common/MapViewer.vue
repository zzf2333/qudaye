<template>
	<view class="map-viewer relative w-full h-full">
		<map id="map-component" class="w-full h-full" :latitude="internalLatitude" :longitude="internalLongitude"
			:scale="internalScale" :markers="markers" :show-location="showUserLocationOnMap" :show-compass="showCompass"
			:enable-satellite="enableSatellite" @tap="handleMapTap" @markertap="handleMarkerTap"
			@regionchange="handleRegionChange" @updated="handleMapUpdated"></map>

		<!-- 定位按钮 -->
		<view v-if="showLocationButton" :class="['fixed right-10rpx z-10', locationButtonPositionClass]"
			@click="moveToUserLocation">
			<!-- Consider using an icon font or SVG for better control -->
			<image src="/static/icon/location.png" class="w-120rpx h-120rpx" /> <!-- Slightly smaller -->
		</view>

		<!-- Optional: Add slots for controls like zoom buttons if needed -->
		<slot name="controls"></slot>
	</view>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed, onMounted, getCurrentInstance } from 'vue'; // Import getCurrentInstance


const props = defineProps({
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true },
	scale: { type: Number, default: 14 },
	markers: { type: Array, default: () => [] },
	showLocationButton: { type: Boolean, default: true },
	showUserLocationOnMap: { type: Boolean, default: false }, // Whether map shows the blue dot
	showCompass: { type: Boolean, default: false },
	enableSatellite: { type: Boolean, default: true },
	// Add other map props as needed
});

const emit = defineEmits([
	'update:latitude',
	'update:longitude',
	'update:scale',
	'mapTap',
	'markerTap',
	'regionChange',
	'located', // Emits user's location { latitude, longitude }
	'mapReady' // Emitted when map context is ready
]);

// Internal refs to manage state, potentially synced with props
const internalLatitude = ref(props.latitude);
const internalLongitude = ref(props.longitude);
const internalScale = ref(props.scale);
const mapCtx = ref(null);
const isLocating = ref(false);
const instance = getCurrentInstance(); // Get current instance

// Watch props to update internal state
watch(() => props.latitude, (newVal) => internalLatitude.value = newVal);
watch(() => props.longitude, (newVal) => internalLongitude.value = newVal);
watch(() => props.scale, (newVal) => internalScale.value = newVal);

// Get map context when component is ready
onMounted(() => {
	// Use instance proxy for createMapContext in setup
	mapCtx.value = uni.createMapContext('map-component', instance);
	if (mapCtx.value) {
		emit('mapReady', mapCtx.value);
	} else {
		console.warn('MapContext could not be created for map-component.');
	}
});

// --- Event Handlers ---

const handleMapTap = (e) => {
	emit('mapTap', e.detail);
};

const handleMarkerTap = (e) => {
	emit('markerTap', e.detail);
};

const handleRegionChange = (e) => {
	// Corrected: Use &&
	if (e.type === 'end' && e.causedBy === 'gesture') {
		// Use getCenterLocation to be sure
		mapCtx.value.getCenterLocation({
			success: (res) => {
				internalLatitude.value = res.latitude;
				internalLongitude.value = res.longitude;
				// Get scale separately if needed, regionchange might not provide it reliably on gesture end
				mapCtx.value.getScale({
					success: (scaleRes) => {
						internalScale.value = scaleRes.scale;
						emit('update:latitude', res.latitude);
						emit('update:longitude', res.longitude);
						emit('update:scale', scaleRes.scale);
					}
				});
			}
		});
	}
	emit('regionChange', e);
};

const handleMapUpdated = (e) => {
	// Handle map updates if needed
};

// --- Methods ---

// Move map center to user's current location
const moveToUserLocation = () => {
	if (isLocating.value) return;
	isLocating.value = true;

	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			internalLatitude.value = res.latitude;
			internalLongitude.value = res.longitude;
			internalScale.value = Math.max(props.scale, 16);

			emit('update:latitude', res.latitude);
			emit('update:longitude', res.longitude);
			emit('update:scale', internalScale.value);
			emit('located', { latitude: res.latitude, longitude: res.longitude });

			// Corrected: Use &&
			if (mapCtx.value && mapCtx.value.moveToLocation) {
				mapCtx.value.moveToLocation({
					latitude: res.latitude,
					longitude: res.longitude,
				});
			}
		},
		// Corrected: Simple fail callback without TS type annotation
		fail: (err) => {
			console.error('Failed to get location:', err);
			uni.showToast({ title: '获取位置失败', icon: 'none' });
		},
		complete: () => {
			isLocating.value = false;
		}
	});
};

// --- Computed Properties ---

const locationButtonPositionClass = computed(() => {
    const { proxy } = getCurrentInstance();
    return proxy.$isH5 ? 'bottom-240rpx' : 'bottom-140rpx';
});

</script>

<style lang="scss" scoped>
</style>