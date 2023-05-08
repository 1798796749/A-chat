<template>
  <el-container>
    <chat-aside></chat-aside>
    <el-container id="container-center">
      <el-header>
        <div class="send-info">
          <h2>{{ store.sendUser?.username }}</h2>
          <el-avatar :size="60" :src="'http://localhost:3000' + store.sendUser?.avatar" style="cursor: pointer;"
            @click="handleInfo"></el-avatar>
        </div>
      </el-header>
      <el-scrollbar ref="chatScrollbar">
        <el-main>
          <div v-for="(item, index) in conversitionList" :key="index">
            <el-divider v-if="renderMessageDate(item, index, conversitionList) != ''" style="overflow: visible;">
              {{ renderMessageDate(item, index, conversitionList) }}
            </el-divider>
            <div class="other-content" v-if="item.sendid != store.userInfo.id">
              <el-avatar :size="50"
                :src="item.avatar ? 'http://localhost:3000' + item.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <div class="talk-bubble left-in">
                <div class="talktext">
                  <p v-html="item.content"></p>
                </div>
              </div>
            </div>
            <div class="my-content" v-else>
              <div class="talk-bubble right-in">
                <div class="talktext">
                  <p v-html="item.content"></p>
                </div>
              </div>
              <el-avatar :size="50"
                :src="item.avatar ? 'http://localhost:3000' + item.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <!-- <span>{{ getTime(item.time) }}</span> -->
            </div>
          </div>
        </el-main>
      </el-scrollbar>
      <el-footer height="200px">
        <chat-edit></chat-edit>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onActivated } from 'vue'
import ChatEdit from './Edit/index.vue'
import { useStore } from '@/store/index'
import { useRouter } from 'vue-router'
import { getTime } from '@/utils/filterTime/index'
import ChatAside from './UserList/index.vue'

const store = useStore()
const router = useRouter()
const chatScrollbar = ref(null)
const conversitionList = computed(() => {
  return store.conversitionList.filter(
    (x) =>
      (x.sendid == store.userInfo?.id && x.recipientid == store.sendUser?.id) ||
      (x.recipientid == store.userInfo?.id && x.sendid == store.sendUser?.id)
  )
})


const renderMessageDate = computed(() => {
  return (message, index, messages) => {
    if ((message && index === 0) || (message && message.time - messages[index - 1].time > 5 * 60 * 1000)) {
      return `${getTime(message.time)}`
    }
    return "";
  }
})

const handleInfo = () => {
  router.push({
    path: `/index/userinfo/${store.sendUser.chatid}`
  })
}

onMounted(() => {
  nextTick(() => {
    store.chatScrollbar = chatScrollbar.value
  })
})
onActivated(() => {
  store.toBottom()
})
</script>

<style lang='scss' scoped>
#container-center {
  margin: 5px 10px;
}



.send-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--link-color);
}


::v-deep .el-row {
  margin: 10px 0;
  align-items: center;
  flex-direction: row;
}

::v-deep .el-main {
  img {
    max-width: 200px !important;
    max-height: 200px !important;
  }

  video {
    object-fit: fill !important;
    max-width: 100% !important;
  }
}

::v-deep .el-scrollbar {
  background-color: var(--more-list-bg);
  margin: 10px 0;
  border-radius: 16px;
}

::v-deep .el-scrollbar__bar.is-vertical {
  width: 0px !important;
}

.my-content {
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
}

.other-content {
  display: flex;
  justify-content: flex-start;
  padding: 5px 10px;
}

.talk-bubble {
  border-radius: 10px;
  position: relative;
  overflow: visible;
  text-overflow: initial;
  white-space: normal;
  width: auto;
  height: auto;
  background-color: var(--el-menu-active-color);
  margin: 10px 20px;
  max-width: 80%;
}

.right-in:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -12px;
  top: 6px;
  bottom: auto;
  border: 7px solid;
  border-color: var(--el-menu-active-color) transparent transparent var(--el-menu-active-color);
}

.left-in:after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: -12px;
  right: auto;
  top: 6px;
  bottom: auto;
  border: 7px solid;
  border-color: var(--el-menu-active-color) var(--el-menu-active-color) transparent transparent;
}

.talktext {
  padding: 0.7em;
  line-height: 1em;
}

::v-deep .el-divider__text {
  background-color: transparent;
  color: var(--time-color);
}
</style>