const query = require('../db/index')
const JWT = require('../utils/JWT')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
window = dom.window
document = window.document
XMLHttpRequest = window.XMLHttpRequest
const { insertAvatar, changeReadState, getAddUser } = require('./Content.js')
const { getUserById } = require('./Socket')
const UserController = {
  login: (req, res) => {
    const { username, password } = req.body
    const sql = `select * from user where username=?`
    query(sql, username, (err, results) => {
      if (err) {
        return res.send({ data: 'error' })
      } else {
        if (results.length !== 1)
          return res.send({ code: 400, data: '账号或者密码错误' })
        if (results[0].password === password) {
          const token = JWT.generate(
            {
              results: results[0]
            },
            '24h'
          )
          res.send({ code: 200, data: '登录成功!', token })
        } else {
          res.send({ code: 400, data: '账号或者密码错误' })
        }
      }
    })
  },
  getUserInfo: (req, res) => {
    const sql = `select * from user where id=?`
    query(sql, req.auth.results.id, (err, results) => {
      if (err) {
        return res.send({ data: 'error' })
      } else {
        if (results.length !== 1) {
          return res.send({ data: '获取用户信息失败' })
        }
        res.send({
          code: 200,
          data: '获取用户信息成功',
          userinfo: results[0]
        })
      }
    })
  },
  getUserList: (req, res) => {
    const resData = []
    const sql = `select * from user where username=?`
    query(sql, req.auth.results.username, async (err, results) => {
      if (err) {
        return res.send({ data: 'error' })
      } else {
        for (let i in results[0].chatuser) {
          let res = await getAddUser(results[0].chatuser[i])
          resData.push(res[0])
        }
        res.send({
          code: 200,
          data: '获取用户信息成功',
          results: resData
        })
      }
    })
  },
  upload: async (req, res) => {
    const sql = `update user set username = ?,gender=?,avatar=?,dynamic=? where id =?`
    const avatar = `/avataruploads/${req.file?.filename}`
    const { username, introduction, gender } = req.body
    var token = req.headers['authorization'].split(' ')[1]
    var payload = JWT.verify(token)
    query(
      sql,
      [username, gender, avatar, introduction, payload.results.id],
      (err, results) => {
        if (err) {
          return res.send({ data: 'error' })
        } else {
          if (!results) {
            return res.send({ data: '更改用户信息失败' })
          }
          res.send({
            code: 200
          })
        }
      }
    )
    await insertAvatar(avatar, payload.results.id)
  },
  uploadVideo: (req, res) => {
    const video = `/videos/${req.file?.filename}`
    res.send({ video })
  },
  uploadImg: (req, res) => {
    const img = `/imgs/${req.file?.filename}`
    res.send({ img })
  },
  changeState: (req, res) => {
    const sql = `update user set state = 1 where id = ?`
    query(sql, req.auth.results.id, (err, results) => {
      if (err) {
        return res.send({ data: 'error' })
      } else {
        if (results.length !== 1) {
          return res.send({ data: '登录用户信息失败' })
        }
        res.send({
          code: 200,
          data: '登录用户信息成功'
        })
      }
    })
  },
  changeRead: async (req, res) => {
    let data = await changeReadState(req.query.id, req.auth.results.id)
    res.send({
      code: 200,
      data
    })
  },
  searchUser: (req, res) => {
    var name = '%' + req.query.id + '%'
    const sql = `select * from user where baseid like ?`
    query(sql, name, (err, results) => {
      if (err) {
        return res.send({ data: 'error' })
      }
      if (results.length !== 0) {
        res.send({
          code: 200,
          data: '获取用户信息成功',
          results
        })
      } else {
        res.send({
          code: 400,
          data: '当前用户不存在'
        })
      }
    })
  },
  stateOut: (req, res) => {
    const sql = `update user set state=0 where id=?`
    query(sql, req.auth.results.id, (err) => {
      if (err) {
        return res.send({ data: 'error' })
      }
    })
  },
  addUser: (req, res) => {
    const sql = `update user set chatuser = JSON_ARRAY_INSERT(chatuser,'$[0]',?) WHERE id = ?;`
    query(sql, [Number(req.body.id), req.auth.results.id], (err) => {
      if (err) {
        return res.send({ data: 'error', err })
      }
    })
    query(sql, [req.auth.results.id, Number(req.body.id)], (err) => {
      if (err) {
        return res.send({ data: 'error', err })
      } else {
        res.send({ code: 200, data: '添加成功' })
      }
    })
  },
  registUser: (req, res) => {
    const { username, password } = req.body
    const sql = `insert into user (username,password,chatuser,state,gender) values (?,?,?,?,?)`
    query(sql, [username, password, '[]', 0, 0], (err, results) => {
      if (err) {
        return res.send({ data: 'error', err })
      } else {
        if (results) {
          const sql0 = `select max(id) as id from user`
          query(sql0, (err, results) => {
            if (err) {
              return res.send({ data: 'error', err })
            } else {
              const sql = `update user set baseid=?,chatuser = JSON_ARRAY_INSERT(chatuser,'$[0]',?) order by id desc limit 1 `
              query(sql, [window.btoa(results[0].id), results[0].id], (err) => {
                if (err) {
                  return res.send({ data: 'error', err })
                } else {
                  return res.send({ code: 200, data: '注册成功' })
                }
              })
            }
          })
        } else {
          res.send({ code: 400, data: '注册失败' })
        }
      }
    })
  },
  deleteAdd: (req, res) => {
    const sql = `delete from adduser where sendid=? and recipetid=?`
    query(
      sql,
      [Number(req.query.id), Number(req.query.sendid)],
      (err, results) => {
        if (err) {
          return res.send({ data: err })
        }
      }
    )
    query(
      sql,
      [Number(req.query.sendid), Number(req.query.id)],
      (err, results) => {
        if (err) {
          return res.send({ data: err })
        }
        if (results.length !== 0) {
          res.send({
            code: 200,
            data: '请求成功',
            results
          })
        } else {
          res.send({
            code: 400,
            data: '请求失败'
          })
        }
      }
    )
  },
  deleteUserInfo: async (req, res) => {
    const sql = `update user set chatuser = JSON_REMOVE(chatuser,'$[?]') where id = ? `
    console.log(req.auth.results.chatuser)
    console.log(req.auth.results.chatuser.indexOf(Number(req.body.id)))
    query(
      sql,
      [
        req.auth.results.chatuser.indexOf(Number(req.body.id)),
        req.auth.results.id
      ],
      (err, results) => {
        if (err) {
          return res.send({ data: err })
        }
      }
    )
    let deletid = await getUserById(req.body.id)
    query(
      sql,
      [deletid.chatuser.indexOf(Number(req.auth.results.id)), req.body.id],
      (err, results) => {
        if (err) {
          return res.send({ data: err })
        }
        console.log(results)
        if (results.length !== 0) {
          res.send({
            code: 200,
            data: '删除成功'
          })
        } else {
          res.send({
            code: 400,
            data: err
          })
        }
      }
    )
  }
}

module.exports = UserController
