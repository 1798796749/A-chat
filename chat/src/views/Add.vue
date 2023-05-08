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
      <el-form-item label="确认" prop="checkpassword">
        <el-input v-model="loginForm.checkpassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(loginFormRef)">注册</el-button>
        <el-button type="primary" @click="goPage()">跳转登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { registUser } from '../api/index'
import { message } from '@/utils/message/index'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'

const store = useStore()
const router = useRouter()
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: '',
  checkpassword: ''
})

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== loginForm.password) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  checkpassword: [{ validator: validatePass2, required: true, trigger: 'blur' }]
})

const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await registUser({ username: loginForm.username, password: loginForm.password })
      console.log(res);
      if (res.data.code === 200) {
        message('success', '注册成功')
      } else {
        message('error', '注册失败')
      }
    }
  })
}

const goPage = () => {
  router.push({
    path: '/login'
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
  overflow: visible !important;
}

::v-deep .el-form-item {
  overflow: visible !important;
}

::v-deep .el-form-item__content {
  overflow: visible !important;
}

::v-deep .el-form-item__label {
  width: 60px !important;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>