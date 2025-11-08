import Analytics from '../models/Analytics.js';

/**
 * Get analytics data for a date range
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, days = 30 } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last N days
      end = new Date();
      end.setHours(23, 59, 59, 999);
      start = new Date();
      start.setDate(start.getDate() - parseInt(days));
      start.setHours(0, 0, 0, 0);
    }

    const analytics = await Analytics.find({
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Calculate totals
    const totals = analytics.reduce(
      (acc, day) => {
        acc.pageViews += day.pageViews;
        acc.uniqueVisitors += day.uniqueVisitors;
        acc.resumeDownloads += day.resumeDownloads;
        acc.contactFormSubmissions += day.contactFormSubmissions;

        // Sum section views
        Object.keys(day.sections.toObject()).forEach((section) => {
          acc.sections[section] = (acc.sections[section] || 0) + day.sections[section];
        });

        return acc;
      },
      {
        pageViews: 0,
        uniqueVisitors: 0,
        resumeDownloads: 0,
        contactFormSubmissions: 0,
        sections: {},
      }
    );

    res.status(200).json({
      success: true,
      data: {
        analytics,
        totals,
        dateRange: {
          start,
          end,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    // Get today's analytics
    const today = await Analytics.getTodayAnalytics();

    // Get last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const last7Days = await Analytics.find({
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Get last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const last30Days = await Analytics.find({
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    // Calculate totals for 7 days
    const totals7Days = last7Days.reduce(
      (acc, day) => {
        acc.pageViews += day.pageViews;
        acc.uniqueVisitors += day.uniqueVisitors;
        acc.resumeDownloads += day.resumeDownloads;
        acc.contactFormSubmissions += day.contactFormSubmissions;
        return acc;
      },
      { pageViews: 0, uniqueVisitors: 0, resumeDownloads: 0, contactFormSubmissions: 0 }
    );

    // Calculate totals for 30 days
    const totals30Days = last30Days.reduce(
      (acc, day) => {
        acc.pageViews += day.pageViews;
        acc.uniqueVisitors += day.uniqueVisitors;
        acc.resumeDownloads += day.resumeDownloads;
        acc.contactFormSubmissions += day.contactFormSubmissions;
        return acc;
      },
      { pageViews: 0, uniqueVisitors: 0, resumeDownloads: 0, contactFormSubmissions: 0 }
    );

    // Get popular sections from last 30 days
    const popularSections = last30Days.reduce((acc, day) => {
      Object.keys(day.sections.toObject()).forEach((section) => {
        acc[section] = (acc[section] || 0) + day.sections[section];
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        today,
        last7Days: {
          data: last7Days,
          totals: totals7Days,
        },
        last30Days: {
          data: last30Days,
          totals: totals30Days,
        },
        popularSections,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export analytics data
 */
export const exportAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, days = 30 } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      end.setHours(23, 59, 59, 999);
      start = new Date();
      start.setDate(start.getDate() - parseInt(days));
      start.setHours(0, 0, 0, 0);
    }

    const analytics = await Analytics.find({
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Convert to CSV format
    const csvHeader = [
      'Date',
      'Page Views',
      'Unique Visitors',
      'About Views',
      'Skills Views',
      'Projects Views',
      'Experience Views',
      'Education Views',
      'Testimonials Views',
      'Contact Views',
      'Resume Downloads',
      'Contact Form Submissions',
    ].join(',');

    const csvRows = analytics.map((day) => {
      return [
        day.date.toISOString().split('T')[0],
        day.pageViews,
        day.uniqueVisitors,
        day.sections.about,
        day.sections.skills,
        day.sections.projects,
        day.sections.experience,
        day.sections.education,
        day.sections.testimonials,
        day.sections.contact,
        day.resumeDownloads,
        day.contactFormSubmissions,
      ].join(',');
    });

    const csv = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * Track page view (public endpoint)
 */
export const trackPageView = async (req, res) => {
  try {
    const { section } = req.body;

    // Track page view
    await Analytics.incrementCounter('pageViews');

    // Track section view if provided
    if (section && ['about', 'skills', 'projects', 'experience', 'education', 'testimonials', 'contact'].includes(section)) {
      await Analytics.incrementCounter('sections', section);
    }

    res.status(200).json({
      success: true,
      message: 'Page view tracked',
    });
  } catch (error) {
    // Don't fail the request if tracking fails
    console.error('Error tracking page view:', error);
    res.status(200).json({
      success: true,
      message: 'Page view tracking attempted',
    });
  }
};
