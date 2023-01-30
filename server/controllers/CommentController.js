import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(400).send({
        message: "Post not found",
        data: {},
      });
    } else {
      const newComment = new Comment({
        comment: req.body.comment,
        post: post,
        user: req.userId,
      });
      const comm = await newComment.save();
      await Post.updateOne(
        {
          _id: postId,
        },
        {
          $push: { comments: comm._id },
        }
      );
      return res.status(200).send({
        message: "Comment successfull added",
        data: comm,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пост",
    });
  }
};

export const getComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment._id).populate("user").exec();
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({ $push: { likes: req.userId } });
      res.status(200).json("The comment has been liked");
    } else {
      await comment.updateOne({ $pull: { likes: req.userId } });
      res.status(200).json("The comment has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
