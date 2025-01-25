const express = require('express')
const router = express.Router()
const {getRegister, postRegister, getLogin, postLogin, logout} = require('../controller/userController')

router.get('/register', getRegister)

router.post('/register', postRegister)  

router.get('/login', getLogin)

router.post('/login', postLogin)

router.get('/logout', logout);



module.exports = router
