import { Component } from "react";
import { Provider } from "react-redux";

import configStore from "./store";
import { login as loginAction, getUserInfo } from "./actions/user";
import "./app.scss";
import Taro from "@tarojs/taro";

window.wx = Taro
const store = configStore();

class App extends Component {
  componentDidMount() {
  }

  componentDidShow() {
    Taro.checkSession({
      async success() {
        Taro.showLoading();
        let res = await getUserInfo();
        Taro.hideLoading();
        store.dispatch(res)
      },
      async fail() {
        // session失效
        Taro.showLoading();

        let res = await loginAction();
        store.dispatch(res);
        let result = await getUserInfo()
        store.dispatch(result)
        Taro.hideLoading();

      },
    });
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
