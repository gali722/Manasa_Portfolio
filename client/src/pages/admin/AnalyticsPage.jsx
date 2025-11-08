import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30'); // days
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', dateRange, startDate, endDate],
    queryFn: () => {
      const params = {};
      if (dateRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        params.days = dateRange;
      }
      return analyticsService.getAnalytics(params);
    },
  });

  const handleExport = async () => {
    try {
      const params = {};
      if (dateRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        params.days = dateRange;
      }
      const blob = await analyticsService.exportAnalytics(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getTotalPageViews = () => {
    if (!analytics?.data) return 0;
    return analytics.data.reduce((sum, day) => sum + (day.pageViews || 0), 0);
  };

  const getTotalUniqueVisitors = () => {
    if (!analytics?.data) return 0;
    return analytics.data.reduce((sum, day) => sum + (day.uniqueVisitors || 0), 0);
  };

  const getTotalResumeDownloads = () => {
    if (!analytics?.data) return 0;
    return analytics.data.reduce((sum, day) => sum + (day.resumeDownloads || 0), 0);
  };

  const getTotalContactSubmissions = () => {
    if (!analytics?.data) return 0;
    return analytics.data.reduce((sum, day) => sum + (day.contactFormSubmissions || 0), 0);
  };

  const getPopularSections = () => {
    if (!analytics?.data || analytics.data.length === 0) return [];
    
    const sectionTotals = {};
    analytics.data.forEach(day => {
      if (day.sections) {
        Object.entries(day.sections).forEach(([section, count]) => {
          sectionTotals[section] = (sectionTotals[section] || 0) + count;
        });
      }
    });

    return Object.entries(sectionTotals)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const popularSections = getPopularSections();

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Data
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === 'custom' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Page Views */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Page Views
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {getTotalPageViews().toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unique Visitors
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {getTotalUniqueVisitors().toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Resume Downloads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resume Downloads
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {getTotalResumeDownloads().toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contact Submissions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Contact Submissions
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {getTotalContactSubmissions().toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Page Views Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Views Over Time
        </h2>
        {analytics?.data && analytics.data.length > 0 ? (
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.data.map((day, index) => {
              const maxViews = Math.max(...analytics.data.map(d => d.pageViews || 0));
              const height = maxViews > 0 ? ((day.pageViews || 0) / maxViews) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-600 dark:bg-blue-500 rounded-t hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors relative group"
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.pageViews || 0} views
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {formatDate(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No data available for the selected period
          </p>
        )}
      </div>

      {/* Popular Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Popular Sections
        </h2>
        {popularSections.length > 0 ? (
          <div className="space-y-4">
            {popularSections.map((section, index) => {
              const maxViews = popularSections[0]?.views || 1;
              const percentage = (section.views / maxViews) * 100;
              
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {section.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {section.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No section data available
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
