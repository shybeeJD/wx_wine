cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  var userInfo=cloud.getWXContext()
  var wine=event.data.wine
  
}