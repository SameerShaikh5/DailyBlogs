const express = require('express')
const router = express.Router()
const postModel = require('../models/postModel')
const upload = require('../utils/multerUpload')
const isAuthenticated = require('../middleware/isAuthenticated')
const isAdmin = require('../middleware/isAdmin')
const commentModel = require('../models/commentModel')
const {allPosts, post, likePost, comment, getCreatePost, createPost, getEditPost, editPost, deletePost} = require('../controller/postController')


router.get('/', allPosts)

router.get('/post/:id', post)

router.get('/post/like/:postid',isAuthenticated, likePost)

router.post('/post/comment/:postid',isAuthenticated, comment)

router.get('/create', isAuthenticated, isAdmin, getCreatePost)

router.post('/create', isAuthenticated, isAdmin, upload.single('image'), createPost)

router.get('/edit/:id',isAuthenticated, isAdmin, getEditPost)

router.post('/edit/:id',isAuthenticated, isAdmin, upload.single('image'), editPost)

router.post('/delete/:id', isAuthenticated, isAdmin, deletePost);

module.exports = router