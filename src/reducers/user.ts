import { LOGIN, CLEAR_LOGIN, SET_USER_INFO } from "../constants/user";
import Taro from "@tarojs/taro";
import { actionData } from "src/interface";
import { IUserInfo } from "./interface";
const INITIAL_STATE: {
  isLogin: boolean;
  token: string;
  userInfo: IUserInfo | {};
} = {
  isLogin: false,
  token: "",
  userInfo: {},
};

export default function counter(state = INITIAL_STATE, action: actionData) {
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
        return {
            ...state,
            userInfo: action.payload
        }
    default:
      return state;
  }
}
