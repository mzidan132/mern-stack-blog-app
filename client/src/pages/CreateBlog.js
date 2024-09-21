import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      try {
        const imageUploadResponse = await axios.post(
          "https://api.imgbb.com/1/upload?key=3535a83869f4d9396d9c5cf9450b0033",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrl = imageUploadResponse.data.data.url;

        const { data } = await axios.post(
          "https://mern-projects-fo6a.onrender.com/api/v1/blog/create-blog",
          {
            title: inputs.title,
            description: inputs.description,
            user: id,
            image: imageUrl,
          }
        );

        if (data?.success) {
          toast.success("Blog Created");
          navigate("/my-blogs");
          setImage(null);
          setInputs({
            title: "",
            description: "",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Please upload an image");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "50%" }, // Responsive width
            border: 3,
            borderRadius: 10,
            padding: { xs: 2, md: 3 }, // Adjust padding based on screen size
            margin: "auto",
            boxShadow: "10px 10px 20px #ccc",
            display: "flex",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <Typography
            variant="h4" // Smaller font for mobile
            textAlign={"center"}
            fontWeight="bold"
            padding={3}
            color="gray"
          >
            Create A Post
          </Typography>

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "20px", fontWeight: "bold" }} // Adjust font size for mobile
          >
            Title
          </InputLabel>
          <TextField
            name="title"
            value={inputs.title}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "20px", fontWeight: "bold" }} // Adjust font size for mobile
          >
            Description
          </InputLabel>
          <TextField
            name="description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />

          <InputLabel
            sx={{ mb: 1, mt: 2, fontSize: "20px", fontWeight: "bold" }} // Adjust font size for mobile
          >
            Upload Image
          </InputLabel>
          <img
            className="image"
            src={image ? URL.createObjectURL(image) : "default_placeholder_image_url_here"}
            alt="Here"
            style={{ width: "100px", height: "100px", marginBottom: "1px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <Button type="submit" color="primary" variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreateBlog;
