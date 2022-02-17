const envMap = {
  "test": "test",
  "production": "release"
}
let apiBase = 'http://localhost:7001/api'
if(process.env.NODE_ENV !== "development"){
  apiBase = `https://api.chronus.xxycode.top/${envMap[process.env.NODE_ENV]}/api`
}
export const apiUrl = apiBase
