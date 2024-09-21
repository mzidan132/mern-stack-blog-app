// pages/CommentsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [blogId, setBlogId] = useState('');
  const userId = localStorage.getItem('userId');

  // Fetch blog ID from URL
  const { id } = useParams();

  useEffect(() => {
    setBlogId(id);
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`https://mern-projects-fo6a.onrender.com/api/v1/comment/get-comments/${id}`);
        setComments(data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [id]);

  // Handle input change
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  // Add a new comment
  const handleAddComment = async () => {
    try {
      const { data } = await axios.post('https://mern-projects-fo6a.onrender.com/api/v1/comment/add-comment', {
        text: commentText,
        user: userId,
        blog: blogId,
      });
      if (data.success) {
        setComments((prevComments) => [...prevComments, data.comment]);
        setCommentText('');
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(`https://mern-projects-fo6a.onrender.com/api/v1/comment/delete-comment/${commentId}`);
      if (data.success) {
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        toast.success('Comment deleted successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete comment');
    }
  };
  return (
    <Box mt={4} width="50%" margin="auto" padding={3}>
      <Typography variant="h4">Comments</Typography>
      <Box mt={2}>
        {comments.map((comment) => (
          <Box key={comment._id} sx={{ marginBottom: 2 }}>
            <Typography variant="body2"><strong>{comment.user.username}:</strong> {comment.text}
             {comment.user._id === userId && (
              <IconButton onClick={() => handleDeleteComment(comment._id)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box mt={2}>
        <TextField
          fullWidth
          value={commentText}
          onChange={handleCommentChange}
          label="Add a comment"
          variant="outlined"
        />
        <Button onClick={handleAddComment} variant="contained" color="primary" sx={{ mt: 1 }}>
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsPage;
