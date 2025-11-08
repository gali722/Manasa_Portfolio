import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { contactService } from '../services/contactService';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'subject':
        if (!value.trim()) {
          return 'Subject is required';
        }
        if (value.trim().length < 3) {
          return 'Subject must be at least 3 characters';
        }
        return '';

      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Clear submit status when user modifies form
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactService.submitContactForm(formData);

      if (response.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setErrors({});

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg p-6 md:p-8 shadow-lg border border-border">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        aria-label="Contact form"
        noValidate
      >
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.name
                ? 'border-error focus:ring-error'
                : 'border-border focus:ring-primary'
            } text-text-primary`}
            placeholder="Your full name"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-error flex items-center" role="alert">
              <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Email <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.email
                ? 'border-error focus:ring-error'
                : 'border-border focus:ring-primary'
            } text-text-primary`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-error flex items-center" role="alert">
              <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Subject <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.subject
                ? 'border-error focus:ring-error'
                : 'border-border focus:ring-primary'
            } text-text-primary`}
            placeholder="What is this regarding?"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-sm text-error flex items-center" role="alert">
              <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Message <span className="text-error">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={6}
            className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
              errors.message
                ? 'border-error focus:ring-error'
                : 'border-border focus:ring-primary'
            } text-text-primary`}
            placeholder="Your message..."
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-error flex items-center" role="alert">
              <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </button>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div 
            className="p-4 bg-success/10 border border-success rounded-lg flex items-start animate-fade-in"
            role="alert"
            aria-live="polite"
          >
            <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-success font-medium">Message sent successfully!</p>
              <p className="text-success/80 text-sm mt-1">
                Thank you for reaching out. I'll get back to you within 24-48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div 
            className="p-4 bg-error/10 border border-error rounded-lg flex items-start animate-fade-in"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-5 h-5 text-error mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-error font-medium">Failed to send message</p>
              <p className="text-error/80 text-sm mt-1">
                Something went wrong. Please try again or contact me directly via email.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
