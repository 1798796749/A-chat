<template>
  <el-header>
    <div class="left">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <span>A-聊天室</span>
    </div>
    <div class="right">

      <svg class="mode-switch" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
        stroke-width="2" width="24" height="24" viewBox="0 0 24 24" ref="ThemeRef" @click="handleTheme">
        <defs></defs>
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
      </svg>

      <el-avatar :src="'http://localhost:3000' + store.sendUser?.avatar" style="cursor: pointer;margin-right: 10px;"
        @click="handleInfo"></el-avatar>
    </div>
  </el-header>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { HomeFilled } from '@element-plus/icons-vue'
import { useStore } from '../../store/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const ThemeRef = ref()

const handleTheme = () => {
  store.isTheme = !store.isTheme
  ThemeRef.value.classList.toggle('active');
}
const handleInfo = () => {
  router.push({
    path: `/index/userinfo/${store.sendUser.chatid}`
  })
}
</script>

<style lang='scss' scoped>
.el-header {
  border-bottom: 1px solid var(--more-list-shadow);
}

::v-deep .el-icon {
  font-size: 2rem;
  color: darkgray;
  cursor: pointer;
}

.left {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  span {
    font-weight: 600;
    font-size: large;
    color: var(--link-color);
  }
}

.right {
  flex: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
}

.mode-switch {
  fill: var(--svg-bg);
  cursor: pointer;
}

.active {
  fill: white;
}
</style>