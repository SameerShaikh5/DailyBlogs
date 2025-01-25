const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const cloudinaryUpload = require('../utils/cloudinaryUpload');


const allPosts = async (req, res) => {
  let posts = await postModel.find().sort({ createdAt: -1 }).populate("user");
  let message = req.flash('message')
  res.render("allposts", { posts, message });
};

const post = async (req, res) => {
  let id = req.params.id;
  let message = req.flash('message')
  let post = await postModel.findById(id).populate("user");
  let comments = await commentModel
    .find({ commentedOnPost: id })
    .sort({ createdAt: -1 })
    .populate("user");
  res.render("post", { post, comments, message });
};

const likePost = async (req, res) => {
  try {
    let id = req.params.postid;
    let post = await postModel.findById(id);
    if (!req.user) {
      req.flash('message', {text:"You need to login first!!", type:'danger'})
      return res.redirect(`/posts/post/${id}`);
    }

    if (!post) {
      return res.status(404).send("Post not found!");
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
    } else {
      userIdIndex = post.likes.indexOf(req.user._id);
      post.likes.splice(userIdIndex, 1);
    }
    await post.save();
    return res.redirect(`/posts/post/${id}`);
  } catch (err) {
    console.log(
      "An Error occurred while processing the request!!",
      err.message
    )
    res.send("Something went wrong!!")
  }
};

const comment = async (req, res) => {
  try {
    let postid = req.params.postid;
    let comment = req.body.comment;
    let post = await postModel.findById(postid);

    if (!req.user) {
      req.flash('message', {text:"You need to login first!!", type:'danger'})
        return res.redirect(`/posts/post/${postid}`)
    }
    if (!post) {
        return res.status(404).send("Post not found!");
    }

    if (!comment) {
      return res.redirect(`/posts/post/${postid}`);
    }
    await commentModel.create({
      user: req.user._id,
      commentedOnPost: postid,
      comment: comment,
    });
    return res.redirect(`/posts/post/${postid}`);
  } catch (err) {
    console.log("Something went wrong while posting comment!!", err.message);
    res.send("Something went wrong!!")
  }
};

const getCreatePost = async (req, res) => {
    let message = req.flash('message')
    return res.render("create", {message});
};

const createPost = async (req, res) => {
  let { heading, subheading, content } = req.body;
  let image = req.file;
  try {
    const filetypes = ["image/jpg", "image/jpeg"];
    
    if (!filetypes.includes(image.mimetype)) {
      req.flash('message', {text:'Only JPG and JPEG formats are allowed!', type:'info'})
      return res.redirect('/posts/create')
    }
    
    let uploadedImageUrl = await cloudinaryUpload(image.buffer)
    

    let post = await postModel.create({
      heading,
      subheading,
      content,
      image: uploadedImageUrl,
      user: req.user._id,
    });
    req.flash('message', {text:'Post Created!!', type:'success'})
    res.redirect("/");
  } catch (err) {
    if(err.message.includes('File size too large')){
      req.flash('message', {type:'danger', text:'File size too large!!'})
      res.redirect('back')
    }
    else{
      res.send("Something went wrong!!")
    }
    console.log(err.message);
  }
};

const getEditPost = async (req, res) => {
  let id = req.params.id;
  let message = req.flash('message')
  if (!id) {
    return res.send("Incorrect id!");
  }

  try {
    let post = await postModel.findById(id);
    res.render("edit", { post, message });
  } 
  catch (err) {
    console.log(err.message);
    res.send("Something went wrong!!")
  }
};

const editPost = async (req, res) => {
  let id = req.params.id;
  let { heading, subheading, content } = req.body;
  let image = req.file;
  if (image) {
    const filetypes = ["image/jpg", "image/jpeg"];
    if (!filetypes.includes(image.mimetype)) {
      req.flash('message', {text:"Only PNG, JPG, and JPEG formats are allowed!", type:'info'})
      return res.redirect(`/posts/edit/${id}`)
    }
  }
  try {
    let updatedPost = await postModel.findById(id);

    updatedPost.heading = heading;
    updatedPost.subheading = subheading;
    updatedPost.content = content;

    if (image) {
      let uploadedImageUrl = await cloudinaryUpload(image.buffer)
      updatedPost.image = uploadedImageUrl;
    }

    await updatedPost.save();
    req.flash('message', {text:'Post Edited!!', type:'success'})
    return res.redirect(`/posts/post/${id}`);
  } 
  catch (err) {
    if(err.message.includes("File size too large")){
      req.flash('message', {text:"File size too large.", type:'danger'})
      return res.redirect(`/posts/edit/${id}`)
    }
    else{
      res.send("Something went wrong!!")
    }
    console.log(err);
  }
};

const deletePost = async (req, res) => {
  let id = req.params.id;
  try {
    await postModel.findByIdAndDelete(id);
    await commentModel.deleteMany({ commentedOnPost: id });
    req.flash('message', {text:"Post deleted!!", type:'success'})
    res.redirect("/posts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post or related comments");
  }
};

module.exports = {
  allPosts,
  post,
  likePost,
  comment,
  getCreatePost,
  createPost,
  getEditPost,
  editPost,
  deletePost,
};
