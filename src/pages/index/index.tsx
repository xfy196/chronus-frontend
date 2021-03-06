import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Image, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtAvatar, AtButton } from "taro-ui"
import { updateUserInfo } from "../../actions/user"
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from '../../reducers'
import { IUser } from '../../reducers/user'
import Loading from "../../components/loading"
import CreateTarget from "../../components/create-target/create-target"
import { ITarget } from "./interface"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { EChart } from "echarts-taro3-react"
dayjs.extend(duration)
import "./index.scss"
import "taro-ui/dist/style/components/modal.scss"
import { getBooks } from '../../apis/books'
import { getRecordTotals } from '../../apis/recors'
const EmptyImg = require("../../images/home/empty.png")
const CreateImg = require("../../images/home/create.png")


function Index() {
  const dispatch = useDispatch()
  const user: IUser | any = useSelector((state: StoreState) => state.user)
  const pieRef = useRef<any>(null)
  const [pieData, setPieData] = useState<Array<{
    value: string | number,
    name: string
  }>>([])
  const [isCreate, setIsCreate] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [totalTime, setTotalTime] = useState<number>(0)

  const [targets, setTargets] = useState<Array<ITarget>>([])
  const time = useSelector((state: StoreState) => state.record.time)
  const isPause = useSelector((state: StoreState) => state.record.isPause)
  const name = useSelector((state: StoreState) => state.record.name)
  const id = useSelector((state: StoreState) => state.record.id)
  useEffect(() => {
    if (pieRef.current) {
      pieRef.current.refresh({
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '70%',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }, [pieRef.current, pieData])
  useEffect(() => {
    if (user.isLogin) {
      requestBooks()
      requestRecordTotals()
    }
  }, [user.isLogin])

  useEffect(() => {
    if(targets.length > 0){
      let newTargets = targets.map(item => ({value: (item.totalTime / 1000).toFixed(0), name: item.name}))
      setPieData(newTargets)
    }
  }, [targets])

  const requestBooks = useCallback(async () => {
    setIsLoading(true)
    let res = await getBooks()
    setTargets(res.data)
    setIsLoading(false)
  }, [])
  const requestRecordTotals = useCallback(async () => {
    let res = await getRecordTotals()
    setTotalTime(res.data)
  }, [user.isLogin])
  // ??????
  const handelCancel = useCallback((value) => {
    setIsCreate(value)
  }, [user.isLogin])

  const handelGetUserInfo = useCallback(async () => {
    if (window.wx.getUserProfile) {
      Taro.getUserProfile({
        desc: "??????????????????",
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
  }, [user.userInfo])
  // ????????????
  const handleCreate = useCallback((e) => {
    e.stopPropagation()
    setIsCreate(true)
  }, [])
  // ??????
  const handleConfirm = useCallback((val) => {
    setIsCreate(val)
  }, [])
  const handelToDetail = useCallback((id) => {
    Taro.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }, [])
  const handelLook = useCallback(() => {
    Taro.navigateTo({
      url: `/pages/record/record?id=${id}&name=${name}`
    })
  }, [id, name])
  const formateTime = useCallback((time: number) => {
    return ~~(time / 1000)
  }, [totalTime])
  return (
    <View className='container'>
      <View className={isCreate ? 'blur-bg' : ''}>
        <View className='header'>
          <View className='avatar-box'>
            <AtAvatar circle image={user.userInfo.avatarUrl}></AtAvatar>
          </View>
          <View className='info'>
            {!user.isLogin && <AtButton className='login-btn' size='small' onClick={handelGetUserInfo}>????????????</AtButton>}
            {user.isLogin && <View className='nick-name'>{user.userInfo.nickName},</View>}
            <View className='total-time'>????????????????????????{formateTime(totalTime)}???</View>
          </View>
        </View>
        <View className='chart-area'>
          {
            targets.length > 0 ? <EChart canvasId="pieCanvas" ref={pieRef}></EChart> : <Image src={EmptyImg}></Image>
          }
        </View>
        {/* ??????????????? */}
        {
          time !== 0 && <View className="record-pane">
            <View className="top">

              <View className="left-txt">??????&nbsp;<Text className="name">{name}</Text>&nbsp;{isPause ? "?????????" : '?????????'}</View>
              <View className="look-btn" onClick={handelLook}>??????</View>
            </View>
            <View className="time">{`${dayjs.duration(time).hours()}:${dayjs.duration(time).minutes()}:${dayjs.duration(time).seconds()}`}</View>

          </View>
        }

        <View style={isLoading ? { alignItems: 'center', justifyContent: 'center' } : {}} className='target-container'>
          {isLoading && <Loading />}
          {!isLoading && <View className='target-list'>
            <View className='title'>
              ??????<Text>{targets.length}</Text>
              ?????????
            </View>
            {
              targets.length > 0 && targets.map(item => {
                return (
                  <View key={item.id} onClick={handelToDetail.bind(null, item.id)} className='target-item'>
                    <View className='target-name'>{item.name}</View>
                    <View className='target-bottom'>
                      <View className='target-total-time'>?????????{formateTime(item.totalTime)}???</View>
                      <View className='target-last-record-time'>???????????????{item.last_record_time ? dayjs(item.last_record_time).format("MM???DD??? hh:mm") : '????????????'}</View>
                    </View>
                  </View>
                )
              })
            }
          </View>}

        </View>
        <Image className='create-img' onClick={handleCreate} src={CreateImg}></Image>
      </View>
      {isCreate && <CreateTarget mode="create" title={"??????????????????"} requestBooks={requestBooks} confirm={handleConfirm} cancel={handelCancel} />}
    </View>
  )
}
export default Index
