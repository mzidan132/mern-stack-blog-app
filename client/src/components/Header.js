import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import useMediaQuery from "@mui/material/useMediaQuery";

const Header = () => {
  // global state
  let isLogin = useSelector((state) => state.isLogin);
  isLogin = isLogin || localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // state
  const [value, setValue] = useState();

  // logout
  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      navigate("/login");
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  // Use media query to detect small screens
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          paddingLeft: isMobile && "0", // Adjust horizontal padding for mobile
          paddingRight: isMobile && "0",

        }}
      >
        <Typography variant="h4">
          <Link to="/">
            <img
              src="/pngegg.png"
              style={{ width: 70, height: 50, cursor: "pointer" }}
              alt="Logo"
            />
          </Link>
        </Typography>
        {isLogin && (
          <Box display="flex" flexGrow={1} justifyContent="center">
            <Tabs
              textColor="inherit"
              value={value}
              onChange={(e, val) => setValue(val)}
              sx={{
                "& .MuiTab-root": {
                  fontSize: isMobile && "12px", // Adjust font size for Tabs
                  color: 'white'
                },
                padding: 0, marginLeft: 0,
              }}
            >
              <Tab label="My Blogs" component={Link} to="/my-blogs" />
              <Tab label="Create Blog" component={Link} to="/create-blog" />
            </Tabs>
          </Box>
        )}
        <Box display="flex" alignItems="center">
          {!isLogin && (
            <>
              <Button sx={{ margin: 1, color: "white" }} component={Link} to="/login">
                Login
              </Button>
              <Button sx={{ margin: 1, color: "white" }} component={Link} to="/register">
                Register
              </Button>
            </>
          )}
          {isLogin && (
            <Button onClick={handleLogout} sx={{ margin: 1, color: "red" }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

