import React, { useCallback, useState } from 'react'
import { View, Image, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtAvatar, AtButton } from "taro-ui"
import { updateUserInfo } from "../../actions/user"
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from '../../reducers'
import { IUser } from '../../reducers/user'
import Loading from "../../components/loading"
import CreateTarget from "./components/create-target"
import {ITarget} from "./interface"
import dayjs from "dayjs"
import "./index.scss"
import "taro-ui/dist/style/components/modal.scss"
const EmptyImg = require("../../images/home/empty.png")
const CreateImg = require("../../images/home/create.png")
function Index() {
  const dispatch = useDispatch()
  const user: IUser | any = useSelector((state: StoreState) => state.user)

  const [isCreate, setIsCreate] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [targets, setTargets] = useState<Array<ITarget>>([{
    name: "nodejs",
    uid: "1",
    totalTime: 1635865165852,
    lastRecordTime: 1635865165852
  },{
    name: "nodejs",
    uid: "2",
    totalTime: 1635865165852,
    lastRecordTime: 1635865165852
  }])

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
          {isLoading && <Loading />}
          {!isLoading && <View className="target-list">
            <View className="title">
              你有<Text>{targets.length}</Text>
              个目标
            </View>
            {
              targets.length > 0 && targets.map(item => {
                return (
                  <View key={item.uid} className="target-item">
                    <View className="target-name">{item.name}</View>
                    <View className="target-bottom">
                      <View className="target-total-time">累计：{item.totalTime}</View>
                      <View className="target-last-record-time">最后记录：{dayjs(item.lastRecordTime).format("MM月DD日 hh:mm")}</View>
                    </View>
                  </View>
                )
              })
            }
          </View>}

        </View>
        <Image className="create-img" onClick={handleCreate} src={CreateImg}></Image>
      </View>
      {isCreate && <CreateTarget confirm={handleConfirm} cancel={handelCancel} />}
    </View>
  )
}
export default React.memo(Index)