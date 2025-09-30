/* eslint-disable no-console */
import { showAlert } from '@/utils/global';
import log from '@/utils/logger';
import { mmkvStorage } from '@/utils/mmkvStorage';
import { secureStorage } from '@/utils/secureStorage';
import axios, {
  AxiosError,
  AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';

type MutationMethod = {
  endpoint: string;
  data?: any;
  isAccountCenterApi?: boolean;
  config?: AxiosRequestConfig;
};

type QueryMethod = Omit<MutationMethod, 'data'>;

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
const createApiClient = (isAccountCenterApi = false): AxiosInstance => {
  const client = axios.create({
    baseURL: isAccountCenterApi
      ? process.env.EXPO_PUBLIC_API_ACCOUNT_CENTER_URL
      : process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const accessToken = await secureStorage.getItem('accessToken');
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
        console.warn(error);
        // const errorMessage =
        //   (error.response.data as any)?.message[0].message ||
        //   (error.response.data as any)?.message ||
        //   'Unauthorized access - please log in again.';
        // throw new ApiException(errorMessage, error.response.status);
        await mmkvStorage.removeItem('accessToken');
        router.replace('/(screens)/(authScreen)/LoginScreen');
      } else if (
        error.response?.status === 400 ||
        error.response?.status === 403 ||
        error.response?.status === 404 ||
        error.response?.status === 422
      ) {
        const errorMessage =
          (error.response.data as any)?.message[0].message ||
          (error.response.data as any)?.message ||
          `Error ${error.response.status}`;
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
const apiClient = createApiClient(false);
const apiAccountCenterClient = createApiClient(true);

// HTTP methods wrapper
export const http = {
  get: async <T>({
    endpoint,
    isAccountCenterApi = false,
    config,
  }: QueryMethod): Promise<T | null> => {
    try {
      const response = await (isAccountCenterApi ? apiAccountCenterClient : apiClient).get<T>(
        endpoint,
        config,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiException) {
        showAlert('Error', error.message);
      }
      throw error;
    }
  },

  post: async <T>({
    endpoint,
    data,
    isAccountCenterApi = false,
    config,
  }: MutationMethod): Promise<T | null> => {
    try {
      const api = isAccountCenterApi ? apiAccountCenterClient : apiClient;
      log(`POST Request to ${api.defaults.baseURL}${endpoint} with data:`, data);
      const response = await api.post<T>(endpoint, data, config);

      return response.data;
    } catch (error) {
      if (error instanceof ApiException) {
        showAlert('Error', error.message);
      }
      throw error;
    }
  },

  patch: async <T>({
    endpoint,
    data,
    isAccountCenterApi = false,
    config,
  }: MutationMethod): Promise<T | null> => {
    try {
      const response = await (isAccountCenterApi ? apiAccountCenterClient : apiClient).patch<T>(
        endpoint,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiException) {
        showAlert('Error', error.message);
      }
      throw error;
    }
  },

  delete: async <T>({
    endpoint,
    data,
    isAccountCenterApi = false,
    config,
  }: MutationMethod): Promise<T | null> => {
    try {
      const response = await (isAccountCenterApi ? apiAccountCenterClient : apiClient).delete<T>(
        endpoint,
        {
          ...config,
          data, // For DELETE requests with body
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiException) {
        showAlert('Error', error.message);
      }
      throw error;
    }
  },
};

// Export the axios instance for direct use if needed
export { apiClient };

// Upload files method (for multipart/form-data)
// export const uploadFile = async <T>(
//   endpoint: string,
//   formData: FormData,
//   onUploadProgress?: (progressEvent: any) => void,
// ): Promise<T | null> => {
//   try {
//     const response = await apiClient.post<T>(endpoint, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('File upload failed:', error);
//     throw error;
//   }
// };

export default apiClient;
