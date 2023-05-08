const query = require('../db/index')
exports.insertAddMess = (sendid, recipientid, time) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `insert into adduser values (?,?,?)`
      query(sql, [sendid, recipientid, time], (err, results) => {
        if (err) reject('插入消息失败')
        if (!results) reject('插入消息失败')
        resolve('插入消息成功')
      })
    } catch {
      reject('插入消息异常')
    }
  })
}
exports.getAddMessBtId = () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `select * from adduser`
      query(sql, (err, results) => {
        if (err) reject('查询添加消息失败')
        if (!results) {
          reject('查询添加消息失败')
        } else {
          resolve(results, '查询添加消息成功')
        }
      })
    } catch {
      reject('查询添加消息异常')
    }
  })
}
