const envMap = {
  "development": "test",
  "production": "release"
}
console.log(envMap[process.env.NODE_ENV])
export const apiUrl = `https://api.chronus.xxycode.top/${envMap[process.env.NODE_ENV]}/api`
