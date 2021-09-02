const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {

  var userInfo=cloud.getWXContext()
  if (event.default!=undefined && event.default==true){
      await db.collection('address').where({
      userId:userInfo.OPENID
    }).update({
      data:{
        default:false
      }
    })

  }

  data={
    receiver:event.receiver,
    phone:event.phone,
    region:event.region,
    detail:event.detail,
    userId:userInfo.OPENID,
    label:event.label,
    default:event.default
  }
  if (event._id !=undefined && event._id!=null){
    return await db.collection('address')
    .where({
      userId:userInfo.OPENID,
      _id:event._id
    })
    .update({
      data:data
    })
  }
  return await db.collection('address').add({
    // data 字段表示需新增的 JSON 数据
    data: data
  })
}