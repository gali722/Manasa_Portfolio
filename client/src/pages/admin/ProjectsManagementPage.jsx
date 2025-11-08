import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../../services/projectsService';

const ProjectsManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    technologies: [],
    category: '',
    links: {
      live: '',
      github: '',
      demo: '',
    },
    featured: false,
    status: 'published',
  });

  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch projects
  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: projectsService.getAdminProjects,
  });

  const projects = projectsResponse?.data || [];
  
  // Debug: Log projects to see their structure
  if (projects.length > 0) {
    console.log('First project structure:', projects[0]);
    console.log('First project ID field:', projects[0]._id, projects[0].id);
  }

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: async (response) => {
      try {
        if (selectedImages.length > 0) {
          // API returns { success: true, data: project }
          const projectId = response.data?._id || response.data?.id;
          if (projectId) {
            await uploadImagesMutation.mutateAsync({ id: projectId, files: selectedImages });
          }
        }
        queryClient.invalidateQueries(['adminProjects']);
        closeModal();
      } catch (error) {
        console.error('Error uploading images:', error);
        // Still close modal and refresh - project was created
        queryClient.invalidateQueries(['adminProjects']);
        closeModal();
        alert('Project created but image upload failed. Please edit the project to add images.');
      }
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error?.details?.[0]?.message || 'Failed to create project';
      alert(`Error: ${errorMessage}`);
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectsService.updateProject(id, data),
    onSuccess: async (response, variables) => {
      if (selectedImages.length > 0) {
        // Use the ID from variables (the input) instead of response
        await uploadImagesMutation.mutateAsync({ id: variables.id, files: selectedImages });
      }
      queryClient.invalidateQueries(['adminProjects']);
      closeModal();
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProjects']);
      setDeleteConfirm(null);
    },
  });

  // Upload images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: ({ id, files }) => projectsService.uploadProjectImages(id, files),
  });

  const openModal = (project = null) => {
    if (project) {
      console.log('Opening modal with project:', project);
      console.log('Project ID:', project._id);
      setEditingProject(project);
      setFormData({
        title: project.title,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        technologies: project.technologies || [],
        category: project.category || '',
        links: {
          live: project.links?.live || '',
          github: project.links?.github || '',
          demo: project.links?.demo || '',
        },
        featured: project.featured || false,
        status: project.status || 'published',
      });
      if (project.images && project.images.length > 0) {
        setImagePreviews(project.images.map(img => img.url));
      }
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        technologies: [],
        category: '',
        links: {
          live: '',
          github: '',
          demo: '',
        },
        featured: false,
        status: 'published',
      });
      setImagePreviews([]);
    }
    setSelectedImages([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setTechInput('');
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);
      
      // Create previews
      const previews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previews).then(setImagePreviews);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleTechKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingProject) {
      console.log('Submitting update for project:', editingProject);
      console.log('Project _id:', editingProject._id);
      console.log('Project id:', editingProject.id);
      console.log('Form data:', formData);
      // Use _id or id, whichever exists
      const projectId = editingProject._id || editingProject.id;
      console.log('Using project ID:', projectId);
      updateMutation.mutate({ id: projectId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (project) => {
    setDeleteConfirm(project);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const projectId = deleteConfirm._id || deleteConfirm.id;
      deleteMutation.mutate(projectId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Projects Management
        </h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No projects found. Add your first project to get started.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={
                      project.images[0].url.startsWith('http')
                        ? project.images[0].url
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.images[0].url}`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                {project.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {project.shortDescription}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openModal(project)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief one-line description"
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.shortDescription}</p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.fullDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Detailed project description, problem statement, solution, and outcomes..."
                />
                {errors.fullDescription && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.fullDescription}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="e.g., Data Analysis, Web Development"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={handleTechKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Add technology (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="live"
                    value={formData.links.live}
                    onChange={handleLinkChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.links.github}
                    onChange={handleLinkChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    name="demo"
                    value={formData.links.demo}
                    onChange={handleLinkChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status and Featured */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Featured Project
                  </span>
                </label>

                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Status:</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingProject
                    ? 'Update Project'
                    : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the project &quot;{deleteConfirm.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagementPage;
