import express from 'express';
import upload from '../shared/middleware/multer/multer.js';
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

const router = express.Router();

const blogUpload = upload.fields([
  { name: 'writerImage', maxCount: 1 },
  { name: 'blogImage', maxCount: 1 }
]);

router.post('/', blogUpload, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.put('/:id', blogUpload, updateBlog);
router.delete('/:id', deleteBlog);

export default router;