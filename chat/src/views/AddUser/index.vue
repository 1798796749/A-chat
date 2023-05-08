<template>
  <el-container>
    <el-header>
      <el-input v-model="input" class="w-50 m-2" size="large" placeholder="请输入username" @input="handleInput" />
      <el-button @click="handleSearch(input)">
        <el-icon :size="20">
          <Search />
        </el-icon>
      </el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" :lazy="true" :empty-text="'暂无更多用户数据'"
        :header-cell-style="{ 'background-color': 'var(--more-list-bg)' }"
        :cell-style="{ 'background-color': 'var(--more-list-bg)' }">
        <el-table-column type="index" align="center" />
        <el-table-column label="个人头像" align="center">
          <template #default="scope">
            <el-avatar :size="60"
              :src="scope.row.avatar ? 'http://localhost:3000' + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户姓名" align="center" />
        <el-table-column prop="baseid" label="用户ID" align="center" />
        <el-table-column label="性别" align="center">
          <template #default="scope">
            <span v-if="scope.row.gender === 0">不透露</span>
            <el-icon>
              <Male v-if="scope.row.gender === 1" />
              <Female v-else-if="scope.row.gender === 2" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="introduction" label="个人简介" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="state" label="在线状态" align="center">
          <template #default="scope">
            <el-tag class="mx-1" size="large" v-if="scope.row.state === 1" round type="success">在线</el-tag>
            <el-tag class="mx-1" size="large" round type="info" v-else>离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleAdd(scope.row.baseid)">添加好友</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { searchUser } from '@/api/index'
import _ from 'lodash'
import { ElMessage } from 'element-plus';
import { Male, Female } from '@element-plus/icons-vue'
import { useStore } from '@/store/index'

const store = useStore()
const input = ref('')
const tableData = ref([])

const handleInput = _.debounce(function () {

}, 500)

const handleSearch = async (baseid) => {
  tableData.value = []
  const res = await searchUser(baseid)
  for (let i in res.data.results) {
    if (res.data.results[i].baseid === store.userInfo.baseid) {
      continue
    }
    let userData = {
      baseid: Number,
      username: String,
      introduction: String,
      avatar: String,
      gender: Number,
      state: Number
    }
    userData.baseid = res.data.results[i].baseid
    userData.username = res.data.results[i].username
    userData.introduction = res.data.results[i].dynamic
    userData.avatar = res.data.results[i].avatar
    userData.gender = res.data.results[i].gender
    userData.state = res.data.results[i].state
    tableData.value.push(userData)
  }
  if (res.data.code === 200) {
    ElMessage.success(res.data.data)
  } else {
    ElMessage.error(res.data.data)
  }
}

const handleAdd = async (baseid) => {
  let id = Number(window.atob(baseid))
  for (let i in store.userInfo.chatuser) {
    if (store.userInfo.chatuser[i] === id) {
      ElMessage.warning('已经添加过用户了')
      return false
    }
  }

  for (let i in store.AddMessList) {
    if (store.AddMessList[i].sendInfo?.id === store.userInfo.id && store.AddMessList[i].id === id) {
      ElMessage.success('已发送申请')
      return false
    }
  }
  store.sendAdd(store.userInfo, id, +new Date())
  store.sendAddMessLocal({ sendInfo: store.userInfo, id, time: +new Date() })
  ElMessage.success('已发送申请')
}

</script>

<style lang='scss' scoped>
::v-deep .el-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

::v-deep .el-input {
  width: 50%;
}

::v-deep .el-button {
  margin-left: 15px;
}

::v-deep .el-scrollbar__wrap {
  display: inline-block;
}

::v-deep .el-table {
  border-radius: 16px;
  background-color: transparent !important;
  --el-table-border-color: none;
}
</style>