import React, { useCallback, useEffect, useState } from 'react'
import { View, Image, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import "./record.scss"
import { useDidShow, useRouter } from '@tarojs/taro'
import PauseImg from "../../images/timer/pause.png"
import ResumeImg from "../../images/timer/resume.png"
import DoneImg from "../../images/timer/done.png"
import request from "../../utils/request"
import dayjs from 'dayjs'
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)
import "dayjs/locale/zh-cn"
dayjs.locale("zh-cn")
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from "../../reducers/index"
import { SET_START_TIME, SET_TIME, SET_IS_PAUSE, SET_NAME, SET_ID, SET_TIMEOUT } from '../../constants/record'
import { AtTextarea } from 'taro-ui'
function Record() {
    const router = useRouter()
    const time = useSelector((state: StoreState) => state.record.time)
    const timeoutfn = useSelector((state: StoreState) => state.record.timeoutfn)
    const startTime = useSelector((state: StoreState) => state.record.startTime)
    const dispatch = useDispatch()
    const [id, setId] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [endTime, setEndTime] = useState<number>()
    const [summaryValue, setSummaryValue] = useState<string>("")
    const isPause = useSelector((state: StoreState) => state.record.isPause)
    const [isSave, setIsSave] = useState<boolean>(false)
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
        }
        if (!timeoutfn) {
            let t = setInterval(() => {
                dispatch({
                    type: SET_TIME,
                })
            }, 1000)
            dispatch({
                type: SET_TIMEOUT,
                data: t
            })
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
        clearInterval(timeoutfn)
        setEndTime(Date.now())
        dispatch({
            type: SET_TIMEOUT,
            data: 0
        })
        setIsSave(true)
    }, [timeoutfn])
    // 取消
    const handelCancel = useCallback(() => {
        Taro.showModal({
            title: "是否取消本次记录",
            confirmText: "确定",
            cancelText: "取消",
            success() {
                clearInterval(timeoutfn)
                dispatch({
                    type: SET_TIMEOUT,
                    data: 0
                })
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
                    data: 0
                })
                Taro.navigateBack()
            }
        })
    }, [timeoutfn])
    const handelSummaryChange = useCallback((value) => {
        setSummaryValue(value)
    }, [summaryValue])
    // 将数据保存到数据库
    const handelSaveRequest = useCallback(async () => {
        let res = await request({
            url: "/records",
            method: "POST",
            data: {
                time,
                start_time: startTime,
                end_time: endTime,
                b_id: id,
                title: summaryValue
            }
        })
        Taro.showToast({
            title: res.message,
            icon: "none",
            success() {
                clearInterval(timeoutfn)
                dispatch({
                    type: SET_TIMEOUT,
                    data: 0
                })
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
                    data: 0
                })
                Taro.reLaunch({
                    url: '/pages/index/index'
                })
            }
        })
    }, [time, startTime, summaryValue, id, name])
    return (
        <View className="container">
            {!isSave && <>
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
            </>}
            {
                isSave && <>
                    <View className="save-title">本次记录统计</View>
                    <View className="save-info">
                        <View className="start-time-info">
                            <View className="hm-time">{dayjs(startTime).format("HH:mm")}</View>
                            <View className="date-time">{dayjs(startTime).format("MM-DD")}</View>
                            <View className="txt">开始时间</View>
                        </View>
                        <View className="record-time-info">
                            <View className="record-time">{dayjs.duration(time).seconds()}秒</View>
                            <View className="progress">
                            </View>
                        </View>
                        <View className="end-time-info">
                            <View className="hm-time">{dayjs(endTime).format("HH:mm")}</View>
                            <View className="date-time">{dayjs(endTime).format("MM-DD")}</View>
                            <View className="txt">结束时间</View>
                        </View>
                    </View>
                    <View className="summary">
                        <View className="title">有什么要总结的吗？</View>
                        <AtTextarea className="summary-value" value={summaryValue}
                            onChange={handelSummaryChange}
                            maxLength={200}
                        ></AtTextarea>
                        <View onClick={handelSaveRequest} className="save-btn">保存</View>
                    </View>
                </>
            }
        </View>
    )
}
export default React.memo(Record)
