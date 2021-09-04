const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ =db.command
function setTimeDateFmt(s) {  // 个位数补齐十位数
  return s < 10 ? '0' + s : s;
}

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var now=new Date()
  now.setMinutes(now.getMinutes()-15)
  console.log(now)
  const transaction = await db.startTransaction()
  var expire =await transaction.collection('order').where({
    status:5,
    addTime: _.lt(now),
  }).get()
  console.log(expire)
  for(var i=0;i<expire.data.length;i++){
    var order= expire.data[i]
    console.log(order)
    await transaction.collection('order').where({
      _id:order._id
    }).update({
      data:{
        status:6
      }
    })
    for(var key in order.goods){
      var res=await transaction.collection('wine')
      .where({_id:key})
      .update({data:{stock:_.inc(order.goods[key])}})
      console.log(res)
    }
  }
  await transaction.commit()
  return expire

}