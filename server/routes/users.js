var express = require('express')
const UserController = require('../controllers/UserController')
var UserRouter = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'public/avataruploads/' })
const video = multer({ dest: 'public/videos/' })
const img = multer({ dest: 'public/imgs/' })

/* GET home page. */
UserRouter.post('/login', UserController.login)

UserRouter.post('/adduser', UserController.addUser)

UserRouter.post('/registuser', UserController.registUser)

UserRouter.post('/changeinfo', upload.single('file'), UserController.upload)

UserRouter.post('/deleteuserinfo', UserController.deleteUserInfo)

UserRouter.post(
  '/uploadvideo',
  video.single('file'),
  UserController.uploadVideo
)

UserRouter.post('/uploadimg', img.single('file'), UserController.uploadImg)

UserRouter.get('/userinfo', UserController.getUserInfo)
// 获取用户列表
UserRouter.get('/userlist', UserController.getUserList)

UserRouter.get('/changestate', UserController.changeState)

UserRouter.get('/changeread', UserController.changeRead)

UserRouter.get('/searchuser', UserController.searchUser)

UserRouter.get('/stateout', UserController.stateOut)

UserRouter.get('/deleteadd', UserController.deleteAdd)

module.exports = UserRouter
