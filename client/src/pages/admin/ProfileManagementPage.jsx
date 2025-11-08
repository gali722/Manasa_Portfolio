import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';

const ProfileManagementPage = () => {
  const queryClient = useQueryClient();
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    yearsOfExperience: 0,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      medium: '',
      stackoverflow: '',
    },
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: profileService.getAdminProfile,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProfile']);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrors({ submit: error.response?.data?.message || 'Failed to update profile' });
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: profileService.uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProfile']);
      setSelectedPhoto(null);
      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrors({ photo: error.response?.data?.message || 'Failed to upload photo' });
    },
  });

  // Upload resume mutation
  const uploadResumeMutation = useMutation({
    mutationFn: profileService.uploadResume,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProfile']);
      setSelectedResume(null);
      setSuccessMessage('Resume uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error) => {
      setErrors({ resume: error.response?.data?.message || 'Failed to upload resume' });
    },
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        summary: profile.summary || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          twitter: profile.socialLinks?.twitter || '',
          medium: profile.socialLinks?.medium || '',
          stackoverflow: profile.socialLinks?.stackoverflow || '',
        },
      });
      if (profile.profilePhoto?.url) {
        setPhotoPreview(profile.profilePhoto.url);
      }
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ photo: 'Please select an image file' });
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: 'Image size must be less than 5MB' });
        return;
      }

      setSelectedPhoto(file);
      setErrors({ photo: '' });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setErrors({ resume: 'Please select a PDF or DOCX file' });
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ resume: 'Resume size must be less than 10MB' });
        return;
      }

      setSelectedResume(file);
      setErrors({ resume: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const handlePhotoUpload = () => {
    if (selectedPhoto) {
      uploadPhotoMutation.mutate(selectedPhoto);
    }
  };

  const handleResumeUpload = () => {
    if (selectedResume) {
      uploadResumeMutation.mutate(selectedResume);
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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Profile Management
      </h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Profile Photo
        </h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
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
            {selectedPhoto && (
              <button
                type="button"
                onClick={handlePhotoUpload}
                disabled={uploadPhotoMutation.isPending}
                className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload Photo'}
              </button>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              JPG, PNG or WebP. Max size 5MB.
            </p>
            {errors.photo && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.photo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Resume
        </h2>
        <div className="flex items-center space-x-4">
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Choose Resume
          </button>
          {selectedResume && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedResume.name}
              </span>
              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={uploadResumeMutation.isPending}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {uploadResumeMutation.isPending ? 'Uploading...' : 'Upload Resume'}
              </button>
            </>
          )}
          {profile?.resume?.filename && !selectedResume && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current: {profile.resume.filename}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          PDF or DOCX. Max size 10MB.
        </p>
        {errors.resume && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.resume}</p>
        )}
      </div>

      {/* Profile Information Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Professional Title *
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Professional Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Write a brief professional summary..."
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Social Links
          </h2>

          <div className="space-y-4">
            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialLinkChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.socialLinks.github}
                onChange={handleSocialLinkChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialLinkChange}
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medium
              </label>
              <input
                type="url"
                name="medium"
                value={formData.socialLinks.medium}
                onChange={handleSocialLinkChange}
                placeholder="https://medium.com/@username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Stack Overflow */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stack Overflow
              </label>
              <input
                type="url"
                name="stackoverflow"
                value={formData.socialLinks.stackoverflow}
                onChange={handleSocialLinkChange}
                placeholder="https://stackoverflow.com/users/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {updateProfileMutation.isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagementPage;
