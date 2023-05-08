<template>
  <el-container>
    <el-header>
      <span>添加用户</span>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" :empty-text="'暂无更多用户数据'"
        :header-cell-style="{ 'background-color': 'var(--more-list-bg)' }"
        :cell-style="{ 'background-color': 'var(--more-list-bg)' }">
        <el-table-column type="index" align="center" />
        <el-table-column label="时间" width="180" sortable>
          <template #default="scope">
            <span>{{ getTime(scope.row.time) }}</span>
          </template>
        </el-table-column>
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
            <el-button type="success" @click="AddSuccess(scope.row.baseid, scope.$index)">同意</el-button>
            <el-button type="danger" @click="AddError(scope.row.baseid, scope.$index)">拒绝</el-button>
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
import { addUser, deleteAdd } from '@/api/index'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'
import { getTime } from '@/utils/filterTime/index'

const router = useRouter()
const store = useStore()
const tableData = ref([])

const init = () => {
  tableData.value = []
  for (let i in store.AddMessList) {
    if (store.AddMessList[i].id === store.userInfo.id) {
      let userData = {
        baseid: Number,
        username: String,
        introduction: String,
        avatar: String,
        gender: Number,
        state: Number,
        time: String
      }
      userData.baseid = store.AddMessList[i].sendInfo?.baseid
      userData.username = store.AddMessList[i].sendInfo?.username
      userData.introduction = store.AddMessList[i].sendInfo?.dynamic
      userData.avatar = store.AddMessList[i].sendInfo?.avatar
      userData.gender = store.AddMessList[i].sendInfo?.gender
      userData.state = store.AddMessList[i].sendInfo?.state
      userData.time = store.AddMessList[i].time
      tableData.value.push(userData)
    }
  }
}

const AddSuccess = async (baseid, index) => {
  let id = Number(window.atob(baseid))
  let idInfo = {
    id
  }
  let res = await addUser(idInfo)
  if (res.data.code === 200) {
    await store.getUserInfo()
    await deleteAdd(id, store.userInfo.id)
    ElMessage.success(res.data.data)
    tableData.value.splice(index, 1)
  } else {
    ElMessage.error(res.data.data)
  }
}

const AddError = async (baseid, index) => {
  let res = await deleteAdd(id, store.userInfo.id)
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
  nextTick(() => {
    init()
  })
})
onActivated(() => {
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