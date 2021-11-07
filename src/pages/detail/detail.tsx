import { View, Image } from '@tarojs/components'
import React from 'react'
import "./detail.scss"
const EditImg = require("../../images/detail/edit.png")
const DeleteImg = require("../../images/detail/remove.png")
const TimeImg = require("../../images/detail/time.png")
const LastTimeImg = require("../../images/detail/longest-record.png")
const TimerImg = require("../../images/detail/timer.png")
function Detail() {
    return (
        <View className="container">
            <View className="header">
                <View className="name-box">
                <View className="name">nodejs</View>
                <Image className="edit-img" src={EditImg}></Image>
                </View>
                <Image className="delete-img" src={DeleteImg}></Image>
            </View>
            <View className="statistics-list">
                <View className="total-time">
                    <Image src={TimeImg}></Image>
                    <View className="title">累计时间</View>
                    <View className="value">2秒</View>
                </View>
                <View className="max-time">
                    <Image src={LastTimeImg}></Image>
                    <View className="title">最长时间</View>
                    <View className="value">2秒</View>
                </View>
                <View className="last-date">
                    <Image src={TimerImg}></Image>
                    <View className="title">最近记录</View>
                    <View className="value">2秒</View>
                </View>
            </View>
            <View className="wrapper">
                <View className="title">目标记录</View>
                <View className="targets">
                    <View className="target-item">test</View>
                </View>
            </View>
        </View>
    )
}
export default React.memo(Detail)