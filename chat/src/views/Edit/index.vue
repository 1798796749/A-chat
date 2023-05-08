<template>
  <el-row :gutter="20">
    <el-col :span="8" style="cursor: pointer;">
      <el-card shadow="hover" class="box-card">
        <el-avatar :size="80" :src="avatarUrl"></el-avatar>
        <h3>{{ store.userInfo.username }}</h3>
        <h5></h5>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <template #header>
          <div>
            <span>个人信息</span>
          </div>
        </template>
        <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="120px" class="demo-ruleForm"
          :hide-required-asterisk="true">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="用户ID" prop="baseid">
            <el-input v-model="userForm.baseid" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="userForm.gender" style="width: 100%;" placeholder="选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="个人动态" prop="introduction">
            <el-input v-model="userForm.introduction" type="textarea" />
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-upload class="avatar-uploader" action :show-file-list="false" :auto-upload="false"
              :on-change="handleChange">
              <img v-if="userForm.avatar != 'http://localhost:3000null'" :src="userForm.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="userForm.username === store.userInfo.username">
            <el-button type="primary" @click="submitForm()">更新</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed, onActivated, onDeactivated } from 'vue'
import { useStore } from '@/store/index'
import { Plus } from '@element-plus/icons-vue'
import { changeinfo } from '@/api/index'
import { ElMessage } from 'element-plus';
const userFormRef = ref()
const store = useStore()
const avatarUrl = computed(() => store.userInfo.avatar ? 'http://localhost:3000' + store.userInfo.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const { username, dynamic, avatar, gender, baseid } = store.userInfo
const userForm = reactive({
  baseid,
  username,
  introduction: dynamic,
  avatar,
  gender,
  file: null
})

const userFormRules = reactive({
  username: [
    { required: true, message: '请输入名字', trigger: 'blur' },
  ],
  introduction: [
    { message: '请输入简介', trigger: 'blur' },
  ],
  avatar: [
    { message: '请上传头像', trigger: 'blur' },
  ],
})

const options = [
  {
    label: '保密',
    value: 0
  },
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  },
]

const handleChange = (file) => {
  userForm.avatar = URL.createObjectURL(file.raw)
  userForm.file = file.raw
}

const submitForm = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      const params = new FormData()
      for (let i in userForm) {
        params.append(i, userForm[i])
      }
      let res = await changeinfo(params)
      if (res.data.code === 200) {
        store.getUserInfo()
        ElMessage.success('更新成功 ')
      }
    }
  })
}

onActivated(() => {
  userForm.avatar = 'http://localhost:3000' + userForm.avatar
})
onDeactivated(() => {
  userForm.avatar = store.userInfo.avatar
})

</script>

<style lang='scss' scoped>
.el-row {
  width: 100%;
  height: 100%;
}

.box-card {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

::v-deep .el-card__body {
  background-color: var(--more-list-bg);
}

::v-deep .el-card__header {
  background-color: var(--more-list-bg);
}

span {
  color: var(--link-color);
}

::v-deep .el-card {
  border: none;
  background-color: transparent;
}
</style>