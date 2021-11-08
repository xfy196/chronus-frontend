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
// 获取书籍
export function getBookById(id){
    return request({
        url: `/books/${id}`,
    })
}
// 修改书籍名称
export function updateBook(params){
    return request({
        url: `/books/${params.id}`,
        method: "PUT",
        data: params
    })
}