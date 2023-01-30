import Post from "../models/Post.js";
import User from "../models/User.js";

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить посты",
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userPosts = await Post.find({ user: req.userId });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id).populate("user").exec();
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const search = async (req, res) => {
  /*
  try {
    User.find({ fullName: /user/ }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить посты",
    });
  }*/
  try {
    const { q } = req.query;
    const search = q
      ? {
          $or: [
            { fullName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const data = await User.find(search);
    res.json({ data });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    const doc = new Post({
      text: req.body.text,
      user: user,
      imageUrl: req.body.imageURL,
    });
    const post = await doc.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: doc },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    Post.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить пост",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Пост не найден",
          });
        }

        res.json({
          success: true,
        });
      }
    );
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить пост",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
      { new: true }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пост",
    });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    let duplicate = false;
    post.likes.forEach((item) => {
      if (item == req.userId) {
        duplicate = true;
        console.log(item);
      }
    });

    if (duplicate) {
      Post.findByIdAndUpdate(
        {
          _id: postId,
        },
        {
          $pull: { likes: req.userId },
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
      Post.findByIdAndUpdate(
        {
          _id: postId,
        },
        {
          $push: { likes: req.userId },
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
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пост",
    });
  }
};
