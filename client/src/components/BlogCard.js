// components/BlogCard.js
import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useTheme } from '@mui/material/styles';

export default function BlogCard({
  title,
  description,
  image,
  username,
  time,
  id,
  isUser,exist,
}) {
  const navigate = useNavigate();
  const theme = useTheme(); 
  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`https://mern-projects-fo6a.onrender.com/api/v1/blog/delete-blog/${id}`);
      if (data?.success) {
        toast.success("Blog Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComments = () => {
    navigate(`/comments/${id}`);
  };

  return (
    <Card
      sx={{
        width: { xs: "90%", sm: "80%", md: "40%" },
        margin: "auto",
        mt: 2,
        padding: 2,
        backgroundColor: 'whitesmoke',
        ':hover': {
          boxShadow: `10px 10px 20px ${theme.palette.mode === 'dark' ? '#777' : '#ccc'}`,
        },
      }}
    >
      {isUser && (
        <Box display={"flex"}>
          <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }}>
            <ModeEditIcon color="info" />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      )}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {username}
          </Avatar>
        }
        title={username}
        subheader={time}
      />
      <CardMedia component="img" height="194" image={image} alt="Paella dish" />
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          Title: {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Description: {description}
        </Typography>
        <Button onClick={handleComments} variant="contained" color="primary" sx={{ mt: 2 }}>
          View Comments {exist&&<div class="spinner-grow spinner-grow-sm" role="status">
  <span class="visually-hidden"></span>
</div>}
        </Button>
      </CardContent>
    </Card>
  );
}
