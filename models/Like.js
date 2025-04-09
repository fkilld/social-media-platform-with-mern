const Like = require('../models/Like')
const Post = require('../models/Post')

exports.likePost = async (req, res) => {
  const { postId } = req.params
  const userId = req.user.userId

  try {
    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const existingLike = await Like.findOne({ user: userId, post: postId })

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id)
      return res.json({ message: 'Post unliked' })
    } else {
      // Like
      const like = new Like({ user: userId, post: postId })
      await like.save()
      return res.status(201).json({ message: 'Post liked' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error processing like', error: error.message })
  }
}
