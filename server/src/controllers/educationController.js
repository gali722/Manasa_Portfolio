import Education from '../models/Education.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get all education (public endpoint)
 */
export const getPublicEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ endDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: education,
      count: education.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all education (admin endpoint)
 */
export const getAdminEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ endDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: education,
      count: education.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single education
 */
export const getEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new education
 */
export const createEducation = async (req, res, next) => {
  try {
    const {
      institution,
      degree,
      field,
      location,
      startDate,
      endDate,
      gpa,
      coursework,
      achievements,
      order,
    } = req.body;

    // Validate required fields
    if (!institution || !degree || !field) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Institution, degree, and field are required',
        },
      });
    }

    const education = new Education({
      institution,
      degree,
      field,
      location,
      startDate,
      endDate,
      gpa,
      coursework,
      achievements,
      order,
    });

    await education.save();

    res.status(201).json({
      success: true,
      data: education,
      message: 'Education created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update education
 */
export const updateEducation = async (req, res, next) => {
  try {
    const {
      institution,
      degree,
      field,
      location,
      startDate,
      endDate,
      gpa,
      coursework,
      achievements,
      order,
    } = req.body;

    const education = await Education.findByIdOrFail(req.params.id);

    // Update fields
    if (institution !== undefined) education.institution = institution;
    if (degree !== undefined) education.degree = degree;
    if (field !== undefined) education.field = field;
    if (location !== undefined) education.location = location;
    if (startDate !== undefined) education.startDate = startDate;
    if (endDate !== undefined) education.endDate = endDate;
    if (gpa !== undefined) education.gpa = gpa;
    if (coursework !== undefined) education.coursework = coursework;
    if (achievements !== undefined) education.achievements = achievements;
    if (order !== undefined) education.order = order;

    await education.save();

    res.status(200).json({
      success: true,
      data: education,
      message: 'Education updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete education
 */
export const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdOrFail(req.params.id);

    // Delete institution logo if exists
    if (education.institutionLogo?.url) {
      try {
        await deleteFile(education.institutionLogo.url);
      } catch (error) {
        console.error('Error deleting institution logo:', error);
      }
    }

    await education.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Upload institution logo
 */
export const uploadInstitutionLogo = async (req, res, next) => {
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

    const education = await Education.findByIdOrFail(req.params.id);

    // Delete old logo if exists
    if (education.institutionLogo?.url) {
      try {
        await deleteFile(education.institutionLogo.url);
      } catch (error) {
        console.error('Error deleting old institution logo:', error);
      }
    }

    // Update with new logo
    education.institutionLogo = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
    };

    await education.save();

    res.status(200).json({
      success: true,
      data: {
        institutionLogo: education.institutionLogo,
      },
      message: 'Institution logo uploaded successfully',
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
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found',
        },
      });
    }
    next(error);
  }
};
