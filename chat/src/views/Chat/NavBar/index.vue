<template>
  <el-row>
    <el-popover placement="top" trigger="click">
      <template #reference>
        <div style="cursor:pointer; display: flex; align-items:center ;">
          <el-button type="primary" circle :icon="Star">
          </el-button>
        </div>
      </template>
      <el-scrollbar class="emoji-title" height="9.375rem">
        <ul class="emoji">
          <li v-for="item in store.emojiList" :key="item.title" class="emoji-li" :title="item.title">
            <img width="30" height="30" :src="item.icon" @click="selectIcon(item.icon)" />
          </li>
        </ul>
      </el-scrollbar>
    </el-popover>

    <el-upload class="upload-demo" action :show-file-list="false" :auto-upload="false" :on-change="handleImgChange"
      accept=".png, .jpg, .JPG, .JPEG, .jpeg, .PNG .GIF, .gif">
      <el-button type="primary" circle :icon="Picture" style="margin-left: 10px;">
      </el-button>
    </el-upload>

    <el-upload class="upload-demo" action :show-file-list="false" :auto-upload="false" :before-upload="beforeAvatarUpload"
      :on-change="handleChange">
      <el-button type="primary" circle :icon="VideoCamera" style="margin-left: 10px;">
      </el-button>
    </el-upload>

  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from '@/store';
import { ElMessage } from 'element-plus'
import { uploadVideo, uploadImg } from '@/api/index'
import { Star, Picture, VideoCamera } from '@element-plus/icons-vue'

const store = useStore()

const videoForm = reactive({
  filename: String,
  file: null
})

const imgForm = reactive({
  filename: String,
  file: null
})

const selectIcon = (icon) => {
  let iconContent = `<img src='${icon}' class='emo-image' />`
  store.editor.cmd.do("insertHTML", iconContent)
}

const beforeAvatarUpload = (file) => {
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
    ElMessage.error('上传视频只能是 mp4、ogg、flv、avi、wmv、rmvb 格式!');
    return false;
  }
  if (!isLt50M) {
    ElMessage.error('上传视频大小不能超过 50MB!');
    return false;
  }
  return true;
}

const handleImgChange = async (file) => {
  imgForm.filename = URL.createObjectURL(file.raw)
  imgForm.file = file.raw
  const params = new FormData()
  for (let i in imgForm) {
    params.append(i, imgForm[i])
  }
  let res = await uploadImg(params)
  if (res.status === 200) {
    let imgContent = res.data.img
    let imgRes = `<img src='http://localhost:3000${imgContent}' class=img-text />`
    store.editor.cmd.do("insertHTML", imgRes)
  } else {
    ElMessage.error('图片找不到啦！')
  }
}

const handleChange = async (file) => {
  if (beforeAvatarUpload) {
    videoForm.filename = URL.createObjectURL(file.raw)
    videoForm.file = file.raw
    const params = new FormData()
    for (let i in videoForm) {
      params.append(i, videoForm[i])
    }
    let res = await uploadVideo(params)
    if (res.status === 200) {
      let videoContent = res.data.video
      let videoRes = `<video src='http://localhost:3000${videoContent}' class='video-text' controls />`
      store.editor.cmd.do("insertHTML", videoRes)
    } else {
      ElMessage.error('视频找不到啦！')
    }
  }
}

</script>

<style lang='scss' scoped>
.emoji-title {
  cursor: pointer;

  .emoji {
    display: flex;
    padding-right: .125rem;
    flex-wrap: wrap;
  }

  .emoji-li {
    box-sizing: border-box;
    padding: .3125rem;
    cursor: pointer;
  }
}

.emoji-li img:hover {
  animation-name: test;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes test {
  50% {
    transform: scale(1.5)
  }
}

::v-deep .el-row {
  display: flex;
  align-items: center;
}

.upload-demo {
  display: flex;
  align-items: center;
}

::v-deep .el-button {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>