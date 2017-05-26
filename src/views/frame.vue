<template>
	<div>
		<el-row class="container">
			<el-col :span="24" class="header">
				<el-col :span="3" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
					{{collapsed ? '' : 'U视一号管理系统'}}
				</el-col>
				<el-col :span="1">
					<div class="tools" @click.prevent="collapse">
						<i class="l-icon l-fs-xl">&#xe6a2;</i>
					</div>
				</el-col>
				<el-col :span="9">
					<el-menu :default-active="$route.path" mode="horizontal" class="l-nav-top">
					  <el-menu-item index="/index" @click="$router.push('/index')">首页</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="4" class="userinfo">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img :src="userInfo.avatar" /> {{userInfo.userName}}</span>
						<el-dropdown-menu slot="dropdown">
							<!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
							<el-dropdown-item @click.native="pwdInfo.visible = true">修改密码</el-dropdown-item>
							<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>
			<el-col :span="24" class="main">
				<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
					<!--导航菜单-->
					<el-menu class="l-nav-aside" :default-active="$route.path" @open="handleopen" @close="handleclose" @select="handleselect"
						 unique-opened router v-show="!collapsed">
						<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
							<el-submenu :index="index+''" v-if="!item.single">
								<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
								<el-menu-item v-for="child in item.children" :index="item.path+'/'+child.path" :key="item.path+'/'+child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
							</el-submenu>
							<el-menu-item v-if="item.single&&item.children.length>0" :index="item.path+'/'+item.children[0].path">
								<i :class="item.iconCls"></i>{{item.children[0].name}}
							</el-menu-item>
						</template>
					</el-menu>
					<!--导航菜单-折叠后-->
					<ul class="l-nav-aside el-menu collapsed" v-show="collapsed" ref="menuCollapsed">
						<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
							<template v-if="!item.single">
								<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
								<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
									<li v-for="child in item.children" v-if="!child.hidden" :key="item.path+'/'+child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==(item.path+'/'+child.path)?'is-active':''" @click="$router.push(item.path+ '/' +child.path)">{{child.name}}</li>
								</ul>
							</template>
							<template v-else>
								<li class="el-submenu">
									<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==(item.path+'/'+item.children[0].path)?'is-active':''" @click="$router.push(item.path+'/'+item.children[0].path)"><i :class="item.iconCls"></i></div>
								</li>
							</template>
						</li>
					</ul>
				</aside>
				<section class="content-container">
					<el-col :span="24" class="breadcrumb-container" v-show="$route.path !== '/index'">
						<el-breadcrumb separator="›">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</section>
			</el-col>
		</el-row>
		
		<el-dialog title="修改密码" :visible.sync="pwdInfo.visible" size="tiny">
  		<el-form :model="pwdInfo.form" :rules="pwdInfo.rules" ref="pwdForm" label-width="100px" style="width:400px;">
			  <el-form-item label="旧密码" prop="passwordOld">
			    <el-input type="password" v-model="pwdInfo.form.passwordOld" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码" prop="password">
			    <el-input type="password" v-model="pwdInfo.form.password" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" :loading="pwdInfo.submiting" @click="submitPwd">确定修改</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
let avatar = require('assets/favicon.png')
export default {
	data() {
		return {
			collapsed:false,
			userInfo: { },
			pwdInfo: {
				visible: false,
				submiting: false,
				rules: {
					passwordOld: [
						{required: true, message: '请输入旧密码', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入新密码', trigger: 'blur'}
					]
				},
				form: {
					passwordOld: '',
					password: '',
				}
			}
		}
	},
	methods: {
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
		handleselect: function (a, b) {
		},
		//退出登录
		logout: function () {
			var _this = this;
			this.$confirm('确认退出吗?', '提示').then(() => {
				this.$api.logout()
			})
		},
		submitPwd() {
			this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.pwdInfo.submiting = true
          this.$api.user.changePwd(this.pwdInfo.form).then(({data}) => {
            this.$message({
              type: 'success',
              message: '修改密码成功'
            })
            this.$refs.pwdForm.resetFields()
            this.pwdInfo.submiting = false
            this.pwdInfo.visible = false
          }).finally(() => {
            this.pwdInfo.submiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
		},
		//折叠导航栏
		collapse:function(){
			this.collapsed=!this.collapsed;
		},
		showMenu(i,status){
			this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
		}
	},
	mounted() {
		this.$api.user.getInfo().then(({data})=>{
			data.avatar = avatar
			this.userInfo = data
		})
	}
}
</script>

<style scoped lang="scss">
@import '~scss_vars';
.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	.header {
		height: 60px;
		line-height: 60px;
		background: $color-primary;
		color:#fff;
		.userinfo {
			text-align: right;
			padding-right: 35px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color:#fff;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 10px 10px;
					float: right;
				}
			}
		}
		.logo {
			//width:230px;
			height:60px;
			font-size: 22px;
			padding-left:20px;
			padding-right:20px;
			border-color: rgba(238,241,146,0.3);
			border-right-width: 1px;
			border-right-style: solid;
			img {
				width: 40px;
				float: left;
				margin: 10px 10px 10px 18px;
			}
			.txt {
				color:#fff;
			}
		}
		.logo-width{
			width:230px;
		}
		.logo-collapse-width{
			width:60px
		}
		.tools{
			white-space: nowrap;
			padding: 0px 23px;
			width:14px;
			height: 60px;
			line-height: 60px;
			cursor: pointer;
		}
	}
	.main {
		display: flex;
		position: absolute;
		top: 60px;
		bottom: 0px;
		// overflow: hidden;
		overflow: overlay;
		aside {
			flex:0 0 230px;
			width: 230px;
			// position: absolute;
			// top: 0px;
			// bottom: 0px;
			.el-menu{
				height: 100%;
			}
			.collapsed{
				width:60px;
				.item{
					position: relative;
				}
				.submenu{
					position:absolute;
					top:0px;
					left:60px;
					z-index:99999;
					height:auto;
					display:none;
				}

			}
		}
		.menu-collapsed{
			flex:0 0 60px;
			width: 60px;
		}
		.menu-expanded{
			flex:0 0 230px;
			width: 230px;
		}
		.content-container {
			flex:1;
			// position: absolute;
			// right: 0px;
			// top: 0px;
			// bottom: 0px;
			// left: 230px;
			position: relative;
			overflow-y: auto;
			padding: 20px;
			.breadcrumb-container {
				//margin-bottom: 15px;
				.title {
					width: 200px;
					float: left;
					color: #475669;
				}
				.breadcrumb-inner {
					float: right;
				}
			}
			.content-wrapper {
				margin-top: 20px;
				background-color: #fff;
				box-sizing: border-box;
			}
		}
	}
}
.l-nav-top.el-menu{
	background: transparent; 
	.el-menu-item, .el-submenu__title{ 
		color: #fff; font-size: 16px;
	}
}
.l-nav-top.el-menu--horizontal .el-menu-item:hover, 
.l-nav-top.el-menu--horizontal .el-submenu__title:hover,
.l-nav-top.el-menu--horizontal .el-menu-item.is-active{
	background: $color-primary-active;
}
.l-nav-top.el-menu--horizontal>.el-menu-item:hover, 
.l-nav-top.el-menu--horizontal>.el-submenu.is-active .el-submenu__title, 
.l-nav-top.el-menu--horizontal>.el-submenu:hover .el-submenu__title{
	border-bottom-color: transparent;
}
.l-nav-aside{
	>li{border-bottom: 1px solid #e4e8f1;}
	[class^=l-icon]{font-size: 16px; width: 30px; display: inline-block; text-align: center; margin-left: -5px;}
}
</style>