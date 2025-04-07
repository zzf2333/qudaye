import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/store/modules/user';
import userApi from '@/api/user'; // Assuming API functions exist
import { mockLocations } from './useLocations';

// 模拟数据（后续替换为 API 调用）
const mockCommentList = [{ id: 1, userAvatar: '/static/logo.png', userName: '测试用户 A', time: '2 小时前', content: '...', target: { id: 2, name: '山泉谷', address: '成都市新都区新繁镇夹皮沟村 123 号', cover: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', distance: '3.2km' } },];
const mockActivityData = [{ date: '2024-01-01', value: 5 }, { date: '2024-01-02', value: 2 }, { date: '2024-01-02', value: 8 }, { date: '2024-01-02', value: 6 }, { date: '2024-01-02', value: 1 }];
const mockPublishedCount = 72; // 示例数量

export function useUserProfile() {
    const userStore = useUserStore();
    const isLoading = ref(false);
    const isLoadingFavorites = ref(false);
    const isLoadingPublished = ref(false);
    const isLoadingComments = ref(false);

    // 用户资料的响应式状态
    const userInfo = ref({}); // 包含统计信息的详细用户信息
    const favoriteList = ref([]); // 收藏列表
    const publishedList = ref([]); // 已发布列表
    const commentList = ref([]); // 评论列表
    const activityData = ref([]); // 用于图表显示
    const publishedCount = ref(32); // 独立的发布计数

    // 初始从 store 获取基本信息
    const reactiveUserInfoFromStore = computed(() => userStore.userInfo);

    // 获取详细的用户信息（包括发布数量等统计信息）
    const fetchUserInfo = async () => {
        // 如果 store 中有可用的信息则使用，否则从服务器获取
        if (reactiveUserInfoFromStore.value?.id) {
            userInfo.value = { ...reactiveUserInfoFromStore.value }; // 从 store 复制
            // 假设发布数量需要单独获取或随详细用户资料 API 一起获取
            // 目前使用模拟数据
            publishedCount.value = mockPublishedCount;
        }

        // TODO: 需要时替换为实际的 API 调用以获取更多详细信息或统计数据
        // try {
        //   isLoading.value = true;
        //   const res = await userApi.getUserProfileDetails(); // API 调用示例
        //   if (res && res.data) {
        //     userInfo.value = { ...userInfo.value, ...res.data }; // 合并 store 信息和获取的详细信息
        //     publishedCount.value = res.data.publishedCount || 0;
        //     // 必要时更新 store
        //     // userStore.setUserInfo(userInfo.value); 
        //   }
        // } catch (error) {
        //   console.error('获取用户资料详情失败:', error);
        // } finally {
        //   isLoading.value = false;
        // }
    };

    // 获取特定标签页的数据
    const loadTabData = async (tabIndex) => {
        console.log(`useUserProfile: 正在加载标签页 ${tabIndex} 的数据`);
        switch (tabIndex) {
            case 0: // 收藏
                if (favoriteList.value.length === 0) { // 仅在未加载时获取
                    await fetchFavorites();
                }
                break;
            case 1: // 已发布
                if (publishedList.value.length === 0) {
                    await fetchPublished();
                }
                break;
            case 2: // 评论
                if (commentList.value.length === 0) {
                    await fetchComments();
                }
                break;
            // case 3: // 活动数据（可能与用户信息一起获取或单独获取）
            //   if (activityData.value.length === 0) {
            //      await fetchActivity(); 
            //   }
            //   break;
        }
        // 单独获取活动数据或与用户信息一起获取
        if (activityData.value.length === 0) {
            await fetchActivity(); // 假设此函数存在
        }
    };

    // --- 独立的数据获取函数（将模拟数据替换为 API 调用） ---

    const fetchFavorites = async () => {
        isLoadingFavorites.value = true;
        console.log('正在获取收藏列表...');
        try {
            // const res = await userApi.getFavorites(); // API 示例
            // favoriteList.value = res.data || [];
            await new Promise(resolve => setTimeout(resolve, 600)); // 模拟延迟
            // 随机排序 mockLocations 数据
            favoriteList.value = [...mockLocations].sort(() => Math.random() - 0.5);
        } catch (error) {
            console.error('获取收藏列表失败：', error);
            favoriteList.value = []; // 出错时重置
        } finally {
            isLoadingFavorites.value = false;
        }
    };

    const fetchPublished = async () => {
        isLoadingPublished.value = true;
        console.log('正在获取已发布列表...');
        try {
            // const res = await userApi.getPublished(); // API 示例
            // publishedList.value = res.data || [];
            await new Promise(resolve => setTimeout(resolve, 700)); // 模拟延迟
            // 随机排序 mockLocations 数据
            publishedList.value = [...mockLocations].sort(() => Math.random() - 0.5);
        } catch (error) {
            console.error('获取已发布列表失败：', error);
            publishedList.value = [];
        } finally {
            isLoadingPublished.value = false;
        }
    };

    const fetchComments = async () => {
        isLoadingComments.value = true;
        console.log('正在获取评论列表...');
        try {
            // const res = await userApi.getComments(); // API 示例
            // commentList.value = res.data || [];
            await new Promise(resolve => setTimeout(resolve, 800)); // 模拟延迟
            commentList.value = mockCommentList;
        } catch (error) {
            console.error('获取评论列表失败：', error);
            commentList.value = [];
        } finally {
            isLoadingComments.value = false;
        }
    };

    const fetchActivity = async () => {
        // isLoadingActivity.value = true; // 如需要可添加加载状态
        console.log('正在获取活动数据...');
        try {
            // const res = await userApi.getActivityData(); // API 示例
            // activityData.value = res.data || [];
            await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
            activityData.value = mockActivityData;
        } catch (error) {
            console.error('获取活动数据失败：', error);
            activityData.value = [];
        } finally {
            // isLoadingActivity.value = false;
        }
    };


    // 监听 store 中用户信息的变化（例如，登录/登出后）
    watch(reactiveUserInfoFromStore, (newInfo) => {
        if (newInfo && newInfo.id) {
            fetchUserInfo(); // 当 store 变化时重新获取详细信息
        } else {
            // 用户登出时重置本地状态
            userInfo.value = {};
            favoriteList.value = [];
            publishedList.value = [];
            commentList.value = [];
            activityData.value = [];
            publishedCount.value = 0;
        }
    }, { immediate: true }); // 在设置时立即运行

    return {
        isLoading, // 整体加载状态（可以基于其他状态计算）
        isLoadingFavorites, // 收藏列表加载状态
        isLoadingPublished, // 已发布列表加载状态
        isLoadingComments, // 评论列表加载状态
        userInfo, // 合并的用户信息
        favoriteList, // 收藏列表
        publishedList, // 已发布列表
        commentList, // 评论列表
        activityData, // 活动数据
        publishedCount, // 发布计数
        loadTabData, // 加载特定标签页数据的函数
        fetchUserInfo // 显式刷新用户信息的函数
    };
}