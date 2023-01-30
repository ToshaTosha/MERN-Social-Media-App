import { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../redux/slices/posts";
import axios from "../axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

export default function SubmitPost() {
  const userData = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageURL(data.url);
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageURL("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const fields = {
        text,
        imageURL,
      };
      dispatch(addPosts(fields));
      setText("");
      setImageURL("");
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  return (
    <Paper sx={{ padding: "10px", zIndex: 10 }}>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt="user-avatar"
            src={
              userData?.avatarUrl
                ? userData?.avatarUrl
                : "https://3myhouse.com/upload/image/store/0.png"
            }
            sx={{ width: 42, height: 42 }}
          />
          <TextField
            label="Что у вас нового?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="standard"
            maxRows={10}
            multiline
            fullWidth
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={0}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                ref={inputFileRef}
                onChange={handleChangeFile}
                hidden
                accept="image/*"
                type="file"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                class="bi bi-image"
                viewBox="0 0 16 16"
              >
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
              </svg>
            </IconButton>
          </Stack>
          <Button onClick={onSubmit} size="large" variant="contained">
            Опубликовать
          </Button>
        </Stack>
        {imageURL && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Удалить
            </Button>
            <img src={`http://localhost:4444${imageURL}`} alt="Uploaded" />
          </>
        )}
      </Stack>
    </Paper>
  );
}
