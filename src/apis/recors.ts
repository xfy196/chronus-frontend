import request from "../utils/request"
export function getRecordTotals(){
    return request({
        url: "/records/getTotals",
        method: "GET"
    })
}
// 通过书籍id获取这本书的阅读记录
export function getRecordsByBId(params){
    return request({
        url: `/records/getRecordsByBId`,
        method: "GET",
        data: params
    })
}