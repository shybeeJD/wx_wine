const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var id = event._id
  try{
    const transaction = await db.startTransaction()
    const _ =db.command
    var res = await transaction.collection('order').where({_id: id,status:5}).get()
    console.log(res.data.length)
    for(var i=0;i<res.data.length;i++){
      var order= res.data[i]
      console.log(order)
      await transaction.collection('order').where({
        _id:order._id
      }).update({
        data:{
          status:4
        }
      })
      for(var key in order.goods){
        await transaction.collection('wine')
        .where({_id:key})
        .update({data:{stock:_.inc(order.goods[key].num)}})
        console.log(res)
      }
    }
    await transaction.commit()
    return {success:true}
  }
  catch(e){
    console.log(e)
    return {success:false,msg:e}
  }
  
}