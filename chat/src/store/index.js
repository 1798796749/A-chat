import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { nextTick } from 'vue'
import emojiList from '@/json/emoji.json'
import edit from 'wangeditor'
import { getuserinfo } from '../api/index'
export const useStore = defineStore('counterStore', {
  state: () => {
    return {
      isTheme: true,
      token: Cookies.get('Authorization'),
      editor: null,
      editorData: '',
      conversitionList: [],
      userInfo: null,
      sendUser: null,
      userList: [],
      socket: null,
      chatScrollbar: null,
      sessionList: [],
      emojiList: emojiList,
      messList: [],
      AddMessList: []
    }
  },
  getters: {},
  actions: {
    setToken(data) {
      Cookies.set('Authorization', data?.token)
      this.token = data?.token
    },
    initEditor() {
      if (this.editor != null) {
        this.editor.destroy()
        this.editor = null
      }
      this.editor = new edit('#chatEditor')
      this.editor.config.showFullScreen = false
      this.editor.config.focus = true

      this.editor.config.menus = []

      // change
      this.editor.config.onchange = (html) => {
        this.editorData = html
      }

      // 上传最多1张
      this.editor.config.uploadImgMaxLength = 1
      // 添加上传本地图片接口
      this.editor.config.customUploadImg = function (files, insert) {
        insert(files)
      }
      nextTick(() => {
        this.editor.create()
        this.editor.txt.html(this.editorData)
      })
    },
    sendLocal(conversition) {
      this.conversitionList.push(conversition)
      this.toBottom()
    },
    sendInfos(conversition) {
      if (this.socket != null) {
        this.socket.emit('sendMsg', conversition)
      }
    },

    sendAddMessLocal(data) {
      this.AddMessList.push(data)
    },

    sendAdd(sendInfo, id, time) {
      if (this.socket != null) {
        this.socket.emit('sendAdd', { sendInfo, id, time })
      }
    },
    // 设置会话窗口到达底部
    toBottom() {
      const timer = setTimeout(() => {
        this.chatScrollbar?.setScrollTop(9999)
        clearTimeout(timer)
      }, 300)
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getuserinfo()
          .then((res) => {
            if (res.data.code === 200) {
              this.userInfo = res.data.userinfo
              resolve('获取成功')
            } else reject()
          })
          .catch(() => {
            reject()
          })
      })
    },
    logout() {
      Cookies.remove('Authorization')
      this.$patch((state) => {
        state.userInfo = null
        state.token = undefined
      })
      if (this.socket != null) {
        this.socket.disconnect()
      }
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['sendUser']
  }
})
