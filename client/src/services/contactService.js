import axios from '../lib/axios';

export const contactService = {
  submitContactForm: async (formData) => {
    const response = await axios.post('/public/contact', formData);
    return response.data;
  },
};
