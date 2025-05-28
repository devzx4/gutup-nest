/**
 * Adapted from TZ
 */

import axios, { AxiosInstance } from 'axios';

export abstract class BaseApiClient {
  axiosInstance: AxiosInstance;
  protected constructor(baseUrl: string, customHeaders: Record<string, string> = {}) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    });
  }

  setAccessTokenToHeader(token: string, headerProperty = 'Authorization') {
    this.axiosInstance.interceptors.request.clear();
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers[headerProperty] = token;
      return config;
    });
  }

  clearAccessTokenFromHeader(headerProperty = 'Authorization') {
    this.axiosInstance.interceptors.request.use((config) => {
      delete config.headers[headerProperty];
      return config;
    });
  }
}

export default BaseApiClient;
