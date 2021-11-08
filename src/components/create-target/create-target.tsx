import { View } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import { ITarget } from 'src/pages/index/interface'
import { AtButton, AtInput } from 'taro-ui'
import {createBook, updateBook} from "../../apis/books"
import "./create-target.scss"
interface IProps {
    cancel: Function,
    confirm: Function,
    requestBooks: Function,
    title: string,
    mode: 'create' | 'update',
    data?: ITarget
}
function CreateTarget(props: IProps) {
    const [name, setName] = useState<string | undefined>("")
    useEffect(() => {
        setName(props.data?.name)
    }, [props.data])
    const handleChage = useCallback((value) => {
        setName(value)
    }, [])
    // 取消
    const handleCancel = useCallback(() => {
        setName("")
        props.cancel(false)
    }, [])
    const handleConfirm = useCallback(async () => {
        if(props.mode === "create"){
            // 调用接口
            await createBook({
                name
            })
            props.requestBooks()
            props.confirm(false)
        }else {
            await updateBook({
                id: props.data?.id,
                name: name
            })
            props.requestBooks()
            props.confirm(false)
        }
    }, [name])
    return (
        <View className="mask">
            <View className="create-target-container">
                <View className="title">
                    {props.title}
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