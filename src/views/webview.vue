<template>
	<div class="l-webview">
		<iframe id="webview" :src="frameUrl" frameborder="0"></iframe>
	</div>
</template>
<script>
export default {
	data() {
		return {
			frameUrl: ''
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.frameUrl = vm.$route.meta.href
		})
	}
}
</script>
<style scoped lang="scss">
.l-webview{
	position: absolute; left: 0; top: 50px; bottom: 0; right: 0;
	iframe{
		box-sizing: border-box;
		display: block; width: 100%; height: 100%; margin: 0; padding:0; border: 0; overflow: auto;
	}
}
</style>