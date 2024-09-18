import Blog from '../models/blogModel.js';

// Create
export const createBlog = async (req, res) => {
  try {
    const { writerName, heading, description } = req.body;
    const writerImage = req.files['writerImage'] ? req.files['writerImage'][0].path : null;
    const blogImage = req.files['blogImage'] ? req.files['blogImage'][0].path : null;


    const newBlog = await Blog.create({
      writerName,
      writerImage,
      heading,
      description,
      blogImage
    });

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read All
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read One
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
export const updateBlog = async (req, res) => {
  try {
    const { writerName, heading, description } = req.body;
    const writerImage = req.files['writerImage'] ? req.files['writerImage'][0].path : undefined;
    const blogImage = req.files['blogImage'] ? req.files['blogImage'][0].path : undefined;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (writerName) blog.writerName = writerName;
    if (heading) blog.heading = heading;
    if (description) blog.description = description;
    if (writerImage) blog.writerImage = writerImage;
    if (blogImage) blog.blogImage = blogImage;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};