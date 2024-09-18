import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    paragraph: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;