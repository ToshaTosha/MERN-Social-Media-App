import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/post/feed");
  return data;
});

export const addPosts = createAsyncThunk("posts/addPosts", async (fields) => {
  const { data } = await axios.post("/post", fields);
  return data;
});

export const fetchDeletePost = createAsyncThunk(
  "posts/fetchDeletePost",
  async (id) => {
    await axios.delete(`/post/${id}`);
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    [addPosts.pending]: (state) => {
      //state.posts.items = [];
      state.posts.status = "loading";
    },
    [addPosts.fulfilled]: (state, action) => {
      //state.posts.items.push(action.payload);
      //console.log(action.payload);
      //
      state.posts.items.push(action.payload);
      state.posts.status = "loaded";
    },
    [addPosts.rejected]: (state) => {
      //state.posts.items = [];
      state.posts.status = "error";
    },

    [fetchDeletePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
    [fetchDeletePost.rejected]: (state, action) => {
      //state.posts.items = [];
      state.posts.status = "error";
      console.log(action.error);
    },
  },
});

export const postsReducer = postsSlice.reducer;
