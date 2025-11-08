import Skill from '../models/Skill.js';

/**
 * Get all skills (public endpoint)
 */
export const getPublicSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ isVisible: true })
      .select('-__v')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: skills,
      count: skills.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all skills (admin endpoint)
 */
export const getAdminSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find()
      .select('-__v')
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: skills,
      count: skills.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single skill
 */
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdOrFail(req.params.id);

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Create new skill
 */
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, icon, order, isVisible } = req.body;

    // Validate required fields
    if (!name || !category || proficiency === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, category, and proficiency are required',
        },
      });
    }

    const skill = new Skill({
      name,
      category,
      proficiency,
      icon,
      order,
      isVisible,
    });

    await skill.save();

    res.status(201).json({
      success: true,
      data: skill,
      message: 'Skill created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update skill
 */
export const updateSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, icon, order, isVisible } = req.body;

    const skill = await Skill.findByIdOrFail(req.params.id);

    // Update fields
    if (name !== undefined) skill.name = name;
    if (category !== undefined) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = proficiency;
    if (icon !== undefined) skill.icon = icon;
    if (order !== undefined) skill.order = order;
    if (isVisible !== undefined) skill.isVisible = isVisible;

    await skill.save();

    res.status(200).json({
      success: true,
      data: skill,
      message: 'Skill updated successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Delete skill
 */
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdOrFail(req.params.id);
    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found',
        },
      });
    }
    next(error);
  }
};

/**
 * Reorder skills
 */
export const reorderSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Skills must be an array',
        },
      });
    }

    // Update order for each skill
    const updatePromises = skills.map((item, index) => {
      return Skill.findByIdAndUpdate(
        item.id,
        { order: index },
        { new: true, runValidators: true }
      );
    });

    await Promise.all(updatePromises);

    const updatedSkills = await Skill.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: updatedSkills,
      message: 'Skills reordered successfully',
    });
  } catch (error) {
    next(error);
  }
};
