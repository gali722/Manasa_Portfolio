import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationService } from '../../services/educationService';
import { certificationsService } from '../../services/certificationsService';

const EducationManagementPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('education'); // 'education' or 'certifications'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const logoInputRef = useRef(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    coursework: [],
    achievements: [],
  });

  const [certificationForm, setCertificationForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    verificationUrl: '',
  });

  const [courseworkInput, setCourseworkInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch education
  const { data: education = [], isLoading: educationLoading } = useQuery({
    queryKey: ['adminEducation'],
    queryFn: educationService.getAdminEducation,
  });

  // Fetch certifications
  const { data: certifications = [], isLoading: certificationsLoading } = useQuery({
    queryKey: ['adminCertifications'],
    queryFn: certificationsService.getAdminCertifications,
  });

  // Education mutations
  const createEducationMutation = useMutation({
    mutationFn: educationService.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEducation']);
      closeModal();
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }) => educationService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEducation']);
      closeModal();
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: educationService.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEducation']);
      setDeleteConfirm(null);
    },
  });

  // Certification mutations
  const createCertificationMutation = useMutation({
    mutationFn: certificationsService.createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      closeModal();
    },
  });

  const updateCertificationMutation = useMutation({
    mutationFn: ({ id, data }) => certificationsService.updateCertification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      closeModal();
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: certificationsService.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCertifications']);
      setDeleteConfirm(null);
    },
  });

  const openModal = (item = null, type = activeTab) => {
    if (item) {
      setEditingItem({ ...item, type });
      if (type === 'education') {
        setEducationForm({
          institution: item.institution,
          degree: item.degree,
          field: item.field,
          location: item.location || '',
          startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
          endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
          gpa: item.gpa || '',
          coursework: item.coursework || [],
          achievements: item.achievements || [],
        });
        if (item.institutionLogo?.url) {
          setLogoPreview(item.institutionLogo.url);
        }
      } else {
        setCertificationForm({
          name: item.name,
          issuer: item.issuer,
          issueDate: item.issueDate ? new Date(item.issueDate).toISOString().split('T')[0] : '',
          expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
          credentialId: item.credentialId || '',
          verificationUrl: item.verificationUrl || '',
        });
        if (item.badge?.url) {
          setLogoPreview(item.badge.url);
        }
      }
    } else {
      setEditingItem(null);
      setEducationForm({
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        coursework: [],
        achievements: [],
      });
      setCertificationForm({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        verificationUrl: '',
      });
      setLogoPreview(null);
    }
    setSelectedLogo(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setSelectedLogo(null);
    setLogoPreview(null);
    setCourseworkInput('');
    setAchievementInput('');
    setErrors({});
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCertificationForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ logo: 'Please select an image file' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ logo: 'Image size must be less than 5MB' });
        return;
      }

      setSelectedLogo(file);
      setErrors({ logo: '' });

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCoursework = () => {
    if (courseworkInput.trim() && !educationForm.coursework.includes(courseworkInput.trim())) {
      setEducationForm((prev) => ({
        ...prev,
        coursework: [...prev.coursework, courseworkInput.trim()],
      }));
      setCourseworkInput('');
    }
  };

  const removeCoursework = (index) => {
    setEducationForm((prev) => ({
      ...prev,
      coursework: prev.coursework.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !educationForm.achievements.includes(achievementInput.trim())) {
      setEducationForm((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index) => {
    setEducationForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const validateEducationForm = () => {
    const newErrors = {};
    if (!educationForm.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    if (!educationForm.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }
    if (!educationForm.field.trim()) {
      newErrors.field = 'Field of study is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCertificationForm = () => {
    const newErrors = {};
    if (!certificationForm.name.trim()) {
      newErrors.name = 'Certification name is required';
    }
    if (!certificationForm.issuer.trim()) {
      newErrors.issuer = 'Issuer is required';
    }
    if (!certificationForm.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'education') {
      if (!validateEducationForm()) return;
      if (editingItem) {
        updateEducationMutation.mutate({ id: editingItem._id, data: educationForm });
      } else {
        createEducationMutation.mutate(educationForm);
      }
    } else {
      if (!validateCertificationForm()) return;
      if (editingItem) {
        updateCertificationMutation.mutate({ id: editingItem._id, data: certificationForm });
      } else {
        createCertificationMutation.mutate(certificationForm);
      }
    }
  };

  const handleDelete = (item, type) => {
    setDeleteConfirm({ ...item, type });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      if (deleteConfirm.type === 'education') {
        deleteEducationMutation.mutate(deleteConfirm._id);
      } else {
        deleteCertificationMutation.mutate(deleteConfirm._id);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const isLoading = educationLoading || certificationsLoading;

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
          Education & Certifications
        </h1>
        <button
          onClick={() => openModal(null, activeTab)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {activeTab === 'education' ? 'Education' : 'Certification'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('education')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'education'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Education ({education.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'certifications'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Certifications ({certifications.length})
          </button>
        </nav>
      </div>

      {/* Education Tab Content */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          {education.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No education entries found. Add your first education entry to get started.
              </p>
            </div>
          ) : (
            education.map((edu) => (
              <div
                key={edu._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Institution Logo */}
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {edu.institutionLogo?.url ? (
                        <img
                          src={edu.institutionLogo.url}
                          alt={edu.institution}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                    </div>

                    {/* Education Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
                        {edu.institution}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 space-x-4">
                        {edu.startDate && (
                          <span>
                            {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                          </span>
                        )}
                        {edu.location && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {edu.location}
                          </span>
                        )}
                        {edu.gpa && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>

                      {edu.coursework && edu.coursework.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Relevant Coursework:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.coursework.map((course, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Achievements:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {edu.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => openModal(edu, 'education')}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(edu, 'education')}
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
      )}

      {/* Certifications Tab Content */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No certifications found. Add your first certification to get started.
              </p>
            </div>
          ) : (
            certifications.map((cert) => (
              <div
                key={cert._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Badge */}
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    {cert.badge?.url ? (
                      <img
                        src={cert.badge.url}
                        alt={cert.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                  </div>

                  {/* Certification Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {cert.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {cert.issuer}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Issued: {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                      >
                        Verify Credential
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openModal(cert, 'certifications')}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert, 'certifications')}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem
                  ? `Edit ${activeTab === 'education' ? 'Education' : 'Certification'}`
                  : `Add New ${activeTab === 'education' ? 'Education' : 'Certification'}`}
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
              {/* Logo/Badge Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {activeTab === 'education' ? 'Institution Logo' : 'Badge'}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Choose Image
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      PNG, JPG or WebP. Max 5MB.
                    </p>
                    {errors.logo && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.logo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Education Form */}
              {activeTab === 'education' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institution *
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={educationForm.institution}
                        onChange={handleEducationChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          errors.institution ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.institution && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.institution}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={educationForm.degree}
                        onChange={handleEducationChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          errors.degree ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Bachelor of Science"
                      />
                      {errors.degree && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.degree}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Field of Study *
                      </label>
                      <input
                        type="text"
                        name="field"
                        value={educationForm.field}
                        onChange={handleEducationChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          errors.field ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Computer Science"
                      />
                      {errors.field && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.field}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={educationForm.location}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={educationForm.startDate}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={educationForm.endDate}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GPA
                      </label>
                      <input
                        type="text"
                        name="gpa"
                        value={educationForm.gpa}
                        onChange={handleEducationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="e.g., 3.8/4.0"
                      />
                    </div>
                  </div>

                  {/* Coursework */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relevant Coursework
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={courseworkInput}
                        onChange={(e) => setCourseworkInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoursework())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="Add course (press Enter)"
                      />
                      <button
                        type="button"
                        onClick={addCoursework}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {educationForm.coursework.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm flex items-center"
                        >
                          {course}
                          <button
                            type="button"
                            onClick={() => removeCoursework(index)}
                            className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Achievements
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={achievementInput}
                        onChange={(e) => setAchievementInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder="Add achievement (press Enter)"
                      />
                      <button
                        type="button"
                        onClick={addAchievement}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {educationForm.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{achievement}</span>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Certification Form */}
              {activeTab === 'certifications' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={certificationForm.name}
                      onChange={handleCertificationChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      value={certificationForm.issuer}
                      onChange={handleCertificationChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        errors.issuer ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.issuer && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.issuer}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        value={certificationForm.issueDate}
                        onChange={handleCertificationChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                          errors.issueDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.issueDate && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.issueDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={certificationForm.expiryDate}
                        onChange={handleCertificationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      name="credentialId"
                      value={certificationForm.credentialId}
                      onChange={handleCertificationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="e.g., ABC123XYZ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification URL
                    </label>
                    <input
                      type="url"
                      name="verificationUrl"
                      value={certificationForm.verificationUrl}
                      onChange={handleCertificationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

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
                  disabled={
                    (activeTab === 'education' && (createEducationMutation.isPending || updateEducationMutation.isPending)) ||
                    (activeTab === 'certifications' && (createCertificationMutation.isPending || updateCertificationMutation.isPending))
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {(createEducationMutation.isPending || updateEducationMutation.isPending ||
                    createCertificationMutation.isPending || updateCertificationMutation.isPending)
                    ? 'Saving...'
                    : editingItem
                    ? `Update ${activeTab === 'education' ? 'Education' : 'Certification'}`
                    : `Add ${activeTab === 'education' ? 'Education' : 'Certification'}`}
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
              Are you sure you want to delete this {deleteConfirm.type === 'education' ? 'education entry' : 'certification'}? This action cannot be undone.
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
                disabled={deleteEducationMutation.isPending || deleteCertificationMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {(deleteEducationMutation.isPending || deleteCertificationMutation.isPending) ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManagementPage;
