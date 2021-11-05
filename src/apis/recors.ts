import request from "../utils/request"
export function getRecordTotals(){
    return request({
        url: "/records/getTotals",
        method: "GET"
    })
}