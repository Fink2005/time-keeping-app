/* eslint-disable no-console */
import { secureStorage } from '@/utils/secureStorage';
import axios, {
  AxiosError,
  AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

// Custom exception class
export class ApiException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const accessToken = secureStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Error adding auth token:', error);
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      // const originalRequest = error.config;

      if (error.response?.status === 401) {
        // Handle unauthorized - logout user
        try {
          // Try to call logout endpoint
          await client.post(
            '/auth/logout',
            {},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        } catch (logoutError) {
          console.error('Logout request failed:', logoutError);
        } finally {
          // Clear all auth data
          // await storage.multiRemove(['accessTokenTK', 'refreshToken9x9', 'authData']);

          // You might want to dispatch a logout action or navigate to login screen
          // This depends on your navigation/state management setup
          console.log('User logged out due to 401 error');
        }
      } else if (error.response?.status === 400 || error.response?.status === 403) {
        const errorMessage =
          (error.response.data as any)?.message || `Error ${error.response.status}`;
        console.warn(errorMessage, error.response.status);
        throw new ApiException(errorMessage, error.response.status);
      } else {
        const status = error.response?.status || 0;
        console.log(`Request failed with status ${status}`, status);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Create the API client instance
const apiClient = createApiClient();

// HTTP methods wrapper
export const http = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T | null> => {
    try {
      const response = await apiClient.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> => {
    try {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  patch: async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T | null> => {
    try {
      const response = await apiClient.patch<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  },

  delete: async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T | null> => {
    try {
      const response = await apiClient.delete<T>(endpoint, {
        ...config,
        data, // For DELETE requests with body
      });
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },
};

// Export the axios instance for direct use if needed
export { apiClient };

// Upload files method (for multipart/form-data)
export const uploadFile = async <T>(
  endpoint: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void,
): Promise<T | null> => {
  try {
    const response = await apiClient.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export default apiClient;
