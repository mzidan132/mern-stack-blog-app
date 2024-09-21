import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const BlogDetails = () => {
  const [blog, setBlog] = useState({});
  const [inputs, setInputs] = useState({});
  const [image, setImage] = useState(null);
  const id = useParams().id;
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch blog details
  const getBlogDetail = async () => {
    try {
      const { data } = await axios.get(`https://mern-projects-fo6a.onrender.com/api/v1/blog/get-blog/${id}`);
      if (data?.success) {
        setBlog(data?.blog);
        setInputs({
          title: data?.blog.title,
          description: data?.blog.description,
          image: data?.blog.image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = inputs.image; // Default to existing image URL

    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      try {
        const imageUploadResponse = await axios.post(
          "https://api.imgbb.com/1/upload?key=3535a83869f4d9396d9c5cf9450b0033",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = imageUploadResponse.data.data.url;
      } catch (error) {
        console.log(error);
        toast.error("Failed to upload image");
        return;
      }
    }

    try {
      const { data } = await axios.put(`https://mern-projects-fo6a.onrender.com/api/v1/blog/update-blog/${id}`, {
        title: inputs.title,
        description: inputs.description,
        image: imageUrl,
        user: id,
      });
      if (data?.success) {
        toast.success('Blog Updated');
        navigate('/my-blogs');
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={isMobile ? "90%" : "50%"} // Adjust width for mobile
          border={3}
          borderRadius={10}
          padding={3}
          margin="auto"
          boxShadow={"10px 10px 20px #ccc"}
          display="flex"
          flexDirection={"column"}
          marginTop="30px"
        >
          <Typography
            variant="h2"
            textAlign={"center"}
            fontWeight="bold"
            padding={3}
            color="gray"
            fontSize={isMobile ? "24px" : "32px"} // Adjust font size for mobile
          >
            Update A Post
          </Typography>
          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: isMobile ? "18px" : "24px", fontWeight: "bold" }} // Adjust font size for labels
          >
            Title
          </InputLabel>
          <TextField
            name="title"
            value={inputs.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            required
          />
          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: isMobile ? "18px" : "24px", fontWeight: "bold" }} // Adjust font size for labels
          >
            Description
          </InputLabel>
          <TextField
            name="description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            required
          />
          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: isMobile ? "18px" : "24px", fontWeight: "bold" }} // Adjust font size for labels
          >
            Upload New Image
          </InputLabel>
          <img
            className="image"
            src={image ? URL.createObjectURL(image) : inputs.image}
            alt="Preview"
            style={{ width: "100px", height: "100px", marginBottom: "1px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button
            type="submit"
            color="warning"
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            UPDATE
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default BlogDetails;
