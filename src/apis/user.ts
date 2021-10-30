import request from "../utils/request"
export const login = (code) => {
    return request({
        url: "/",
        method: "POST",
        data: {
            code
        }
    })
}