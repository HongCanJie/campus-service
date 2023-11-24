// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'basic-2wp9o-3glj6daye1518f55',
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await cloud.uploadFile({
       // new Buffer
      fileContent: Buffer.from(event.fileContent, 'base64'),
      cloudPath: event.cloudPath // 使用随机文件名
    })
  } catch (e) {
    return e
  }
}