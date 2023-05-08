<template>
  <el-aside style="width: 250px;">
    <el-row v-for="(item, index) in userList " :key="index">
      <el-col :span="24" @click="handleChangeUser(item)" style="cursor: pointer;">
        <el-card>
          <div style="overflow: visible;">
            <el-avatar :size="60"
              :src="item.avatar ? 'http://localhost:3000' + item.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
              v-if="item.username == store.userInfo?.username || store.messList[index] == 0" />
            <el-badge :max="100" :value="store.messList[index]" class="item" type="primary" v-else>
              <el-avatar :size="60"
                :src="item.avatar ? 'http://localhost:3000' + item.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            </el-badge>
          </div>
          <div class="list-content">
            <h3>{{ item.username }}</h3>
            <span v-html="store.sessionList[index]"></span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script setup>
import { ref, onActivated, watch, computed, nextTick, onMounted } from 'vue'
import { useStore } from '@/store/index'
import { getuserlist, changeRead } from '@/api/index'
const store = useStore()
const userList = ref([])

const handleChangeUser = async (item) => {
  store.sendUser = item
  let res = await changeRead(store.sendUser.id)
  if (res.data.code === 200) {
    for (let i in store.conversitionList) {
      for (let j in res.data.data) {
        if (store.conversitionList[i].content === res.data.data[j].content) {
          store.conversitionList[i].isRead = 1
        }
      }
    }
  }
  for (let i in store.userList) {
    let conversitionList = store.conversitionList.filter(
      (x) =>
        x.recipientid == store.userInfo.id && x.sendid == store.userList[i].id && x.isRead == 0
    )
    store.messList[i] = conversitionList.length
  }
}

watch(() => store.conversitionList.length, () => {
  for (let i in store.userList) {
    let conversitionList = store.conversitionList.filter(
      (x) =>
        (x.sendid == store.userInfo?.id && x.recipientid == store.userList[i].id) ||
        (x.recipientid == store.userInfo?.id && x.sendid == store.userList[i].id)
    )
    store.sessionList[i] = conversitionList ? conversitionList[conversitionList.length - 1]?.content : ''
    if (store.sessionList[i]) {
      if (store.sessionList[i]?.indexOf('<img') != -1 || store.sessionList[i]?.indexOf('<video') != -1) {
        store.sessionList[i] = '新的消息带查收...'
      }
    }
  }
})
watch(() => store.conversitionList.length, async () => {
  let res = await changeRead(store.sendUser?.id)
  if (res.data.code === 200) {
    for (let i in store.conversitionList) {
      for (let j in res.data.data) {
        if (store.conversitionList[i].content === res.data.data[j].content) {
          store.conversitionList[i].isRead = 1
        }
      }
    }
  }
  for (let i in store.userList) {
    let conversitionList = store.conversitionList.filter(
      (x) =>
        x.recipientid == store.userInfo.id && x.sendid == store.userList[i].id && x.isRead == 0
    )
    store.messList[i] = conversitionList.length
  }
  // console.log(store.messList);
}, {
  immediate: true,
  deep: true
})

onActivated(async () => {
  const res = await getuserlist()
  userList.value = res.data.results
  store.userList = userList.value
  if (store.sessionList.length === 0 || store.sessionList.length !== store.userList.length) {
    store.sessionList = new Array(store.userList.length)
  }
  for (let i in userList.value) {
    if (userList.value[i].username === store.userInfo.username) {
      store.sendUser = userList.value[i]
    }
  }
  let msg = await changeRead(store.sendUser?.id)
  if (msg.data.code === 200) {
    for (let i in store.conversitionList) {
      for (let j in msg.data.data) {
        if (store.conversitionList[i].content === msg.data.data[j].content) {
          store.conversitionList[i].isRead = 1
        }
      }
    }
  }
})
onMounted(() => {
  nextTick(() => {
    store.messList = new Array(store.userList.length)
  })
})
</script>

<style lang='scss' scoped>
::v-deep .el-card {
  border: none;
  background-color: transparent;
}

.el-aside {
  border-left: 1px solid var(--more-list-shadow);
  border-right: 1px solid var(--more-list-shadow);
  text-overflow: ellipsis;
  white-space: nowrap;

  .el-row {
    margin: 10px;
  }
}

::v-deep .el-card__body {
  display: flex;
  align-items: center;
  background-color: var(--more-list-bg);
  padding: 15px 5px;
}

::v-deep .el-badge {
  overflow: visible;
}

.list-content {
  margin-left: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  color: var(--link-color);
}
</style>