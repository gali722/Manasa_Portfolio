import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsService } from '../../services/testimonialsService';

const TestimonialsManagementPage = () => {
  const queryClient = useQueryClient();
  const photoInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const [formData, setFormData] = useState({
    authorName: '',
    authorTitle: '',
    authorCompany: '',
    content: '',
    linkedinUrl: '',
    relationship: '',
    isVisible: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch testimonials
  const { data: testimonialsResponse, isLoading } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: testimonialsService.getAdminTestimonials,
  });

  const testimonials = testimonialsResponse?.data || [];

  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: testimonialsService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      closeModal();
    },
  });

  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialsService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      closeModal();
    },
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: testimonialsService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      setDeleteConfirm(null);
    },
  });

  // Reorder testimonials mutation
  const reorderMutation = useMutation({
    mutationFn: testimonialsService.reorderTestimonials,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
    },
  });

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        authorName: testimonial.authorName,
        authorTitle: testimonial.authorTitle,
        authorCompany: testimonial.authorCompany || '',
        content: testimonial.content,
        linkedinUrl: testimonial.linkedinUrl || '',
        relationship: testimonial.relationship || '',
        isVisible: testimonial.isVisible !== false,
      });
      if (testimonial.authorPhoto?.url) {
        setPhotoPreview(testimonial.authorPhoto.url);
      }
    } else {
      setEditingTestimonial(null);
      setFormData({
        authorName: '',
        authorTitle: '',
        authorCompany: '',
        content: '',
        linkedinUrl: '',
        relationship: '',
        isVisible: true,
      });
      setPhotoPreview(null);
    }
    setSelectedPhoto(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setSelectedPhoto(null);
    setPhotoPreview(null);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ photo: 'Please select an image file' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: 'Image size must be less than 5MB' });
        return;
      }

      setSelectedPhoto(file);
      setErrors({ photo: '' });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }
    if (!formData.authorTitle.trim()) {
      newErrors.authorTitle = 'Author title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Testimonial content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingTestimonial) {
      const testimonialId = editingTestimonial._id || editingTestimonial.id;
      updateMutation.mutate({ id: testimonialId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (testimonial) => {
    setDeleteConfirm(testimonial);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const testimonialId = deleteConfirm._id || deleteConfirm.id;
      deleteMutation.mutate(testimonialId);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newTestimonials = [...testimonials];
    const draggedTestimonial = newTestimonials[draggedItem];
    newTestimonials.splice(draggedItem, 1);
    newTestimonials.splice(index, 0, draggedTestimonial);

    // Update the query data with the proper structure
    queryClient.setQueryData(['adminTestimonials'], (old) => ({
      ...old,
      data: newTestimonials,
    }));
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    if (draggedItem !== null) {
      const testimonialsOrder = testimonials.map((testimonial) => testimonial._id);
      reorderMutation.mutate(testimonialsOrder);
    }
    setDraggedItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Testimonials Management
        </h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Drag and drop testimonials to reorder them. The order will be reflected on your portfolio.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No testimonials found. Add your first testimonial to get started.
            </p>
          </div>
        ) : (
          testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-move ${
                draggedItem === index ? 'opacity-50' : ''
              } ${!testimonial.isVisible ? 'opacity-60' : ''}`}
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                  <span className="text-xs">Drag to reorder</span>
                </div>
                {!testimonial.isVisible && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                    Hidden
                  </span>
                )}
              </div>

              {/* Testimonial Content */}
              <div className="flex items-start space-x-4 mb-4">
                {/* Author Photo */}
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {testimonial.authorPhoto?.url ? (
                    <img
                      src={testimonial.authorPhoto.url}
                      alt={testimonial.authorName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.authorName}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {testimonial.authorTitle}
                    {testimonial.authorCompany && ` at ${testimonial.authorCompany}`}
                  </p>
                  {testimonial.relationship && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {testimonial.relationship}
                    </p>
                  )}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* LinkedIn Link */}
              {testimonial.linkedinUrl && (
                <a
                  href={testimonial.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
                >
                  View on LinkedIn
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openModal(testimonial)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
              {/* Author Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Author" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Choose Photo
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      PNG, JPG or WebP. Max 5MB.
                    </p>
                    {errors.photo && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.photo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.authorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.authorName && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.authorName}</p>
                )}
              </div>

              {/* Author Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author Title *
                </label>
                <input
                  type="text"
                  name="authorTitle"
                  value={formData.authorTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.authorTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Data Analyst"
                />
                {errors.authorTitle && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.authorTitle}</p>
                )}
              </div>

              {/* Author Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="authorCompany"
                  value={formData.authorCompany}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="e.g., Tech Corp"
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="e.g., Manager, Colleague, Client"
                />
              </div>

              {/* Testimonial Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Testimonial Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write the testimonial content here..."
                />
                {errors.content && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.content}</p>
                )}
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              {/* Visibility Toggle */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show this testimonial on the portfolio
                  </span>
                </label>
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
                    : editingTestimonial
                    ? 'Update Testimonial'
                    : 'Add Testimonial'}
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
              Are you sure you want to delete the testimonial from &quot;{deleteConfirm.authorName}&quot;? This action cannot be undone.
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

export default TestimonialsManagementPage;
