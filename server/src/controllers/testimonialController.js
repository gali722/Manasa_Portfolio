import Testimonial from '../models/Testimonial.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get all testimonials (public endpoint)
 */
export const getPublicTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all testimonials (admin endpoint)
 */
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single testimonial
 */
export const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TESTIMONIAL_NOT_FOUND',
          message: 'Testimonial not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new testimonial
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const {
      authorName,
      authorTitle,
      authorCompany,
      content,
      linkedinUrl,
      relationship,
      order,
      isVisible,
    } = req.body;

    // Validate required fields
    if (!authorName || !authorTitle || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Author name, title, and content are required',
        },
      });
    }

    const testimonial = new Testimonial({
      authorName,
      authorTitle,
      authorCompany,
      content,
      linkedinUrl,
      relationship,
      order,
      isVisible,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const {
      authorName,
      authorTitle,
      authorCompany,
      content,
      linkedinUrl,
      relationship,
      order,
      isVisible,
    } = req.body;

    const testimonial = await Testimonial.findByIdOrFail(req.params.id);

    // Update fields
    if (authorName !== undefined) testimonial.authorName = authorName;
    if (authorTitle !== undefined) testimonial.authorTitle = authorTitle;
    if (authorCompany !== undefined) testimonial.authorCompany = authorCompany;
    if (content !== undefined) testimonial.content = content;
    if (linkedinUrl !== undefined) testimonial.linkedinUrl = linkedinUrl;
    if (relationship !== undefined) testimonial.relationship = relationship;
    if (order !== undefined) testimonial.order = order;
    if (isVisible !== undefined) testimonial.isVisible = isVisible;

    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TESTIMONIAL_NOT_FOUND',
          message: 'Testimonial not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdOrFail(req.params.id);

    // Delete author photo if exists
    if (testimonial.authorPhoto?.url) {
      try {
        await deleteFile(testimonial.authorPhoto.url);
      } catch (error) {
        console.error('Error deleting author photo:', error);
      }
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TESTIMONIAL_NOT_FOUND',
          message: 'Testimonial not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Upload author photo
 */
export const uploadAuthorPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded',
        },
      });
    }

    const testimonial = await Testimonial.findByIdOrFail(req.params.id);

    // Delete old photo if exists
    if (testimonial.authorPhoto?.url) {
      try {
        await deleteFile(testimonial.authorPhoto.url);
      } catch (error) {
        console.error('Error deleting old author photo:', error);
      }
    }

    // Update with new photo
    testimonial.authorPhoto = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
    };

    await testimonial.save();

    res.status(200).json({
      success: true,
      data: {
        authorPhoto: testimonial.authorPhoto,
      },
      message: 'Author photo uploaded successfully',
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        await deleteFile(`/uploads/${req.file.filename}`);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TESTIMONIAL_NOT_FOUND',
          message: 'Testimonial not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Reorder testimonials
 */
export const reorderTestimonials = async (req, res, next) => {
  try {
    const { testimonials } = req.body;

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Testimonials must be an array',
        },
      });
    }

    // Update order for each testimonial
    const updatePromises = testimonials.map((item, index) => {
      return Testimonial.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true, runValidators: true }
      );
    });

    await Promise.all(updatePromises);

    const updatedTestimonials = await Testimonial.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: updatedTestimonials,
      message: 'Testimonials reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
