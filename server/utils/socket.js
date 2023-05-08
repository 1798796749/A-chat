const socket = require('socket.io')
const JWT = require('./JWT')
const {
  getrepectinfo,
  updateChatIdById,
  stateOut,
  getUserByChatId,
  getUserById
} = require('../controllers/Socket')
const { insertAddMess, getAddMessBtId } = require('../controllers/AddMess')
const { insertContent, getContentBySendId } = require('../controllers/Content')
module.exports = (server) => {
  const io = socket(server, {
    cors: {
      origin: '*'
    }
  })
  io.on('connection', async function (socket) {
    if (!socket.handshake.auth.token) {
      socket.disconnect()
    }
    let userinfo = JWT.verify(socket.handshake.auth.token)
    if (!userinfo) {
      socket.disconnect()
    }
    socket.on('joinChat', async () => {
      let ResData = []
      let id = userinfo.results.id
      const userResult = await getUserById(id)
      socket.to(userResult.chatid).emit('squeezeOut')
      await updateChatIdById(id, socket.id)
      let contentRes = await getContentBySendId(id)
      let messRes = await getAddMessBtId()
      for (let i in messRes) {
        let AddUserList = {
          sendInfo: {},
          id: 0,
          time: 0
        }
        let userRes = await getUserById(messRes[i].sendid)
        AddUserList.sendInfo = userRes
        AddUserList.id = messRes[i].recipetid
        AddUserList.time = messRes[i].time
        ResData.push(AddUserList)
      }
      socket.emit('joinsuccess', { contentRes, ResData })
    })
    socket.on('sendMsg', async (conversition) => {
      try {
        let resUser = await getrepectinfo(conversition.recipientid)
        await insertContent(conversition)
        if (resUser && resUser.chatid) {
          socket.to(resUser.chatid).emit('reviceMsg', conversition)
        }
      } catch (e) {
        console.log(e)
      }
    })
    socket.on('sendAdd', async (data) => {
      try {
        let resUser = await getrepectinfo(data.id)
        await insertAddMess(data.sendInfo.id, data.id, data.time)
        if (resUser && resUser.chatid) {
          socket.to(resUser.chatid).emit('reviceAdd', {
            sendInfo: data.sendInfo,
            recipetid: data.id,
            time: data.time
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
    socket.on('disconnect', async () => {
      await stateOut(socket.id)
      console.log('连接已断开')
    })
  })
}
// 事件
