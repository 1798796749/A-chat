import { createRouter, createWebHashHistory } from 'vue-router'
import { showFullLoading, hideFullLoading } from '../utils/nProgress/index'
import { ElMessage } from 'element-plus'
import { useStore } from '../store'

const routes = [
  {
    path: '/index',
    redirect: {
      name: 'Chat'
    }
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    name: 'Login',
    meta: {
      title: '欢迎登录'
    }
  },
  {
    path: '/add',
    component: () => import('../views/Add.vue'),
    name: 'Add',
    meta: {
      title: '注册用户'
    }
  },
  {
    path: '/index',
    component: () => import('../views/MainBox.vue'),
    children: [
      {
        path: '/index/chat',
        component: () => import('../views/Chat/index.vue'),
        name: 'Chat',
        meta: {
          title: '多人聊天'
        }
      },
      {
        path: '/index/userlist',
        component: () => import('../views/UserList/index.vue'),
        name: 'UserList',
        meta: {
          title: '好友列表'
        }
      },
      {
        path: '/index/addinfo',
        component: () => import('../views/AddInfo/index.vue'),
        name: 'AddInfo',
        meta: {
          title: '好友申请'
        }
      },
      {
        path: '/index/adduser',
        component: () => import('../views/AddUser/index.vue'),
        name: 'AddUser',
        meta: {
          title: '添加用户'
        }
      },
      {
        path: '/index/userinfo',
        component: () => import('../views/Edit/index.vue'),
        name: 'Edit',
        meta: {
          title: '用户信息'
        }
      },
      {
        path: '/index/userinfo/:id',
        component: () => import('../views/Edit/Other/index.vue'),
        name: 'Other',
        meta: {
          title: '用户信息'
        }
      },
      {
        path: '/:pathMath(.*)*',
        component: () => import('../views/NotFound/index.vue'),
        name: 'NotFound',
        meta: {
          title: '页面不存在'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const store = useStore()
  showFullLoading()
  if (to.name === 'Login' || to.name === 'Add') {
    next()
    store.logout()
  } else {
    if (store.token && !store.userInfo) {
      store
        .getUserInfo()
        .then(() => {
          next()
        })
        .catch(() => {
          ElMessage.error('获取用户信息失败')
          next({ name: 'Login' })
        })
    } else if (store.token && store.userInfo) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'A-通讯聊天室'
  }
})

router.afterEach((to, from) => hideFullLoading())

export default router
