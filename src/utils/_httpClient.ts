import axios, { AxiosInstance, ResponseType, AxiosRequestConfig, AxiosResponse } from 'axios';

interface HttpClientOptions {
  baseURL: { dev: string; prod: string };
  headers?: { [k: string]: string };
  timeout?: number;
  responseType?: ResponseType;
  onDownloadProgress?: (progressEvent: any) => void;
  onUploadProgress?: (progressEvent: any) => void;
  requestOnError?: (error: any) => any;
  responseOnError?: (error: any) => any;
}

export type HttpClientInterceptors<T> = Array<(o: T) => T | void>;

const compose = <T>(list: ((p: T) => T | void)[]) => (init: T) => list.reduce((pre, cur) => cur(pre) || pre, init);

export default class HttpClient {
  private static readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8;multipart/form-data'
  };

  private static readonly DEFAULT_TIMEOUT = 60000;

  private axios!: AxiosInstance;

  private options!: HttpClientOptions;

  constructor(options: HttpClientOptions) {
    this.options = options;
    this.axios = axios.create({
      baseURL: process.env.NODE_ENV === 'development' ? options.baseURL.dev : options.baseURL.prod,
      headers: options.headers || HttpClient.DEFAULT_HEADERS,
      timeout: options.timeout || HttpClient.DEFAULT_TIMEOUT,
      responseType: options.responseType || 'json',
      withCredentials: false,
      transformRequest: [(data) => (data instanceof FormData ? data : JSON.stringify(data))],
      transformResponse: [
        (data) => {
          if (!data) throw new Error('Unknown Error');
          return data;
        }
      ],
      onDownloadProgress: options.onDownloadProgress || Function,
      onUploadProgress: options.onUploadProgress || Function
    });
  }

  setRequestInterceptors(...list: HttpClientInterceptors<AxiosRequestConfig>) {
    this.axios.interceptors.request.use((config) => compose(list)(config), this.options.requestOnError || Function);
  }

  setResponseInterceptors(...list: HttpClientInterceptors<AxiosResponse>) {
    this.axios.interceptors.response.use((res) => compose(list)(res), this.options.responseOnError || Function);
  }

  /** GET  */
  get<T = any, U = any>(url: string, params?: T): Promise<U> {
    return this.axios.get(url, { params }).then((res) => res.data);
  }

  /** POST */
  post<T = any, U = any>(url: string, data: T): Promise<U> {
    return this.axios.post(url, data).then((res) => res.data);
  }

  /** PUT */
  put<T = any, U = any>(url: string, data: T): Promise<U> {
    return this.axios.put(url, data).then((res) => res.data);
  }

  /** PATCH */
  patch<T = any, U = any>(url: string, data: T): Promise<U> {
    return this.axios.patch(url, data).then((res) => res.data);
  }

  /** DELETE */
  delete<T = any, U = any>(url: string, data?: T): Promise<U> {
    return this.axios.delete(url, data).then((res) => res.data);
  }
}
