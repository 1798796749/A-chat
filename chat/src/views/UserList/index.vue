<template>
  <el-container>
    <el-header>
      <span>好友列表</span>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" :empty-text="'暂无更多用户数据'"
        :header-cell-style="{ 'background-color': 'var(--more-list-bg)' }"
        :cell-style="{ 'background-color': 'var(--more-list-bg)' }">
        <el-table-column type="index" align="center" />
        <el-table-column label="用户信息" align="center">
          <template #default="scope">
            <el-avatar :size="60"
              :src="scope.row.avatar ? 'http://localhost:3000' + scope.row.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
              @click="handleInfo"></el-avatar>
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
        <el-table-column fixed="right" align="center">
          <template #default="scope">
            <el-button type="danger" @click="deleteUser(scope.row.baseid, scope.$index)">解除好友关系</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, onActivated, onMounted, nextTick, computed } from 'vue'
import { Male, Female } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { getuserlist, deleteUserInfo } from '@/api/index'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const tableData = ref([])
const userList = ref([])

const init = () => {
  tableData.value = []
  for (let i in userList.value) {
    if (userList.value[i].id === store.userInfo.id)
      continue
    let userData = {
      baseid: Number,
      username: String,
      introduction: String,
      avatar: String,
      gender: Number,
      state: Number,
      time: String
    }
    userData.baseid = userList.value[i].baseid
    userData.username = userList.value[i].username
    userData.introduction = userList.value[i].dynamic
    userData.avatar = userList.value[i].avatar
    userData.gender = userList.value[i].gender
    userData.state = userList.value[i].state
    tableData.value.push(userData)
  }
}

const deleteUser = async (baseid, index) => {
  let id = Number(window.atob(baseid))
  let idInfo = {
    id
  }
  let res = await deleteUserInfo(idInfo)
  if (res.data.code === 200) {
    ElMessage.success(res.data.data)
  }
  tableData.value.splice(index, 1)
}
const handleInfo = () => {
  router.push({
    path: `/index/userinfo/${store.sendUser.chatid}`
  })
}

onMounted(() => {
  nextTick(async () => {
    const res = await getuserlist()
    userList.value = res.data.results
    init()
  })
})
onActivated(async () => {
  const res = await getuserlist()
  userList.value = res.data.results
  init()
})
</script>

<style lang='scss' scoped>
span {
  color: var(--link-color);
}

::v-deep .el-scrollbar__wrap {
  display: inline-block;
}

::v-deep .el-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-table {
  border-radius: 16px;
  background-color: transparent !important;
  --el-table-border-color: none;
}
</style>
