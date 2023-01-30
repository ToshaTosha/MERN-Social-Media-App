import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import SubmitPost from "../Components/SubmitPost";
import PostCard from "../Components/PostCard";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { Paper, Avatar, Typography } from "@mui/material";
import avatar from "./avatar.png";

import background from "./fudzi100.jpg";

import axios from "../axios";

export default function UsrePage() {
  const { id } = useParams();
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(false);
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/user?username=${id}`);
      setPosts(res.data.posts);
      setUser(res.data.user);
      setText(res.data.user.status);
      setIsLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleClick = async () => {
    try {
      await axios.put(`/user/${id}`).then((res) => {
        setUser(res.data);
        console.log(res.data);
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const onSubmit = async () => {
    setOpenUpdate((prev) => !prev);
    if (openUpdate) {
      try {
        const fields = {
          text,
        };
        const { data } = await axios.patch(`/user`, fields);
        setText(data.status);
      } catch (err) {
        console.warn(err);
        alert("Ошибка при загрузке файла");
      }
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "absolute",
          width: "100%",
          height: "40%",
          top: 0,
          left: 0,
        }}
      >
        background
      </div>
      <Stack spacing={2}>
        {isLoading ? (
          <span>loading</span>
        ) : (
          <>
            <Paper elevation={3} sx={{ padding: "10px", zIndex: 10 }}>
              <Stack direction="row" spacing={2}>
                <Avatar
                  alt="Avatar"
                  src={user.avatarUrl === "" ? avatar : user.avatarUrl}
                  sx={{ width: 56, height: 56 }}
                />
                <Stack spacing={0}>
                  <Typography variant="h5" color="text.secondary">
                    {user.fullName}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    {openUpdate ? (
                      <TextField
                        label="Что у вас нового?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        variant="standard"
                        maxRows={10}
                        multiline
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {text}
                      </Typography>
                    )}

                    {userData?._id === user._id && (
                      <IconButton aria-label="settings" onClick={onSubmit}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pencil"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                      </IconButton>
                    )}
                  </div>
                </Stack>
                {userData?._id !== user._id && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      onClick={handleClick}
                    >
                      {user.followers.includes(userData?._id)
                        ? "Отписаться"
                        : "Подписаться"}
                    </Button>
                    <Button size="large" variant="contained">
                      Сообщение
                    </Button>
                  </Stack>
                )}
              </Stack>
              <Stack direction="row" spacing={2}>
                Folowers: {user.followers.length}
                followings: {user.followings.length}
              </Stack>
            </Paper>
            {userData?._id === user._id && <SubmitPost />}
            {posts?.map((obj, id) => (
              <PostCard key={id} obj={obj} />
            ))}
          </>
        )}
      </Stack>
    </>
  );
}
