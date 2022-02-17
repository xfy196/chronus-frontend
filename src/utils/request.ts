import Taro, { request } from "@tarojs/taro";
import configStore from "../store";
import { CLEAR_LOGIN } from "../constants/user";
import qs from "qs";
import { apiUrl } from "../config";
const baseUrl = apiUrl;
const store = configStore();
export default function requestFn(
  options: Taro.request.Option
): Promise<{ code: number; data: any; message: string }> {
  const state = store.getState();
  if (options.method === "GET" && options.data) {
    options.url += `?${qs.stringify(options.data)}`;
  }
  Taro.showLoading();
  return request({
    ...options,
    url: `${baseUrl}${options.url}`,
    header: {
      Authorization: state.user.token || Taro.getStorageSync("token"),
      ...options.header,
    },
  })
    .then(async (res) => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 401) {
          store.dispatch({
            type: CLEAR_LOGIN,
          });
        } else {
          Taro.showToast({
            title: res.data.message,
            mask: true,
            icon: "none",
          });
        }
        return Promise.reject(res.data);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    })
    .finally(() => {
      Taro.hideLoading();
    });
}
