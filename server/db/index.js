const { dbConfig } = require('../config')

const mysql = require('mysql2')

const pool = mysql.createPool(dbConfig)

const query = function (sql, options, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, options, function (qerr, vals, fields) {
        callback(qerr, vals, fields)
      })
      pool.releaseConnection(conn) // 释放连接到连接池
    }
  })
}

module.exports = query
