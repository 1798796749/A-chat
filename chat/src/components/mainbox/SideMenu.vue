<template>
  <el-aside style="width: auto;">
    <el-menu :router="true" :default-active="route.fullPath">
      <el-menu-item index="/index/chat">
        <el-icon>
          <ChatDotRound />
        </el-icon>
      </el-menu-item>
      <el-menu-item index="/index/userlist">
        <el-icon>
          <Tickets />
        </el-icon>
      </el-menu-item>
      <el-menu-item index="/index/adduser">
        <el-icon>
          <CirclePlus />
        </el-icon>

      </el-menu-item>
      <el-menu-item index="/index/addinfo">
        <el-icon>
          <Setting />
        </el-icon>
      </el-menu-item>
      <el-menu-item index="/index/userinfo">
        <el-icon>
          <User />
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ChatDotRound, Tickets, CirclePlus, Setting, User } from '@element-plus/icons-vue'
import { useStore } from '../../store/index'
import { useRoute } from 'vue-router'
const route = useRoute()
const store = useStore()
</script>

<style lang='scss' scoped>
.el-aside {
  margin: auto;
  height: auto;
}

::v-deep .el-menu {
  border-right: 0;
  background-color: transparent;

  .el-menu-item {
    color: darkgray;
  }

  .el-menu-item:hover {
    background-color: transparent;

    .el-icon {
      font-size: 150%;
    }
  }

  .el-menu-item.is-active {
    color: #409eff;
  }
}
</style>  