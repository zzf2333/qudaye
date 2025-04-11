<script setup>
import { useUserStore } from '@/store/modules/user';
import { onLaunch } from '@dcloudio/uni-app';

const userStore = useUserStore();

onLaunch(() => {
	userStore.checkLoginStatus()
})
</script>

<style lang="scss">
	@import "./style/global.scss";
</style>
