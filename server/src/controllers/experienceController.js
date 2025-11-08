import Experience from '../models/Experience.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get all experience (public endpoint)
 */
export const getPublicExperience = async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ startDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: experience,
      count: experience.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all experience (admin endpoint)
 */
export const getAdminExperience = async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ startDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: experience,
      count: experience.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single experience
 */
export const getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experience not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new experience
 */
export const createExperience = async (req, res, next) => {
  try {
    const {
      company,
      position,
      location,
      startDate,
      endDate,
      isCurrent,
      description,
      responsibilities,
      achievements,
      technologies,
      order,
    } = req.body;

    // Validate required fields
    if (!company || !position || !startDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Company, position, and start date are required',
        },
      });
    }

    const experience = new Experience({
      company,
      position,
      location,
      startDate,
      endDate,
      isCurrent,
      description,
      responsibilities,
      achievements,
      technologies,
      order,
    });

    await experience.save();

    res.status(201).json({
      success: true,
      data: experience,
      message: 'Experience created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update experience
 */
export const updateExperience = async (req, res, next) => {
  try {
    const {
      company,
      position,
      location,
      startDate,
      endDate,
      isCurrent,
      description,
      responsibilities,
      achievements,
      technologies,
      order,
    } = req.body;

    const experience = await Experience.findByIdOrFail(req.params.id);

    // Update fields
    if (company !== undefined) experience.company = company;
    if (position !== undefined) experience.position = position;
    if (location !== undefined) experience.location = location;
    if (startDate !== undefined) experience.startDate = startDate;
    if (endDate !== undefined) experience.endDate = endDate;
    if (isCurrent !== undefined) experience.isCurrent = isCurrent;
    if (description !== undefined) experience.description = description;
    if (responsibilities !== undefined) experience.responsibilities = responsibilities;
    if (achievements !== undefined) experience.achievements = achievements;
    if (technologies !== undefined) experience.technologies = technologies;
    if (order !== undefined) experience.order = order;

    await experience.save();

    res.status(200).json({
      success: true,
      data: experience,
      message: 'Experience updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experience not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete experience
 */
export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdOrFail(req.params.id);

    // Delete company logo if exists
    if (experience.companyLogo?.url) {
      try {
        await deleteFile(experience.companyLogo.url);
      } catch (error) {
        console.error('Error deleting company logo:', error);
      }
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experience not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Upload company logo
 */
export const uploadCompanyLogo = async (req, res, next) => {
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

    const experience = await Experience.findByIdOrFail(req.params.id);

    // Delete old logo if exists
    if (experience.companyLogo?.url) {
      try {
        await deleteFile(experience.companyLogo.url);
      } catch (error) {
        console.error('Error deleting old company logo:', error);
      }
    }

    // Update with new logo
    experience.companyLogo = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
    };

    await experience.save();

    res.status(200).json({
      success: true,
      data: {
        companyLogo: experience.companyLogo,
      },
      message: 'Company logo uploaded successfully',
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
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experience not found',
        },
      });
    }
    next(error);
  }
};
