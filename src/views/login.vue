<template>
  <el-form :model="formData" :rules="formRule" ref="formData" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">U视一号管理系统</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="formData.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="formData.password" auto-complete="off" placeholder="密码" @keyup.native.enter="submitForm"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="submitForm" :loading="loading">登录</el-button>
      <!-- <el-button @click.native.prevent="resetForm">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  data() {
    return {
      loading: false,
      formData: {
        userName: '',
        password: ''
      },
      formRule: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    };
  },
  methods: {
    resetForm() {
      this.$refs.formData.resetFields()
    },
    submitForm(ev) {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.login(this.formData).then(({data}) => {
            this.$href(this.$route.query.to || '/index', 'replace')
          }).finally(()=>{
            this.loading = false
          })
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>