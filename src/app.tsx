import { Component } from "react";
import { Provider } from "react-redux";
import configStore from "./store";
import { login as loginAction, getUserInfo } from "./actions/user";
import "./app.scss";
import Taro from "@tarojs/taro";

window.wx = Taro
const store = configStore();

async function restartLogin() {
  let res = await loginAction();
  store.dispatch(res);
  let result = await getUserInfo()
  store.dispatch(result)
}

class App extends Component {
  componentDidMount() {
    Taro.checkSession({
      async success() {
        try {
          Taro.showLoading();
          let res = await getUserInfo();
          store.dispatch(res)
          Taro.hideLoading();
        } catch (error) {
          await restartLogin()
        }
      },
      async fail() {

        // session失效
        Taro.showLoading();
        await restartLogin()
        Taro.hideLoading();

      },
    });
  }


  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
