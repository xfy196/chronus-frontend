import { View } from '@tarojs/components'
import React, { useCallback, useState } from 'react'
import { AtButton, AtInput } from 'taro-ui'
import {createBook} from "../../../apis/books"
import "./create-target.scss"
interface IProps {
    cancel: Function,
    confirm: Function,
    requestBooks: Function
}
function CreateTarget(props: IProps) {
    const [name, setName] = useState<string>("")
    const handleChage = useCallback((value) => {
        setName(value)
    }, [])
    // 取消
    const handleCancel = useCallback(() => {
        setName("")
        props.cancel(false)
    }, [])
    const handleConfirm = useCallback(async () => {
        // 调用接口
        await createBook({
            name
        })
        props.requestBooks()
        props.confirm(false)
    }, [name])
    return (
        <View className="mask">
            <View className="create-target-container">
                <View className="title">
                    新目标的名称
                </View>
                <AtInput
                    className="target-input"
                    name='value'
                    type='text'
                    placeholder='例如：阅读《CSS世界》'
                    value={name}
                    onChange={handleChage}
                />
                <View className="footer">
                    <AtButton onClick={handleCancel} size="small" className="cancel">取消</AtButton>
                    <AtButton onClick={handleConfirm} size="small" className="confirm">确认</AtButton>
                </View>
            </View>
        </View>
    )
}
export default React.memo(CreateTarget)