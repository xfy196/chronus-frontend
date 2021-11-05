import request from "../utils/request"

// 获取创建的书单
export function getBooks(){
    return request({
        url: "/books",
        method: "GET"
    })
}
// 创建书
export function createBook(params){
    return request({
        url: "/books",
        method: "POST",
        data: params
    })
}