const Post = require('./models/post');

const resolvers = {
  Query: {
    posts: async () => {
      const posts = await Post.find();
      return posts;
    },
    post: async (_parent, { id }) => {
      return await Post.findById(id);
    },
  },
  Mutation: {
    createPost: async (_parent, args) => {
      const newPost = new Post(args);
      return await newPost.save();
    },
    updatePost: async (_parent, { id, title, content }) => {
      const updatedPost = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
      return updatedPost;
    },
    deletePost: async (_parent, { id }) => {
      await Post.findByIdAndDelete(id);
      return 'Post deleted successfully!';
    },
  },
};

module.exports = resolvers;