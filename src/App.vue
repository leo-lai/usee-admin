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
/* @import '~font-awesome/css/font-awesome.min.css'; */
@import '~nprogress/nprogress.css';
@import '~src/styles/base.scss';

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	/* border:1px solid #dfe6ec; */
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>