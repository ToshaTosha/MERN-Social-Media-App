import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidator, loginValidator } from "./validations.js";

import checkAuth from "./middleware/checkAuth.js";
import {
  follow,
  getMe,
  getUser,
  login,
  register,
  userUpdate,
} from "./controllers/UserController.js";
import {
  create,
  getAll,
  getFeed,
  getMyPosts,
  like,
  remove,
  repost,
  search,
  update,
} from "./controllers/PostController.js";
import {
  createConversation,
  getMessages,
  getMyConversation,
  sendMessage,
} from "./controllers/ChatController.js";
import {
  createComment,
  getComment,
  likeComment,
} from "./controllers/CommentController.js";

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost/social-media-app")
  .then(() => console.log("MongoDB has started..."))
  .catch((e) => console.log("DB err", e));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

app.post("/auth/login", loginValidator, login);
app.post("/auth/register", registerValidator, register);
app.get("/auth/me", checkAuth, getMe);
app.get("/user", checkAuth, getUser);
app.put("/user/:id", checkAuth, follow);
app.patch("/user", checkAuth, userUpdate);

app.get("/post", getAll);
app.get("/post/feed", checkAuth, getFeed);
app.get("/user-post/:id", getMyPosts);
app.post("/post", checkAuth, create);
app.delete("/post/:id", checkAuth, remove);
app.patch("/post/:id", checkAuth, update);
app.put("/post/like/:id", checkAuth, like);
app.post("/post/repost/:id", checkAuth, repost);
app.get("/search", checkAuth, search);

app.post("/conversation", checkAuth, createConversation);
app.get("/conversation", checkAuth, getMyConversation);
app.post("/messages", checkAuth, sendMessage);
app.get("/messages/:id", checkAuth, getMessages);

app.post("/comment/:id", checkAuth, createComment);
app.get("/comment/:id", checkAuth, getComment);
app.put("/comment/like/:id", checkAuth, likeComment);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
