import { useEffect } from "react";
import Box from "@mui/material/Box";
import MainPage from "./Pages/MainPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, IsAuth } from "./redux/slices/auth";
import NewsFeed from "./Components/NewsFeed";
import UserInformation from "./Components/UserInformation";
import Messenger from "./Components/Messenger";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(IsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <Box sx={{ flexGrow: 1, padding: "10px 40px", backgroundColor: "#f4f8fb" }}>
      <Routes>
        <Route path="/*" element={<MainPage />}>
          <Route index element={<NewsFeed />} />
          <Route path="user/:id" element={<UserInformation />} />
          <Route path="messenger" element={<Messenger />} />
        </Route>
        <Route path="/registration" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Box>
  );
}

export default App;
