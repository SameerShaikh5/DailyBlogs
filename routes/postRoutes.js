const express = require('express')
const router = express.Router()
const upload = require('../utils/multerUpload')
const isAdmin = require('../middleware/isAdmin')
const {allPosts, post, likePost, comment, getCreatePost, createPost, getEditPost, editPost, deletePost} = require('../controller/postController')


router.get('/', allPosts)

router.get('/post/:id', post)

router.get('/post/like/:postid', likePost)

router.post('/post/comment/:postid', comment)

router.get('/create', isAdmin, getCreatePost)

router.post('/create',  isAdmin, upload.single('image'), createPost)

router.get('/edit/:id', isAdmin, getEditPost)

router.post('/edit/:id', isAdmin, upload.single('image'), editPost)

router.post('/delete/:id',  isAdmin, deletePost);

module.exports = router