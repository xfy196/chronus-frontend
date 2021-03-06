import { LOGIN, CLEAR_LOGIN, SET_USER_INFO } from "../constants/user";
import Taro from "@tarojs/taro";
import { actionData } from "src/interface";
import { IUserInfo } from "./interface";
export interface IUser {
  isLogin: boolean;
  token: string;
  userInfo: IUserInfo | {};
  num: number
}
const INITIAL_STATE: IUser = {
  isLogin: false,
  token: Taro.getStorageSync("token") || "",
  userInfo: {},
  num: 0
};

export default function reducers(state = INITIAL_STATE, action: actionData) {
  switch (action.type) {
    case LOGIN:
      let token = action.payload.token;
      Taro.setStorageSync("token", token);
      return {
        ...state,
        token,
      };
    case CLEAR_LOGIN:
      Taro.removeStorageSync("token");
      return {
        ...state,
        isLogin: false,
        token: "",
      };
    case SET_USER_INFO:
      let userInfo = { ...action.payload };
      if (userInfo.userId && state.token) {
        state.isLogin = true
      }
      state.userInfo = userInfo
      return {
        ...state,
      };
    default:
      return state
  }
}
