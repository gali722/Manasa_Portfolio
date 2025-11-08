import { useState } from 'react';
import { Download, FileText, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { profileService } from '../services/profileService';

const ResumeDownload = ({ variant = 'button', className = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null); // 'success' | 'error' | null

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus(null);

    try {
      // Fetch the resume blob
      const blob = await profileService.downloadResume();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Manasa_Gali_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus('success');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDownloadStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error downloading resume:', error);
      setDownloadStatus('error');

      // Clear error message after 5 seconds
      setTimeout(() => {
        setDownloadStatus(null);
      }, 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className={`bg-surface rounded-lg p-6 shadow-md border border-border ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">Resume</h3>
            <p className="text-sm text-text-secondary">Download my latest resume</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {isDownloading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </>
          )}
        </button>

        {/* Status Messages */}
        {downloadStatus === 'success' && (
          <div className="mt-3 p-3 bg-success/10 border border-success rounded-lg flex items-center text-success text-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            Resume downloaded successfully!
          </div>
        )}

        {downloadStatus === 'error' && (
          <div className="mt-3 p-3 bg-error/10 border border-error rounded-lg flex items-start text-error text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Download failed</p>
              <p className="text-xs mt-1 opacity-80">Please try again or contact me directly.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <div className={className}>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      >
        {isDownloading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </>
        )}
      </button>

      {/* Status Messages for Button Variant */}
      {downloadStatus === 'success' && (
        <div className="mt-2 text-success text-sm flex items-center animate-fade-in">
          <CheckCircle className="w-4 h-4 mr-1" />
          Downloaded successfully!
        </div>
      )}

      {downloadStatus === 'error' && (
        <div className="mt-2 text-error text-sm flex items-center animate-fade-in">
          <AlertCircle className="w-4 h-4 mr-1" />
          Download failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default ResumeDownload;
