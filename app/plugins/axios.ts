import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import apiModules from "~/api";

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
    //请求拦截,可以针对每个请求拦截处理,比如添加token
    this.instance.interceptors.request.use(
      (config) => {
        //将token添加到请求头中
        // const token = getToken("admin-token");
        // if (token) config.headers["token"] = token;

        return config;
      },
      (err) => {
        Promise.reject(err);
      }
    );
    //响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data.data;
      },
      (err) => {
        const msg = err?.response?.data?.msg || "请求失败";
        // toast("请求错误", msg, "error");
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
  const axiosInstance = new MyRequest({
    baseURL: config.public.apiBase as string, // 从 runtimeConfig 读取
    timeout: (config.public.timeout as number) ?? 20000,
  });
  const $api = apiModules(axiosInstance); // 生成模块化 API

  nuxtApp.provide("api", $api);
});
