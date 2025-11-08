import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { profileService } from '../../services/profileService';
import { skillsService } from '../../services/skillsService';
import { projectsService } from '../../services/projectsService';
import { experienceService } from '../../services/experienceService';
import { educationService } from '../../services/educationService';
import { certificationsService } from '../../services/certificationsService';
import { testimonialsService } from '../../services/testimonialsService';

const DashboardPage = () => {
  // Fetch all data for statistics
  const { data: profileData } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: profileService.getAdminProfile,
  });

  const { data: skillsData } = useQuery({
    queryKey: ['adminSkills'],
    queryFn: skillsService.getAdminSkills,
  });

  const { data: projectsData } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: projectsService.getAdminProjects,
  });

  const { data: experienceData } = useQuery({
    queryKey: ['adminExperience'],
    queryFn: experienceService.getAdminExperience,
  });

  const { data: educationData } = useQuery({
    queryKey: ['adminEducation'],
    queryFn: educationService.getAdminEducation,
  });

  const { data: certificationsData } = useQuery({
    queryKey: ['adminCertifications'],
    queryFn: certificationsService.getAdminCertifications,
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: testimonialsService.getAdminTestimonials,
  });

  const stats = [
    {
      name: 'Skills',
      count: skillsData?.data?.length || 0,
      icon: '🎯',
      link: '/admin/skills',
      color: 'bg-blue-500',
    },
    {
      name: 'Projects',
      count: projectsData?.data?.length || 0,
      icon: '💼',
      link: '/admin/projects',
      color: 'bg-green-500',
    },
    {
      name: 'Experience',
      count: experienceData?.data?.length || 0,
      icon: '💻',
      link: '/admin/experience',
      color: 'bg-purple-500',
    },
    {
      name: 'Education',
      count: educationData?.data?.length || 0,
      icon: '🎓',
      link: '/admin/education',
      color: 'bg-yellow-500',
    },
    {
      name: 'Certifications',
      count: certificationsData?.data?.length || 0,
      icon: '📜',
      link: '/admin/education',
      color: 'bg-indigo-500',
    },
    {
      name: 'Testimonials',
      count: testimonialsData?.data?.length || 0,
      icon: '💬',
      link: '/admin/testimonials',
      color: 'bg-pink-500',
    },
  ];

  const quickActions = [
    { name: 'Edit Profile', link: '/admin/profile', icon: '👤', color: 'bg-blue-600' },
    { name: 'Add Skill', link: '/admin/skills', icon: '➕', color: 'bg-green-600' },
    { name: 'Add Project', link: '/admin/projects', icon: '📁', color: 'bg-purple-600' },
    { name: 'View Portfolio', link: '/', icon: '🌐', color: 'bg-gray-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {profileData?.data?.fullName || 'Admin'}!
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.count}
                </p>
              </div>
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className={`${action.color} text-white rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile Summary */}
      {profileData?.data && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {profileData.data.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {profileData.data.title}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {profileData.data.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {profileData.data.yearsOfExperience} years
              </p>
            </div>
          </div>
          <Link
            to="/admin/profile"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            Edit Profile →
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
