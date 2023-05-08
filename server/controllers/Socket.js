const query = require('../db/index')
exports.getrepectinfo = (recipientid) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from user where id =?`
      query(sql, recipientid, (err, results) => {
        if (err) reject('查询用户失败')
        if (!results) reject('查询用户失败')
        resolve(results[0], '获取用户成功')
      })
    } catch {
      reject('查询用户异常')
    }
  })
}
exports.updateChatIdById = function (id, socketId) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update user set chatid = ? where id = ?`
      query(sql, [socketId, id], (err) => {
        if (err) {
          reject('更新用户socketId失败')
        } else {
          resolve('成功')
        }
      })
    } catch {
      reject('更新用户socketId异常')
    }
  })
}
exports.stateOut = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `update user set state=0 where chatid=?`
      query(sql, id, (err, results) => {
        if (err) reject('用户下线失败', err)
        console.log(results)
        if (!results) reject('用户下线失败')
        resolve('用户下线成功')
      })
    } catch {
      reject('查询用户异常')
    }
  })
}
exports.getUserByChatId = function (socketId) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from user where chatid = ?`
      query(sql, socketId, (err, user) => {
        if (err) {
          reject('根据socketId获取用户信息失败')
        } else {
          resolve(user, '成功')
        }
      })
    } catch {
      reject('根据socketId获取用户信息异常')
    }
  })
}
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from user where id =?`
      query(sql, id, (err, results) => {
        if (err) reject('查询用户失败')
        if (!results.length) reject('查询用户失败')
        resolve(results[0], '获取用户成功')
      })
    } catch {
      reject('查询用户异常')
    }
  })
}
