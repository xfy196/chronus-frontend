import { LOGIN, SET_USER_INFO } from "../constants/user";
import Taro from "@tarojs/taro";
import request from "../utils/request";
import { actionData } from "src/interface";
export const login: () => Promise<actionData> = async () => {
  try {
    let { code } = await Taro.login();
    let res = await request({
      url: "/users/getToken",
      method: "POST",
      data: {
        code,
      },
    });
    return {
      type: LOGIN,
      payload: {
        token: res.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: "ERROR",
      payload: {},
    };
  }
};
export const getUserInfo = async () => {
  try {
    const res = await request({
      url: `/users/queryUserInfo`,
      method: "GET",
    });
    if (res.code !== 200) {
      Taro.showToast({
        title: res.message,
        mask: true,
        icon: "none"
      });
    } else if (!res.data.userId) {
      Taro.showToast({
        title: "请先授权登录",
        icon: "none",
        mask: true,
      });
    }
    return {
      type: SET_USER_INFO,
      payload: res.data,
    };
  } catch (error) {
    return {
      type: "ERROR",
      payload: error,
    };
  }
};
export const updateUserInfo = async (params) => {
  try {
      await request({
          url: `/users/${params.id}`,
          method: "PUT",
          data: params
      })
      let r = await getUserInfo()
      return r
  } catch (error) {
    return {
      type: "ERROR",
      payload: error,
    };
  }
};