import request from '@/utils/request/api'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getuserinfo() {
  return request({
    url: '/userinfo',
    method: 'get'
  })
}

export function getuserlist() {
  return request({
    url: '/userlist',
    method: 'get'
  })
}

export function changeinfo(data) {
  return request({
    url: '/changeinfo',
    method: 'post',
    data,
    ContentType: 'multipart/form-data'
  })
}

export function uploadVideo(data) {
  return request({
    url: '/uploadvideo',
    method: 'post',
    data,
    ContentType: 'multipart/form-data'
  })
}

export function uploadImg(data) {
  return request({
    url: '/uploadimg',
    method: 'post',
    data,
    ContentType: 'multipart/form-data'
  })
}
export function changState() {
  return request({
    url: '/changestate',
    method: 'get'
  })
}

export function changeRead(id) {
  return request({
    url: '/changeread',
    method: 'get',
    params: {
      id
    }
  })
}

export function searchUser(id) {
  return request({
    url: '/searchuser',
    method: 'get',
    params: {
      id
    }
  })
}
export function stateOut() {
  return request({
    url: '/stateout',
    method: 'get'
  })
}
export function addUser(data) {
  return request({
    url: '/adduser',
    method: 'post',
    data
  })
}
export function registUser(data) {
  return request({
    url: '/registuser',
    method: 'post',
    data
  })
}

export function deleteAdd(sendid, id) {
  return request({
    url: '/deleteadd',
    method: 'get',
    params: {
      sendid,
      id
    }
  })
}
export function deleteUserInfo(data) {
  return request({
    url: '/deleteuserinfo',
    method: 'post',
    data
  })
}
