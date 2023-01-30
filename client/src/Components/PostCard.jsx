import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchDeletePost } from "../redux/slices/posts";
import avatar from "./avatar.png";

import axios from "../axios";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import SubmitComment from "./SubmitComment";
import Comment from "./Comment";

export default function PostCard({ obj }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const [data, setData] = useState(obj);
  const [comment, setComment] = useState(obj?.comments);
  const [open, setOpen] = useState(false);
  //console.log(userData);

  useEffect(() => {
    axios
      .get(`/comment/${obj?._id}`)
      .then((res) => {
        setComment(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const handleClickLike = () => {
    axios
      .put(`/post/like/${obj._id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const handleClickRepost = () => {
    axios
      .post(`/post/repost/${obj._id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const onClickRemovie = async () => {
    if (window.confirm("Вы действительно хотите удалить пост?")) {
      dispatch(fetchDeletePost(obj?._id));
    }
  };

  if (obj) {
    return (
      <Card sx={{ maxWidth: "100%", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link to={`/user/${obj.user._id}`}>
            <div style={{ display: "flex" }}>
              <Avatar
                sx={{ bgcolor: "red", margin: "10px" }}
                aria-label="recipe"
                src={obj.user.avatarUrl === "" ? avatar : obj.user.avatarUrl}
              />
              <Stack sx={{ margin: "10px" }}>
                <Typography variant="body2">{obj.user.fullName}</Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  {obj.createdAt}
                </Typography>
              </Stack>
            </div>
          </Link>
          {userData?._id === obj.user._id && (
            <div style={{ display: "flex" }}>
              <IconButton aria-label="settings" onClick={onClickRemovie}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>
              </IconButton>
            </div>
          )}
        </div>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {obj.text}
          </Typography>
        </CardContent>
        {obj.imageUrl && (
          <CardMedia
            component="img"
            height="394"
            image={`http://localhost:4444${obj.imageUrl}`}
            alt="Paella dish"
          />
        )}

        <CardActions
          disableSpacing
          sx={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
              onClick={handleClickLike}
              sx={{ cursor: "pointer" }}
            >
              <IconButton aria-label="add to favorites">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill={
                    data?.likes?.includes(userData?._id)
                      ? "red"
                      : "currentColor"
                  }
                  class="bi bi-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: "18px" }}>
                {data?.likes?.length}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
              onClick={() => setOpen(!open)}
            >
              <IconButton aria-label="add to favorites">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  class="bi bi-chat"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg>
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: "18px" }}>
                {comment.length}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
              onClick={handleClickRepost}
            ></Stack>
          </Stack>
          <Collapse in={open} timeout="auto">
            <SubmitComment data={data} onClickSort={(id) => setComment(id)} />
            {(comment !== "" || comment.length !== 0) &&
              comment?.map((obj, id) => <Comment key={id} obj={obj} />)}
          </Collapse>
        </CardActions>
      </Card>
    );
  } else {
    return <span>поста не существует</span>;
  }
}
