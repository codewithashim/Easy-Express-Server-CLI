import express from 'express';
import upload from "../shared/middleware/multer/multer.js";
import {
    createTestimonial,
    getTestimonials,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '../controllers/testimonialController.js';

const router = express.Router();

router.post('/', upload.single('image'), createTestimonial);
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;