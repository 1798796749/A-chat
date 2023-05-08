<template>
  <div class="form-container">
    <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm"
      :hide-required-asterisk="true">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
        <el-button @click="addUserForm(loginFormRef)">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '../api/index'
import { message } from '@/utils/message/index'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'

const store = useStore()
const router = useRouter()
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await login({ username: loginForm.username, password: loginForm.password })
      if (res.data.code === 200) {
        message('success', '登陆成功')
        store.setToken(res.data)
        router.push('/index')
      } else {
        message('error', '用户名或者密码错误')
      }
    }
  })
}
const addUserForm = () => {
  router.push({
    path: '/add'
  })
}

</script>

<style lang='scss' scoped>
.form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30%;
  transform: translate(-50%, -50%);
}

::v-deep .el-form-item__label {
  width: 60px !important;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>