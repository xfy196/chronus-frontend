import { View } from '@tarojs/components'
import React, { useCallback, useState } from 'react'
import { AtButton, AtInput } from 'taro-ui'
import "./create-target.scss"
interface IProps {
    cancel: Function,
    confirm: Function
}
function CreateTarget(props: IProps) {
    const [value, setValue] = useState<string>("")
    const handleChage = useCallback((value) => {
        setValue(value)
    }, [])
    // 取消
    const handleCancel = useCallback(() => {
        setValue("")
        props.cancel(false)
    }, [])
    const handleConfirm = useCallback(() => {
        // 调用接口
        props.confirm(false)
    }, [])
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
                    value={value}
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