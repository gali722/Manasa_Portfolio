import Profile from '../models/Profile.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get profile (public endpoint)
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne().select('-userId');

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get admin profile
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      title,
      summary,
      email,
      phone,
      location,
      socialLinks,
      yearsOfExperience,
    } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create new profile if doesn't exist
      profile = new Profile({
        userId: req.user.id,
        fullName,
        title,
        summary,
        email,
        phone,
        location,
        socialLinks,
        yearsOfExperience,
      });
    } else {
      // Update existing profile
      if (fullName !== undefined) profile.fullName = fullName;
      if (title !== undefined) profile.title = title;
      if (summary !== undefined) profile.summary = summary;
      if (email !== undefined) profile.email = email;
      if (phone !== undefined) profile.phone = phone;
      if (location !== undefined) profile.location = location;
      if (socialLinks !== undefined) profile.socialLinks = socialLinks;
      if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (req, res, next) => {
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

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found. Please create profile first.',
        },
      });
    }

    // Delete old profile photo if exists
    if (profile.profilePhoto?.url) {
      try {
        await deleteFile(profile.profilePhoto.url);
      } catch (error) {
        console.error('Error deleting old profile photo:', error);
      }
    }

    // Update profile with new photo
    profile.profilePhoto = {
      url: `/uploads/${req.file.filename}`,
      publicId: req.file.filename,
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      data: {
        profilePhoto: profile.profilePhoto,
      },
      message: 'Profile photo uploaded successfully',
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
    next(error);
  }
};

/**
 * Upload resume
 */
export const uploadResume = async (req, res, next) => {
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

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found. Please create profile first.',
        },
      });
    }

    // Keep old resume as backup (don't delete immediately)
    const oldResume = profile.resume?.url;

    // Update profile with new resume
    profile.resume = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.originalname,
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      data: {
        resume: profile.resume,
      },
      message: 'Resume uploaded successfully',
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
    next(error);
  }
};
