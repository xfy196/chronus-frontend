import React, { useCallback, useEffect, useState } from 'react'
import { View, Image, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import "./record.scss"
import { useDidShow, useRouter } from '@tarojs/taro'
import PauseImg from "../../images/timer/pause.png"
import ResumeImg from "../../images/timer/resume.png"
import DoneImg from "../../images/timer/done.png"
import dayjs from 'dayjs'
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)
import "dayjs/locale/zh-cn"
dayjs.locale("zh-cn")
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from "../../reducers/index"
import { SET_START_TIME, SET_TIME, SET_IS_PAUSE, SET_NAME, SET_ID } from '../../constants/record'
function Record() {
    const router = useRouter()
    const time = useSelector((state: StoreState) => state.record.time)
    const [isStartTime, setIsStartTime] = useState<boolean>(false)
    const startTime = useSelector((state: StoreState) => state.record.startTime)
    const endTime = useSelector((state: StoreState) => state.record.endTime)
    const dispatch = useDispatch()
    const [id, setId] = useState<string>("")
    const [name, setName] = useState<string>("")
    const isPause = useSelector((state: StoreState) => state.record.isPause)
    useEffect(() => {
        if (isStartTime) {
            let timeoutfn = setTimeout(() => {
                dispatch({
                    type: SET_TIME,
                    data: 1000 + time
                })
                clearTimeout(timeoutfn)
            }, 1000)
        }
    }, [time, isStartTime])
    useDidShow(() => {
        setName(router.params?.name || '')
        setId(router.params?.id || '')
        dispatch({
            type: SET_NAME,
            data: router.params?.name
        })
        dispatch({
            type: SET_ID,
            data: Number(router.params?.id)
        })
        if (!startTime || !time) {
            dispatch({
                type: SET_START_TIME,
                data: Date.now()
            })
            setIsStartTime(true)
        } else {
            dispatch({
                type: SET_TIME,
                data: Date.now() - startTime
            })
            setIsStartTime(true)
        }
    })
    const handelClickPause = useCallback(() => {
        dispatch({
            type: SET_IS_PAUSE,
            data: !isPause
        })
    }, [isPause])
    // 保存
    const handelSave = useCallback(() => {

    }, [])
    // 取消
    const handelCancel = useCallback(() => {
        Taro.showModal({
            title: "是否取消本次记录",
            confirmText: "确定",
            cancelText: "取消",
            success() {
                dispatch({
                    type: SET_TIME,
                    data: 0
                })
                dispatch({
                    type: SET_START_TIME,
                    data: 0
                })
                dispatch({
                    type: SET_NAME,
                    data: ""
                })
                dispatch({
                    type: SET_ID,
                    data: id
                })
                setIsStartTime(false)
                Taro.navigateBack()
            }
        })
    }, [])
    return (
        <View className="container">
            <View className="name">{name}</View>
            <View className="tip">{isPause ? '已暂停' : '进行中'}</View>
            <View className="watch-box">
                <View className="time">{`${dayjs.duration(time).hours()}:${dayjs.duration(time).minutes()}:${dayjs.duration(time).seconds()}`}</View>
                <View className="watch">
                    <View style={isPause ? { background: "#e6ad59" } : {}} onClick={handelClickPause} className="img-box">
                        <Image src={isPause ? ResumeImg : PauseImg}></Image>
                    </View>
                </View>
                <View onClick={handelSave} className="save-over-btn">
                    <Image src={DoneImg}></Image>
                    <Text>结束并保存</Text>
                </View>
                <View onClick={handelCancel} className="cancel-btn">取消</View>
            </View>
        </View>
    )
}
export default React.memo(Record)