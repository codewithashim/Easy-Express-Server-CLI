import Testimonial from '../models/testimonialModel.js';

// Create
export const createTestimonial = async (req, res) => {
  try {
    const { paragraph } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newTestimonial = await Testimonial.create({ image, paragraph });
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read All
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read One
export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
export const updateTestimonial = async (req, res) => {
  try {
    const { paragraph } = req.body;
    const image = req.file ? req.file.path : undefined;

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (paragraph) testimonial.paragraph = paragraph;
    if (image) testimonial.image = image;

    await testimonial.save();
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};