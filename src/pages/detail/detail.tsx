import { View, Image, Text } from '@tarojs/components'
import { useDidShow, useRouter } from "@tarojs/taro"
import React, { useCallback, useState } from 'react'
import Loading from "../../components/loading"
import CreateTarget from "../../components/create-target/create-target"
import "./detail.scss"
import { getBookById } from "../../apis/books"
import { getRecordsByBId } from "../../apis/recors"
import { ITarget } from '../index/interface'
import dayjs from "dayjs"
const EditImg = require("../../images/detail/edit.png")
const DeleteImg = require("../../images/detail/remove.png")
const TimeImg = require("../../images/detail/time.png")
const LastTimeImg = require("../../images/detail/longest-record.png")
const RecentImg = require("../../images/detail/recent.png")
const TimerImg = require("../../images/detail/timer.png")
function Detail() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [book, setBook] = useState<ITarget>()
    const [targets, setTargets] = useState<Array<any>>([])
    const router = useRouter()

    const handleInitRequest = useCallback(() => {
        handleTopRequest()
    }, [])
    const handleCancel = useCallback((bool) => {
        setIsUpdate(bool)
    }, [])
    const handleConfirm = useCallback((bool) => {
        setIsUpdate(bool)
    }, [])
    const handleEdit = useCallback(() => {
        setIsUpdate(true)
    }, [isUpdate])

    // 请求头部数据
    const handleTopRequest = useCallback(async () => {
        let id = router.params.id
        let res = await getBookById(id)
        if (res.code === 200) {
            setBook(res.data)
        }
    }, [])

    const handleTargets = useCallback(async () => {
        let res = await getRecordsByBId({
            bId: router.params.id,
        })
        if (res.code === 200) {
            setTargets(res.data)
        }
    }, [])
    useDidShow(() => {
        handleTopRequest()
        handleTargets()
    })
    return (
        <View className="container">
            <View className="header">
                <View className="name-box">
                    <View className="name">{book?.name}</View>
                    <Image className="edit-img" onClick={handleEdit} src={EditImg}></Image>
                </View>
                <Image className="delete-img" src={DeleteImg}></Image>
            </View>
            <View className="statistics-list">
                <View className="total-time">
                    <Image src={TimeImg}></Image>
                    <View className="title">累计时间</View>
                    <View className="value">{book?.totalTime}秒</View>
                </View>
                <View className="max-time">
                    <Image src={LastTimeImg}></Image>
                    <View className="title">最长时间</View>
                    <View className="value">{book?.highTime}秒</View>
                </View>
                <View className="last-date">
                    <Image src={RecentImg}></Image>
                    <View className="title">最近记录</View>
                    <View className="value">{dayjs(book?.last_record_time).locale("zh-cn").format("MM月DD日")}</View>
                </View>
            </View>
            {
                isLoading ? <View className="loading-wrapper">
                    <Loading />
                </View> : <View className="wrapper">
                    <View className="title">目标记录</View>
                    <View className="targets">
                        {
                            targets?.length > 0 && targets.map(item => {
                                return (
                                    <View className="target-item">
                                        <View className="left-target">

                                            <View className='title'>{item.title}</View>
                                            <View className="daterange">{dayjs(item.createdAt).locale("zh-cn").format("MM月DD日 hh:ss")} ~ {dayjs(item.updatedAt).locale("zh-cn").format("MM月DD日 hh:ss")}</View>
                                        </View>
                                        <View className="right-target">
                                            <View className="time"><Text className="second">{item.time}</Text>秒</View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            }
            {isUpdate && <CreateTarget data={book} mode="update" cancel={handleCancel} confirm={handleConfirm} requestBooks={handleInitRequest} title={'目标修改为?'} />}
            <View className="start-record-btn">
                <Image src={TimerImg}/>
                开始记录
            </View>
        </View>
    )
}
export default React.memo(Detail)