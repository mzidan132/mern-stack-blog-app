// controllers/commentController.js
const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const Blog = require('../models/blogModel');

// Add a comment
exports.addCommentController = async (req, res) => {
  try {
    const { text, user, blog } = req.body;

    if (!text || !user || !blog) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required',
      });
    }

    const newComment = new Comment({ text, user, blog });
    await newComment.save();

    // Add comment to the blog
    await Blog.findByIdAndUpdate(blog, { $push: { comments: newComment._id } });

    return res.status(201).send({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error adding comment',
      error,
    });
  }
};

// Get comments for a blog
exports.getCommentsController = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId }).populate('user');

    return res.status(200).send({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error fetching comments',
      error,
    });
  }
};

// Delete a comment
exports.deleteCommentController = async (req, res) => {
  try {
    const { id } = req.params;

    await Comment.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error deleting comment',
      error,
    });
  }
};
