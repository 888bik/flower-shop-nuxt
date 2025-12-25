import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import apiModules from "~/api";
import type { ApiResponse } from "~/types/common/api";

export interface IInterceptors {
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestFailureFn?: (err: any) => any;
  responseSuccessFn?: (res: AxiosResponse) => AxiosResponse;
  responseFailureFn?: (err: any) => any;
}

export interface MyRequestConfig extends AxiosRequestConfig {
  interceptors?: IInterceptors;
}

export class MyRequest {
  instance: AxiosInstance;

  constructor(config: MyRequestConfig) {
    this.instance = axios.create(config);
    //添加全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        //将token添加到请求头中
        const authStore = useAuthStore();
        if (authStore.accessToken) {
          config.headers["accessToken"] = authStore.accessToken;
        }
        return config;
      },

      (err) => {
        return Promise.reject(err);
      }
    );
    //响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data as ApiResponse<any>;

        return data.data;
      },
      async (err) => {
        const status = err?.response?.status;
        const originalRequest = err.config;
        const authStore = useAuthStore();

        if (
          status === 401 &&
          !originalRequest._retry &&
          authStore.refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const refreshRes = await this.post("/auth/refresh", {
              refreshToken: authStore.refreshToken,
              role: "user",
            });

            const { accessToken, refreshToken } = refreshRes;

            authStore.updateAccessToken(accessToken);
            authStore.updateRefreshToken(refreshToken);

            originalRequest.headers["accessToken"] = accessToken;
            return this.request(originalRequest);
          } catch (refreshErr) {
            authStore.logout();
            return Promise.reject(refreshErr);
          }
        }

        return Promise.reject(err);
      }
    );

    //针对个别请求添加拦截
    if (config.interceptors) {
      const {
        requestSuccessFn,
        requestFailureFn,
        responseSuccessFn,
        responseFailureFn,
      } = config.interceptors;

      requestSuccessFn &&
        this.instance.interceptors.request.use(
          requestSuccessFn,
          requestFailureFn
        );
      responseSuccessFn &&
        this.instance.interceptors.response.use(
          responseSuccessFn,
          responseFailureFn
        );
    }
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, data, method: "POST" });
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, data, method: "PUT" });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }
}

// 插件注入
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // const serverBase = import.meta.server ? "http://8.148.226.68:11048" : "/api"; // 浏览器开发通过 Vite proxy
  const serverBase = "/api";

  const axiosInstance = new MyRequest({
    baseURL: serverBase,
    timeout: (config.public.timeout as number) ?? 20000,
  });

  const $api = apiModules(axiosInstance);
  nuxtApp.provide("api", $api);
});
