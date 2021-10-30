import { request } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import configStore from "../store"
const baseUrl = "http://127.0.0.1:7001"
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
    }).then(res => {
        if(res.statusCode !== 200){
            Taro.showToast({
                title: res.data.message,
                mask: true,
                icon: "none"
            })
        }
        return Promise.resolve(res.data)
    }).catch(error => {
        return Promise.reject(error)
    })
}