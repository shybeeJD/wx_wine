const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {

  var userInfo=cloud.getWXContext()
  data={
    receiver:event.receiver,
    phone:event.phone,
    region:event.region.join(''),
    detail:event.detail,
    userId:userInfo.OPENID
  }
  return await db.collection('address').add({
    // data 字段表示需新增的 JSON 数据
    data: data
  })
}