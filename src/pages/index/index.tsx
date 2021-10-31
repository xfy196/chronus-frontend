import React, { useCallback, useState } from 'react'
import { View, Image } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtAvatar, AtButton } from "taro-ui"
import { updateUserInfo } from "../../actions/user"
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from '../../reducers'
import { IUser } from '../../reducers/user'
import Loading from "../../components/loading"
import CreateTarget from "./components/create-target"
import "./index.scss"
import "taro-ui/dist/style/components/modal.scss"
const EmptyImg = require("../../images/home/empty.png")
const CreateImg = require("../../images/home/create.png")
function Index() {
  const dispatch = useDispatch()
  const user: IUser | any = useSelector((state: StoreState) => state.user)

  const [isCreate, setIsCreate] = useState<boolean>(false)

  // 取消
  const handelCancel = useCallback((value) => {
    setIsCreate(value)
  }, [])

  const handelGetUserInfo = useCallback(async () => {
    if (window.wx.getUserProfile) {

      Taro.getUserProfile({
        desc: "获取用户信息",
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

  // 创建书单
  const handleCreate = useCallback((e) => {
    e.stopPropagation()
    setIsCreate(true)
  }, [])
  // 确认
  const handleConfirm = useCallback((val) => {
    setIsCreate(val)
  }, [])
  return (
    <View className="container">
      <View className={isCreate ? 'blur-bg' : ''}>
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
        <View className="target-container">
          <Loading></Loading>
        </View>
        <Image className="create-img" onClick={handleCreate} src={CreateImg}></Image>
      </View>
        {isCreate && <CreateTarget confirm={handleConfirm} cancel={handelCancel} />}
    </View>
  )
}
export default React.memo(Index)