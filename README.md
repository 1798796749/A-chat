## Vue-Socket 即时通讯录

=======
# A-chat
基于vue3.2+js+vite2+nodejs的即时通讯聊天室
Vue-Socket 即时通讯录
|     功能     |       功能说明        | web  |
| :----------: | :-------------------: | :--: |
|     登录     |     jwt token登录     |  √   |
|     注册     |      数据库注册       |  √   |
|   用户列表   |    获取好友的列表     |  √   |
|   发送消息   | socket.io客户端服务端 |  √   |
| 标记未读信息 |   通过在线状态标记    |  √   |

### 拉取项目

```
git clone https://github.com/1798796749/A-chat.git
```

### 基本目录

```
vue3-socket-chat     
├──chat    // web端项目
├──server  // 服务端项目
├──db        // 数据库
```

### 启动项目

#### web端

- 进入web目录

  ```
  cd chat
  ```

- 安装依赖

  ```
  yarn 
  ```

- 运行项目

  ```
  yarn dev
  ```

#### server端

- 进入server目录

  ```
  cd server
  ```

- 安装依赖

  ```
  yarn
  ```

- 运行项目

  ```
  npm start
  ```


