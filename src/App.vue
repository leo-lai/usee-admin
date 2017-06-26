<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
@import '~element-ui/lib/theme-default/index.css';
/* @import '~assets/theme/theme-green/index.css'; */
@import '~font-awesome/css/font-awesome.min.css';
@import '~nprogress/nprogress.css';
@import '~src/styles/base.scss';
@import '~src/styles/global.scss';
</style>