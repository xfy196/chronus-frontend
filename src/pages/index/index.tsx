import React, { useCallback } from 'react'
import { View, Image } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtAvatar, AtButton } from "taro-ui"
import { updateUserInfo } from "../../actions/user"
import {  useDispatch, useSelector } from 'react-redux'
import { StoreState } from '../../reducers'
import { IUser } from '../../reducers/user'
import "./index.scss"
const EmptyImg = require("../../images/home/empty.png")
function Index() {
  const dispatch = useDispatch()
  const user: IUser | any = useSelector((state: StoreState) => state.user)
  const handelGetUserInfo = useCallback(async () => {
    if (window.wx.getUserProfile) {

      Taro.getUserProfile({
        desc: "获取用户信息",
        async success({ encryptedData, iv, userInfo }) {
          let res = await updateUserInfo({
            encryptedData,
            iv,
            id: user.userInfo.id
          })
          dispatch(res)
        },
        fail(err) {
          Taro.showToast({
            title: err.errMsg
          })
        }
      })
    } else {
      Taro.getUserInfo({
        async success({ encryptedData, iv }) {
          let res = await updateUserInfo({
            encryptedData,
            iv,
            id: user.userInfo.id
          })
          dispatch(res)
        },
        fail(err) {
          Taro.showToast({
            title: err.errMsg
          })
        }
      })
    }
  }, [])
  return (
    <View className="container">
      <View className="header">
        <View className="avatar-box">
          <AtAvatar circle image={user.userInfo.avatarUrl}></AtAvatar>
        </View>
        <View className="info">
          {!user.isLogin && <AtButton className="login-btn" size="small" onClick={handelGetUserInfo}>授权登录</AtButton>}
          {user.isLogin && <View className="nick-name">{user.userInfo.nickName},</View>}
          <View className="total-time">你的总累计时间为{'100'}</View>
        </View>
      </View>
      <View className="chart-area">
        <Image src={EmptyImg}></Image>
      </View>
      <View className="target-container"></View>
    </View>
  )
}
export default React.memo(Index)