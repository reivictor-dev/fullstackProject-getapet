const router = require('express').Router()

const UserController = require('../controllers/userController')

//middleware
const verifyToken = require('../helpers/verifyToken')
const { imageUpload } = require('../helpers/imageUpload')

router.post('/register', UserController.register)
//login
router.post('/login', UserController.login)

router.get('/checkuser', UserController.checkUser)

router.get('/:id', UserController.getUserById)

router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser)

module.exports = router