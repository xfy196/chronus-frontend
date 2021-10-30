import {LOGIN, SET_USER_INFO} from "../constants/user"
import Taro from "@tarojs/taro"
import request from "../utils/request"
import { actionData } from "src/interface"
import configStore from "../store";
const stroe = configStore()
export const login: () => Promise<actionData> = async () => {
    try {
        let {code} = await Taro.login()
        let res = await request({
            url: "/api/users/getToken",
            method: "POST",
            data: {
                code
            }
        })
        let result = await getUserInfo()
        stroe.dispatch(result)
        return {
            type: LOGIN,
            payload: {
                token: res.data
            }
        }
    } catch (error) {
        console.log(error)
        return {
            type: "ERROR",
            payload: {}
        }
    }
}
export const getUserInfo = async () => {

    try {
        const res = await request({
            url: `/api/users/queryUserInfo`,
            method: "GET",
        })
        if(res.code !== 200){
            Taro.showToast({
                title: res.message,
                mask: true
            })
        }
        return {
            type: SET_USER_INFO,
            payload: res.data
        }
    } catch (error) {
        return {
            type: "ERROR",
            payload: error
        }
    }
}