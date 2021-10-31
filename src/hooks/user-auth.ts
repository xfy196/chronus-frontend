// 这就是一个检测用户是否授权信息的钩子函数
import configStore from "../store"
const store = configStore()
export const hasUserInfo = () => {
    let state = store.getState()
    return state.user.isLogin
}