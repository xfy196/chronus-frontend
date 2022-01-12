const envMap = {
  "development": "test",
  "production": "release"
}
console.log(envMap[process.env.NODE_ENV])
export const apiUrl = `https://service-cec0jxfp-1256637096.sh.apigw.tencentcs.com/${envMap[process.env.NODE_ENV]}/api`
