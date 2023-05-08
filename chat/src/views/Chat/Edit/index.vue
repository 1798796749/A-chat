<template>
  <nav-bar></nav-bar>
  <el-scrollbar overflow-x="hidden" height="100px">
    <div id="chatEditor" @keydown.enter="keyDown($event)"></div>
  </el-scrollbar>
  <el-button @click="sendVerify">发送</el-button>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useStore } from '@/store/index'
import NavBar from '../NavBar/index.vue'
const store = useStore()

const sendVerify = () => {
  let sendContent = store.editor.txt.html().trim()
  if (!sendContent.length) {
    return
  } else {
    let timestamp = +new Date()
    let conversition = {
      sendid: Number,
      recipientid: Number,
      content: String,
      time: timestamp,
      isRead: Number,
      avatar: String,
    }
    conversition.sendid = store.userInfo.id
    conversition.recipientid = store.sendUser.id
    conversition.content = sendContent
    conversition.isRead = 0
    conversition.avatar = store.userInfo.avatar ? store.userInfo.avatar : ""
    if (store.socket == null) {
      ElMessage.warning('socket不存在')
      return
    }
    store.sendLocal(conversition)
    store.sendInfos(conversition)
  }
  clear()
}

const keyDown = (event) => {
  event.preventDefault()
  sendVerify()
}

const clear = () => {
  try {
    return store.editor.txt.clear()
  } catch (e) {
    console.warn(e)
  }
}

onMounted(() => {
  store.initEditor()
})
</script>    

<style lang="scss" scoped>
.toolbar-container {
  border-bottom: 1px solid #ccc;
}

.el-scrollbar {
  height: auto !important;
}
</style>