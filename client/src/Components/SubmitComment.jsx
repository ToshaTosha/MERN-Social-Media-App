import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../redux/slices/posts";
import axios from "../axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

export default function SubmitComment({ data, onClickSort }) {
  const [comment, setText] = useState("");
  let postId = data._id;

  const onSubmit = async () => {
    try {
      const fields = {
        comment,
      };
      const { data } = await axios.post(`/comment/${postId}`, fields);
      onClickSort((prevTasks) => [data.data, ...prevTasks]);
      setText("");
    } catch (err) {
      console.warn(err);
      alert("Ошибка при загрузке файла");
    }
  };

  return (
    <Stack spacing={2} sx={{ width: "100%", padding: "10px" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          alt="user-avatar"
          src="https://www.vladtime.ru/uploads/posts/2018-03/1522438548_evropeyskaya-koshka-dikiy-kot.jpg"
          sx={{ width: 42, height: 42 }}
        />
        <TextField
          label="Написать комментарий..."
          value={comment}
          onChange={(e) => setText(e.target.value)}
          variant="standard"
          maxRows={10}
          multiline
          fullWidth
        />
        <Button
          onClick={onSubmit}
          size="small"
          variant="outlined"
          sx={{ padding: "5px 20px" }}
        >
          Опубликовать
        </Button>
      </Stack>
    </Stack>
  );
}
