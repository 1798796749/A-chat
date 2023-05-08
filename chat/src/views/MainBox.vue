<template>
  <div class="common-layout">
    <el-container direction="vertical" id="el-container">
      <top-header></top-header>
      <el-container>
        <side-menu></side-menu>
        <el-container>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import TopHeader from '../components/mainbox/TopHeader.vue'
import SideMenu from '../components/mainbox/SideMenu.vue'
import { useStore } from '@/store/index'
import io from "socket.io-client"
import { ElMessage } from 'element-plus'
import { changState, stateOut } from '@/api/index'
const store = useStore()
const chatUrl = import.meta.env.VITE_BASE_API


const initSocket = () => {
  store.socket = io(chatUrl, {
    // 通过token连接
    auth: {
      token: store.token
    }
  })
  // 初始化连接
  store.socket.on("connect", () => {
    console.log("连接成功")
    store.socket.emit("joinChat")
  })
  store.socket.on("joinsuccess", async (data) => {
    store.toBottom()
    store.conversitionList = data.contentRes
    store.AddMessList = data.ResData
    await changState()
  })
  store.socket.on("reviceMsg", data => {
    store.sendLocal(data)
    store.toBottom()
  })
  store.socket.on("reviceAdd", data => {
    store.sendAddMessLocal(data)
  })
  store.socket.on('squeezeOut', () => {
    store.logout()
    ElMessage.error("账户在其它地方登陆，会话已断开！")
    router.push({
      name: "Login"
    })
  })
  // 过期下线
  store.socket.on("forceOut", async () => {
    store.logout()
    ElMessage.error("登录已过期！")
    await stateOut()
    router.push({
      name: "Login"
    })
  })
}

onMounted(() => {
  initSocket()
})
</script>

<style lang='scss' scoped>
.common-layout {
  position: inherit;
  top: inherit;
  left: inherit;
  transform: inherit;
  height: 100%;
  width: 100%;
  border-radius: 16px;
}

::v-deep #el-container {
  height: 100%;
  position: relative;
}
</style>