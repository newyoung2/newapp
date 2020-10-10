import axios from "axios";
import envConfig from "@/../env.config.js";
import { message } from 'element-ui';

/**
 * @params
 * url: 请求地址(必须)
 * method: 请求方式（必须）
 * base:Boolean,是否为基础平台接口（非必须）
 * data: 请求参数（非必须）
 * formData: Boolean,是否转换成formData(非必须)
 */

const noRepeatSet = new Set();

const changeDataToFormData = (data, formData) => {
  const append = (key, value = "") => {
    const isFile = value instanceof File || value instanceof Blob;
    if (typeof value === "object" && value !== null && !isFile) {
      Object.entries(value).forEach((item) => {
        if (Array.isArray(value)) {
          if (item[1] instanceof File || item[1] instanceof Blob) {
            append(key, item[1]);
          } else {
            append(`${key}[${item[0]}]`, item[1]);
          }
        } else {
          append(`${key}.${item[0]}`, item[1]);
        }
      });
    } else {
      const val = value === null ? "" : value;
      if (isFile) {
        formData.append(key, val, val.name);
      } else {
        formData.append(key, val);
      }
    }
  };
  Object.entries(data).forEach((item) => {
    append(item[0], item[1]);
  });
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("accessToken");
    const params = config.params || config.data;
    if (params.headers) {
      config.headers = {
        ...config.headers,
        ...params.headers,
      };
      delete params.headers;
    }
    if (token) {
      config.headers.Authorization = "Bearer " + accessToken;
      config.headers.token = token;
      config.headers["X-Token"] = token;
    } 
    config.headers["X-Token"] = '8ae64c0896b74c63a590f43f5c71eacc5749154a49084cd71454980a6ac2106015425@manager'
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case 4002:
      case 1067:
        message.info("登录信息过期");
        window.location.hash = "/";
        break;
    }
    switch (response.status) {
      case 200:
      case 201:
        return response;
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          window.location.hash = "/";
          return Promise.reject(new Error("登录信息过期，请重新登录"));
        }
        case 502: {
          return Promise.reject(new Error("服务端未启动，请检查"));
        }
      }
    }
    return Promise.reject(error);
  }
);

// http请求
const httpServer = (opts) => {
  // get请求公共参数
  const publicParams = {
    // ts: Date.now()
  };
  
  // http默认配置
  const method = opts.method.toUpperCase();
  const httpDefaultOpts = {
    method,
    baseURL: opts.base ? envConfig.basicApiPrefix : envConfig.thisApiPrefix,
    url: opts.url,
    timeout: 20000,
  };
  const dataRequest = ["PUT", "POST", "PATCH"];
  if (dataRequest.includes(method)) {
    httpDefaultOpts.data = opts.data || {};
  } else {
    httpDefaultOpts.params = {
      ...publicParams,
      ...(opts.data || {}),
    };
  }

  // formData转换
  if (opts.formData) {
    httpDefaultOpts.transformRequest = [
      (data) => {
        const formData = new FormData();
        changeDataToFormData(data, formData);
        return formData;
      },
    ];
  }

  return new Promise((resolve, reject) => {
    axios(httpDefaultOpts)
      .then((res) => {
        if (
          (res.status === 200 && res.data.resultType === "BUSINESS_SUCCESS") ||
          (res.status === 200 && res.data.success)
        ) {
          resolve(res);
        } else {
          resolve(null);
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        if (err.message.includes("Network Error")) {
          // 基础服务出错，一般都是401，没有权限
          if (err.config.url.includes("api/auth")) {
            if (err.config.url.includes("jwt/token")) {
              message.error("网络错误");
              resolve(null);
              return;
            }
            window.location.hash = "/";
          } else {
            message.error("网络错误");
          }
        } else if (err.message.startsWith("timeout")) {
          message.error("请求超时");
        }
        message.error(
          (err.response && err.response.data && err.response.data.message) ||
          "请求出错"
        );
        resolve(null);
      })
      .finally(() => {
        
      });
  });
};

export default httpServer;
