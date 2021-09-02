const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var userInfo=cloud.getWXContext()
  var num,offset
  var status=[1]
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
  if(event.status != undefined){
    status=event.status
  }
  const _ = db.command
  var resp = await db.collection('order')
  .where({
    userId:userInfo.OPENID,
    status: _.in(status),
  })
  .orderBy('addTime','desc').limit(num).skip(offset).get()
  resp['offset']=offset
  return resp
}