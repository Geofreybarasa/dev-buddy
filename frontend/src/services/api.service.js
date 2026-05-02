import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Explain code
 */
export const explainCode = async (code, language = null) => {
  try {
    const response = await apiClient.post('/explain', {
      code,
      language
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate tests
 */
export const generateTests = async (code, language = null, framework = null) => {
  try {
    const response = await apiClient.post('/generate-tests', {
      code,
      language,
      framework
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate documentation
 */
export const generateDocs = async (code, language = null, format = null) => {
  try {
    const response = await apiClient.post('/generate-docs', {
      code,
      language,
      format
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get analytics
 */
export const getAnalytics = async (period = 'all', teamSize = 10) => {
  try {
    const response = await apiClient.get('/analytics', {
      params: { period, teamSize }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Handle API errors
 */
function handleApiError(error) {
  if (error.response) {
    // Server responded with error
    const errorData = error.response.data;
    return {
      message: errorData.error?.message || 'An error occurred',
      code: errorData.error?.code || 'UNKNOWN_ERROR',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Unable to connect to server. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'CLIENT_ERROR',
      status: 0
    };
  }
}

export default {
  explainCode,
  generateTests,
  generateDocs,
  getAnalytics,
  healthCheck
};

// Made with Bob
