import Project from '../models/Project.js';
import { deleteFile } from '../utils/fileUtils.js';

/**
 * Get all projects (public endpoint with filtering)
 */
export const getPublicProjects = async (req, res, next) => {
  try {
    const { category, technology, search, featured } = req.query;

    // Build query
    const query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (technology) {
      query.technologies = { $in: [technology] };
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .select('-__v') // Exclude version key
      .sort({ order: 1, createdAt: -1 })
      .lean(); // Return plain JavaScript objects for better performance

    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project (public endpoint)
 */
export const getPublicProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: 'published',
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects (admin endpoint)
 */
export const getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project (admin endpoint)
 */
export const getAdminProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new project
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      technologies,
      category,
      links,
      featured,
      status,
      order,
    } = req.body;

    // Validate required fields
    if (!title || !shortDescription) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and short description are required',
        },
      });
    }

    const project = new Project({
      title,
      shortDescription,
      fullDescription,
      technologies,
      category,
      links,
      featured,
      status,
      order,
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 */
export const updateProject = async (req, res, next) => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      technologies,
      category,
      links,
      featured,
      status,
      order,
    } = req.body;

    const project = await Project.findByIdOrFail(req.params.id);

    // Update fields
    if (title !== undefined) project.title = title;
    if (shortDescription !== undefined) project.shortDescription = shortDescription;
    if (fullDescription !== undefined) project.fullDescription = fullDescription;
    if (technologies !== undefined) project.technologies = technologies;
    if (category !== undefined) project.category = category;
    if (links !== undefined) project.links = links;
    if (featured !== undefined) project.featured = featured;
    if (status !== undefined) project.status = status;
    if (order !== undefined) project.order = order;

    await project.save();

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdOrFail(req.params.id);

    // Delete associated images
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        try {
          await deleteFile(image.url);
        } catch (error) {
          console.error('Error deleting project image:', error);
        }
      }
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Upload project images
 */
export const uploadProjectImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No files uploaded',
        },
      });
    }

    const project = await Project.findByIdOrFail(req.params.id);

    // Add new images
    const newImages = req.files.map((file, index) => {
      // Extract the relative path from the full path
      const relativePath = file.path.replace(/\\/g, '/').split('uploads/')[1];
      return {
        url: `/uploads/${relativePath}`,
        caption: '',
        order: (project.images?.length || 0) + index,
      };
    });

    project.images = [...(project.images || []), ...newImages];

    await project.save();

    res.status(200).json({
      success: true,
      data: {
        images: project.images,
      },
      message: 'Images uploaded successfully',
    });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      for (const file of req.files) {
        try {
          await deleteFile(`/uploads/${file.filename}`);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
    }

    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete project image
 */
export const deleteProjectImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Image URL is required',
        },
      });
    }

    const project = await Project.findByIdOrFail(req.params.id);

    // Find and remove the image
    const imageIndex = project.images.findIndex((img) => img.url === imageUrl);

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IMAGE_NOT_FOUND',
          message: 'Image not found in project',
        },
      });
    }

    // Delete the file
    try {
      await deleteFile(imageUrl);
    } catch (error) {
      console.error('Error deleting image file:', error);
    }

    // Remove from array
    project.images.splice(imageIndex, 1);
    await project.save();

    res.status(200).json({
      success: true,
      data: {
        images: project.images,
      },
      message: 'Image deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
    }
    next(error);
  }
};
