import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { IsAuth } from "../redux/slices/auth";

import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Outlet } from "react-router-dom";
import UserCardMini from "../Components/UserCardMini";
import Search from "../Components/Search";

const drawerWidth = 240;

export default function MainPage(props) {
  const { window } = props;
  const isAuth = useSelector(IsAuth);
  const userData = useSelector((state) => state.auth.data);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        fill="#1976d2"
        class="bi bi-twitter"
        viewBox="0 0 16 16"
        style={{ margin: "16px 10px" }}
      >
        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
      </svg>

      <List>
        {[
          { name: "Главная", link: "/" },
          { name: "Профиль", link: `user/${userData?._id}` },
          { name: "Сообщения", link: "/messenger" },
        ].map((obj, i) => (
          <ListItem key={obj.name} disablePadding>
            <ListItemButton
              key={i}
              sx={categoryId === i ? { color: "rgb(25,118,210)" } : ""}
              onClick={() => setCategoryId(i)}
            >
              <Link to={obj.link}>
                <ListItemText primary={obj.name} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  if (!isAuth) {
    return <Navigate to="/login" />;
  } else {
    return (
      <Box sx={{ flexGrow: 1, padding: "10px 40px", display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#fff",
          }}
        >
          <Toolbar sx={{ backgroundColor: "#fff" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="black"
                class="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: "black",
                position: "absolute",
                right: 0,
                paddingRight: "20px",
                display: "flex",
              }}
            >
              <Search />
              <UserCardMini />
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1, padding: "10px 40px" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    );
  }
}

MainPage.propTypes = {
  window: PropTypes.func,
};

/*
import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import MenuList from "../Components/MenuList";
import Stack from "@mui/material/Stack";
import UserCardMini from "../Components/UserCardMini";
import { Box } from "@mui/material";

export default function MainPage() {
  return (
    <Box sx={{ flexGrow: 1, padding: "10px 40px" }}>
      <Grid container spacing={3}>
        <Grid xs={2}>
          <Stack spacing={2}>
            <UserCardMini />
            <MenuList />
          </Stack>
        </Grid>
        <Grid xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}
*/
