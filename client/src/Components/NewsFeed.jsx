import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/posts";

import Stack from "@mui/material/Stack";
import SubmitPost from "../Components/SubmitPost";
import PostCard from "../Components/PostCard";

export default function NewsFeed() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const { posts } = useSelector((state) => state.posts);
  const isLoading = posts.status === "loading";

  //console.log(posts);
  const onAddPost = (description) => {
    posts.items = [description, posts.items];
    //setItems(newList);
  };

  return (
    <Stack spacing={2}>
      <SubmitPost onAddPost={onAddPost} />
      {isLoading ? (
        <span>loading</span>
      ) : (
        posts.items.map((obj, id) => <PostCard key={id} obj={obj} />)
      )}
    </Stack>
  );
}
