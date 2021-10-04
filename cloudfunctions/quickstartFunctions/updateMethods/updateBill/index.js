const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
 
  var userInfo=cloud.getWXContext()
  var _id = event._id
  var header = event.header
  var tax = event.tax
  var userInfo=cloud.getWXContext()
  console.log(event)
  console.log(_id)
  console.log(header)
  console.log(tax)
  var res=await db.collection('order')
  .where({_id:_id})
  .update({data:{
    bill:1,
    header:header,
    tax:tax
  }})
  console.log(res)
  return res
  
}