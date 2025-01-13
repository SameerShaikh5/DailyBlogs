const postModel = require('../models/postModel')
const commentModel = require('../models/commentModel')



const allPosts = async (req,res)=>{
    let posts = await postModel.find().populate('user')
    res.render('allposts', {posts})
}

const post = async (req,res)=>{
    let id = req.params.id
    let post = await postModel.findById(id).populate('user')
    let comments = await commentModel.find({commentedOnPost:id}).sort({createdAt:-1}).populate('user')
    res.render('post', {post, comments})
}

const likePost = async (req,res)=>{
    let id = req.params.postid
    let post = await postModel.findById(id)
    if(!post.likes.includes(req.user._id)){
        post.likes.push(req.user._id)
    }else{
        userIdIndex = post.likes.indexOf(req.user._id)
        post.likes.splice(userIdIndex,1)
    }
    await post.save()
    res.redirect(`/posts/post/${id}`)
}

const comment = async (req,res)=>{
    let postid = req.params.postid
    let comment = req.body.comment
    if(!comment){
        return res.redirect(`/posts/post/${postid}`)
    }
    await commentModel.create({
        user:req.user._id,
        commentedOnPost:postid,
        comment:comment
    })
    res.redirect(`/posts/post/${postid}`)
}

const getCreatePost = async (req,res)=>{
    res.render('create')
}

const createPost = async (req,res)=>{
    let {heading,subheading,content} = req.body
    let image = req.file
    try{
        const filetypes = ['image/jpg', 'image/jpeg'];

        if (!filetypes.includes(image.mimetype)) {
            return res.status(400).send("Only JPG and JPEG formats are allowed!");
        }
        let post = await postModel.create({
            heading,
            subheading,
            content,
            image:image.buffer,
            user:req.user._id,
        })
        res.redirect('/')
    }catch(err){
        console.log(err.message)
    }
}

const getEditPost = async (req,res)=>{
    let id = req.params.id
    if (!id){
        return res.send("Incorrect id!")
    }
    try{
    let post = await postModel.findById(id)
    res.render('edit', {post})
    }
    catch(err){
        console.log(err.message)
    }
}

const editPost = async (req,res)=>{
    let id = req.params.id
    let {heading, subheading, content} = req.body
    let image = req.file
    if (image){
        const filetypes = ['image/jpg', 'image/jpeg'];
        if (!filetypes.includes(image.mimetype)) {
            return res.status(400).send("Only PNG, JPG, and JPEG formats are allowed!");
        }
    }
    try{
        let updatedPost = await postModel.findById(id)
        
        updatedPost.heading = heading
        updatedPost.subheading = subheading
        updatedPost.content = content

        if(image){
            updatedPost.image = image.buffer
        }

        await updatedPost.save()
        return res.redirect(`/posts/post/${id}`)
    }
    catch(err){
        console.log(err)
    }
}

const deletePost = async (req, res) => {
    let id = req.params.id;
    try {
        await postModel.findByIdAndDelete(id);
        await commentModel.deleteMany({ commentedOnPost: id });
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting post or related comments');
    }
}

module.exports = {allPosts, post, likePost, comment, getCreatePost, createPost, getEditPost, editPost, deletePost}