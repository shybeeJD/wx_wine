const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var num,offset
  if(event.num!=undefined){
    num=event.num
  }else{
    num=10
  }
  if(event.offset!=undefined){
    offset=event.offset
  }else{
    offset=0
  }
  return await db.collection('order').orderBy('addTime','desc').limit(num).skip(offset).get()
}