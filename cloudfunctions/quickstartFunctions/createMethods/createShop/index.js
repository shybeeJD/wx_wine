const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {



  var latitude = event.latitude
  var longitude = event.longitude
  data={
    name:event.name,
    freight:event.freight,
    category:event.category,
    address:event.address,
    postRange:event.maxrange,
    min_fee:event.min_fee,
    location: db.Geo.Point(longitude, latitude)
  }
  console.log(data)
  if (event._id !=undefined && event._id!=null){
    return await db.collection('shop')
    .where({
      _id:event._id
    })
    .update({
      data:data
    })
  }
  return await db.collection('shop').add({
    // data 字段表示需新增的 JSON 数据
    data: data
  })
}