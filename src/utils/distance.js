/**
 * 使用 Haversine 公式计算两个经纬度点之间的距离
 * @param {number} lat1 第一个点的纬度
 * @param {number} lon1 第一个点的经度
 * @param {number} lat2 第二个点的纬度
 * @param {number} lon2 第二个点的经度
 * @returns {number} 返回两点之间的距离，单位为公里
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
	// 输入验证
	if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
		return 0;
	}

	// 地球半径（单位：公里）
	const R = 6371.0

	// 将经纬度转换为弧度
	const lat1Rad = toRadians(lat1)
	const lon1Rad = toRadians(lon1)
	const lat2Rad = toRadians(lat2)
	const lon2Rad = toRadians(lon2)

	// 纬度差和经度差
	const dLat = lat2Rad - lat1Rad
	const dLon = lon2Rad - lon1Rad

	// Haversine 公式
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = R * c

	// 返回保留一位小数的结果
	return Math.round(distance * 10) / 10
}

// 将角度转换为弧度
function toRadians(degrees) {
	return degrees * (Math.PI / 180)
}

// 验证经纬度是否有效
function isValidCoordinate(lat, lon) {
	return (
		typeof lat === 'number' &&
		typeof lon === 'number' &&
		!isNaN(lat) &&
		!isNaN(lon) &&
		lat >= -90 &&
		lat <= 90 &&
		lon >= -180 &&
		lon <= 180
	)
}
