const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
function setTimeDateFmt(s) {  // 个位数补齐十位数
  return s < 10 ? '0' + s : s;
}

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var userInfo=cloud.getWXContext()
  var now=new Date()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let hour = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  month = setTimeDateFmt(month)
  day = setTimeDateFmt(day)
  hour = setTimeDateFmt(hour)
  minutes = setTimeDateFmt(minutes)
  seconds = setTimeDateFmt(seconds)
  let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
  console.log(orderCode)

  var goods =event.goods
  const _ =db.command
  var success=1
  const transaction = await db.startTransaction()
  now.setMinutes(now.getMinutes()-15)
  console.log(now)
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
      .update({data:{stock:_.inc(order.goods[key].num)}})
      console.log(res)
    }
  }

    var wine=[]
    for(var key in goods){
      wine.push(key)
    }
    var result= await transaction.collection('wine')
    .where({
      _id:_.in(wine)
    }).get()
    console.log(result)
    var money=0
    var packaging=0
    for(var i=0;i<result.data.length;i++){
      good=result.data[i]
      console.log(good)
      if(good.stock<goods[good._id].num){
        success=0
        await transaction.rollback()
        return {
          success: false,
          msg: "库存不足"
        }
      }
      money=money+good.price*goods[good._id].num
      packaging=packaging+good.packingsPrice*goods[good._id].num
    }
    for(var key in goods){
      console.log("key: " + key + " ,value: " + goods[key]);
      var desc=-1*goods[key].num
      var res= await transaction.collection('wine')
      .where({_id:key})
      .update({data:{stock:_.inc(desc)}})
    }
    await transaction.commit()

  if (success){
    try {
      var f = await db.collection('winTypes').where({
        name:'freight'
      }).get()
      now.setMinutes(now.getMinutes()+15)
      console.log(f.data)
      // 创建集合
      data={
        status:5,
        userId:userInfo.OPENID,
        addTime:now,
        delivery_price:f.data[0].price,
        address: event.address,
        discount: event.discount,
        packingsPrice: packaging,
        paymentChannels:0,
        id:orderCode,
        goods:goods,
        money:money+packaging+f.data[0].price
      }
      var res = await db.collection('order').add({
        // data 字段表示需新增的 JSON 数据
        data: data
      })
      console.log(res)
  
    return {
      success: true,
      data:data,
      res:res,
    }
    } catch (e) {
      // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
      console.log(e)
      return {
        success: true,
        data: 'create collection success'
      }
    }
  }
 
  
}