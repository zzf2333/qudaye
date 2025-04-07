<template>
    <view class="graph-container flex-1 h-120rpx relative overflow-hidden">
        <canvas id="activityChart" class="w-full h-full"></canvas>
    </view>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    activityData: {
        type: Array,
        required: true,
        default: () => []
    }
});

const canvas = ref(null);
const ctx = ref(null);
let animationFrameId = null;
let ripplePhase = 0;

// 初始化 Canvas
const initCanvas = () => {
    const query = uni.createSelectorQuery();
    query.select('#activityChart')
        .fields({ node: true, size: true })
        .exec((res) => {
            if (res[0]) {
                canvas.value = res[0].node;
                ctx.value = canvas.value.getContext('2d');
                const dpr = uni.getSystemInfoSync().pixelRatio;
                canvas.value.width = res[0].width * dpr;
                canvas.value.height = res[0].height * dpr;
                ctx.value.scale(dpr, dpr);
                draw();
            }
        });
};

// 计算坐标
const getCoordinates = computed(() => {
    const points = props.activityData;
    if (!points || points.length === 0) return [];
    
    const width = 300;
    const height = 48;
    const maxValue = Math.max(...points.map(p => p.value)) || 0;
    if (maxValue === 0) return [];

    return points.map((point, index) => {
        const x = (index / (points.length - 1)) * width;
        const y = height - (point.value / maxValue * height * 0.8);
        return [x, y];
    });
});

// 绘制贝塞尔曲线
const drawCurve = () => {
    if (!ctx.value) return;
    
    const coordinates = getCoordinates.value;
    if (!coordinates || coordinates.length < 2) return;
    
    const gradient = ctx.value.createLinearGradient(0, 0, 300, 0);
    gradient.addColorStop(0, 'rgba(0, 202, 157, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 202, 157, 1)');

    ctx.value.beginPath();
    ctx.value.moveTo(coordinates[0][0], coordinates[0][1]);

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        const cp1x = x1 + (x2 - x1) / 3;
        const cp1y = y1;
        const cp2x = x1 + (x2 - x1) * 2 / 3;
        const cp2y = y2;
        ctx.value.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }

    ctx.value.strokeStyle = gradient;
    ctx.value.lineWidth = 3;
    ctx.value.stroke();
};

// 绘制波纹点
const drawRipple = () => {
    if (!ctx.value || !getCoordinates.value.length) return;
    
    const lastPoint = getCoordinates.value[getCoordinates.value.length - 1];
    const radius = 3 + Math.sin(ripplePhase) * 1.5;
    const opacity = 0.6 + Math.sin(ripplePhase) * 0.2;

    ctx.value.beginPath();
    ctx.value.arc(lastPoint[0], lastPoint[1], radius, 0, Math.PI * 2);
    ctx.value.fillStyle = `rgba(0, 202, 157, ${opacity})`;
    ctx.value.fill();

    ripplePhase += 0.1;
};

// 主绘制函数
const draw = () => {
    if (!ctx.value) return;

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    drawCurve();
    drawRipple();

    animationFrameId = requestAnimationFrame(draw);
};

// 监听数据变化，触发重绘
watch(() => props.activityData, (newVal) => {
    if (ctx.value && newVal && newVal.length > 0) {
        draw();
    }
}, { deep: true });

onMounted(() => {
    initCanvas();
});

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
</script>