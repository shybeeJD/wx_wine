const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  var userInfo=cloud.getWXContext()
  var shopLatitude = event.shopLatitude
  var shopLongitude = event.shopLongitude
  console.log(shopLatitude)
  var res =await db.collection('address').aggregate()
  .geoNear({
    distanceField: 'distance', // 输出的每个记录中 distance 即是与给定点的距离
    spherical: true,
    distanceMultiplier:6100,
    near: db.Geo.Point(shopLongitude, shopLatitude),
    query: {
      userId:userInfo.OPENID
    },
    key: 'location', // 若只有 location 一个地理位置索引的字段，则不需填
    includeLocs: 'location', // 若只有 location 一个是地理位置，则不需填
  })
  .end()
  return (res)

}