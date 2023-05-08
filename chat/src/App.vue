<template>
  <div class="app-container" ref="appRef">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from './store/index'
const store = useStore()
const appRef = ref()
watch(() => store.isTheme, () => {
  appRef.value.classList.toggle('dark')
})
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap");

* {
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
  list-style: none;
  text-overflow: ellipsis;
  overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;

  ::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 10px;
  }
}


html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
}

body {
  font-family: 'DM Sans', sans-serif;
  background-color: #778899;
}

.app {
  &-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 95vh;
    width: 90vw;
    display: flex;
    border-radius: 16px;
    flex-direction: column;
    background-color: var(--app-container);
    transition: .4s;
  }
}

#app {
  position: relative;
  height: 100vh;
  width: 100vw;
}

.app-container {
  --app-container: #f3f6fd;
  --main-color: #fff;
  --time-color: #4A4A4A;
  --link-color: #1f1c2e;
  --link-color-active-bg: #1f1c2e;
  --projects-section: #fff;
  --svg-bg: #fff;
  --more-list-bg: #fff;
  --more-list-bg-hover: #f6fbff;
  --search-area-bg: #fff;
  --message-color: #fff;
}

.dark {
  --app-container: #1f1d2b;
  --main-color: #d1d0d9;
  --time-color: rgba(255, 255, 255, .9);
  --projects-section: #1f2937;
  --link-color: rgba(255, 255, 255, .8);
  --link-color-active-bg: rgba(195, 207, 244, 0.2);
  --search-area-bg: #1f2937;
  --svg-bg: #2f3142;
  --more-list-bg: #2f3142;
  --more-list-bg-hover: rgba(195, 207, 244, 0.1);
  --message-color: rgba(195, 207, 244, 0.1);
}

.el-header {
  --el-header-padding: 0 !important;
  display: flex;
}

.el-main {
  --el-main-padding: 0 !important;
  width: auto;
}

.el-popover.el-popper {
  overflow: visible;
  max-width: 400px;
  width: auto !important;
}


.emo-image {
  height: 30px;
  width: 30px;
  vertical-align: middle;
  display: inline-block;
}

.img-text {
  max-width: 30% !important;
}

.video-text {
  max-width: 30%;
}

.w-e-text-container {
  background-color: var(--more-list-bg);
  border: none !important;
}

.w-e-toolbar {
  border: none !important;
}

.el-table__empty-block {
  background-color: var(--more-list-bg);
}

img {
  object-fit: fill;
  width: 100%;
}
</style>