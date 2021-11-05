import Taro, { request } from "@tarojs/taro";
import configStore from "../store"
import {getUserInfo, login} from "../actions/user"
import { CLEAR_LOGIN } from "../constants/user";

const baseUrl = "http://localhost:7001/api"
const store = configStore()
export default function requestFn(options:Taro.request.Option):Promise<{code:number, data:any, message: string}>{
    const state = store.getState()
    return request({
        ...options,
        url: `${baseUrl}${options.url}`,
        header: {
            "Authorization": state.user.token || Taro.getStorageSync("token"),
            ...options.header
        }
    }).then(async (res) => {
        if(res.statusCode !== 200){
            Taro.showToast({
                title: res.data.message,
                mask: true,
                icon: "none"
            })
            if(res.statusCode === 401){
                store.dispatch({
                    type: CLEAR_LOGIN
                })
                let res = await login()
                store.dispatch(res)
                let result = await getUserInfo()
                store.dispatch(result)
            }
        return Promise.reject(res.data)

        }
        return Promise.resolve(res.data)
    }).catch(error => {
        return Promise.reject(error)
    })
}