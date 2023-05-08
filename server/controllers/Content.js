const query = require('../db/index')
// 插入聊天内容
exports.insertContent = function ({
  sendid,
  recipientid,
  content,
  time,
  isRead,
  avatar
}) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `insert into chat set ?`
      query(
        sql,
        {
          sendid,
          recipientid,
          content,
          isRead,
          time,
          avatar
        },
        (err) => {
          if (err) {
            reject('插入聊天内容失败')
          } else {
            resolve('成功')
          }
        }
      )
    } catch {
      reject('插入聊天内容异常')
    }
  })
}
// 获取用户的聊天内容
exports.getContentBySendId = function (id) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from chat where sendid = ? or recipientid = ?`
      query(sql, [id, id], (err, content) => {
        if (err) {
          reject('查询聊天内容失败')
        } else {
          resolve(content, '成功')
        }
      })
    } catch {
      reject('查询聊天内容异常')
    }
  })
}

//聊天头像插入
exports.insertAvatar = function (avatar, id) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update chat set avatar = ? where sendid = ?`
      query(sql, [avatar, id], (err) => {
        if (err) {
          reject('头像更新失败')
        } else {
          resolve('头像更新成功')
        }
      })
    } catch {
      reject('头像更新异常')
    }
  })
}

//更改阅读状态
exports.changeReadState = function (sendid, recipid) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update chat set isRead = 1  where sendid=? and recipientid = ?`
      const sql2 = `select * from  chat where sendid=? and recipientid = ?`
      query(sql2, [sendid, recipid], (err, data) => {
        if (err) {
          reject('读取消息失败')
        } else {
          resolve(data, '读取消息成功')
        }
      })
      query(sql, [sendid, recipid], (err, data) => {
        if (err) {
          reject('更新阅读失败')
        }
      })
    } catch {
      reject('更新阅读异常')
    }
  })
}
exports.getAddUser = function (id) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from user where id=?`
      query(sql, id, (err, data) => {
        if (err) {
          reject('更新阅读失败')
        } else {
          resolve(data, '成功')
        }
      })
    } catch {
      reject('更新阅读异常')
    }
  })
}
