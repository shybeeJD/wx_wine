const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var userInfo=cloud.getWXContext()
  var id = event.id
  
}