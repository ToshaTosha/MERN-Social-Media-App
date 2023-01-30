import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk(
  "posts/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);

export const fetchUserRegister = createAsyncThunk(
  "posts/fetchUserRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk("posts/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = "loaded";
    },
  },
  extraReducers: {
    [fetchUserData.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserData.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },

    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },

    [fetchUserRegister.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchUserRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchUserRegister.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const IsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
