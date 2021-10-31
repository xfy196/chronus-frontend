import { View } from '@tarojs/components'
import React from 'react'
import "./index.scss"
export default function Loading() {
    return (
        <View className="loading">
            <View className="bounce1"></View>
            <View className="bounce2"></View>
            <View className="bounce3"></View>
        </View>
    )
}
