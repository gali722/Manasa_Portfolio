import Certification from '../models/Certification.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get all certifications (public endpoint)
 */
export const getPublicCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ issueDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: certifications,
      count: certifications.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all certifications (admin endpoint)
 */
export const getAdminCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ issueDate: -1, order: 1 });

    res.status(200).json({
      success: true,
      data: certifications,
      count: certifications.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single certification
 */
export const getCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: certification,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new certification
 */
export const createCertification = async (req, res, next) => {
  try {
    const {
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      verificationUrl,
      order,
    } = req.body;

    // Validate required fields
    if (!name || !issuer || !issueDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, issuer, and issue date are required',
        },
      });
    }

    const certification = new Certification({
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      verificationUrl,
      order,
    });

    await certification.save();

    res.status(201).json({
      success: true,
      data: certification,
      message: 'Certification created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update certification
 */
export const updateCertification = async (req, res, next) => {
  try {
    const {
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      verificationUrl,
      order,
    } = req.body;

    const certification = await Certification.findByIdOrFail(req.params.id);

    // Update fields
    if (name !== undefined) certification.name = name;
    if (issuer !== undefined) certification.issuer = issuer;
    if (issueDate !== undefined) certification.issueDate = issueDate;
    if (expiryDate !== undefined) certification.expiryDate = expiryDate;
    if (credentialId !== undefined) certification.credentialId = credentialId;
    if (verificationUrl !== undefined) certification.verificationUrl = verificationUrl;
    if (order !== undefined) certification.order = order;

    await certification.save();

    res.status(200).json({
      success: true,
      data: certification,
      message: 'Certification updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete certification
 */
export const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdOrFail(req.params.id);

    // Delete badge if exists
    if (certification.badge?.url) {
      try {
        await deleteFile(certification.badge.url);
      } catch (error) {
        console.error('Error deleting certification badge:', error);
      }
    }

    await certification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Upload certification badge
 */
export const uploadCertificationBadge = async (req, res, next) => {
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

    const certification = await Certification.findByIdOrFail(req.params.id);

    // Delete old badge if exists
    if (certification.badge?.url) {
      try {
        await deleteFile(certification.badge.url);
      } catch (error) {
        console.error('Error deleting old certification badge:', error);
      }
    }

    // Update with new badge
    certification.badge = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
    };

    await certification.save();

    res.status(200).json({
      success: true,
      data: {
        badge: certification.badge,
      },
      message: 'Certification badge uploaded successfully',
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
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found',
        },
      });
    }
    next(error);
  }
};
