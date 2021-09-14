const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var userInfo=cloud.getWXContext()
  var _id = event._id
  var status = event.status
  data={
    status:status
  }
  var now=new Date()
  if(status==1){
    data.achieveTime=now
  }
  else if(status == 2){
    data.shippingTime=now
  }
  else if( status == 3){
    data.acceptTime=now
  }
  else if(status == 4){
    data.refuseTime = now
  }
  else if(status == 6){
    data.cancelTime =now
  }
  else if(status == 7){
    data.cancelTime =now
  }
  else if(status == 8){
    data.payTime = now
  }
  else if(status == 9){
    data.cancelTime=now
  }
  if(_id!=undefined && _id !=null){
    var res=await db.collection('order')
    .where({_id:_id})
    .update({
      data:data
    })
    return res
  }
  return {'success':false}
}