import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretkey",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretkey",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

/*
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    console.log(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
*/

export const getUser = async (req, res) => {
  const userId = req.userId;
  const username = req.query.username;
  try {
    const user = username
      ? await User.findOne({ _id: username })
      : await User.findById(userId);

    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id).populate("user").exec();
      })
    );
    res.status(200).json({ user: user, posts: list });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const follow = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.userId);
      //console.log("Do");
      //console.log(user);
      if (!user.followers.includes(req.userId)) {
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        User.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $push: { followers: req.userId },
          },
          {
            returnDocument: "after",
          },
          (err, doc) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "Не удалось получить пост",
              });
            }
            if (!doc) {
              return res.status(404).json({
                message: "Статья не найдена",
              });
            }
            res.json(doc);
          }
        );
      } else {
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        User.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $pull: { followers: req.userId },
          },
          {
            returnDocument: "after",
          },
          (err, doc) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "Не удалось получить пост",
              });
            }
            if (!doc) {
              return res.status(404).json({
                message: "Статья не найдена",
              });
            }
            res.json(doc);
          }
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

export const userUpdate = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        status: req.body.text,
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост",
    });
  }
};
