import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  writerName: {
    type: String,
    required: true
  },
  writerImage: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  blogImage: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;