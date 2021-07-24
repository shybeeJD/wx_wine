const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果

  console.log(event)
  var wine=''
  var shopCar=''
  shopCar= db.collection('shopCar').where({
    user:event.userInfo.openId
  })
  .get({
    //若成功获取,异步操作注意异常
    success: res=>{
        //打印记录中第一条里goodName属性
        console.log(res)
        shopCar=res.data
    }
})
  db.collection('wine').get({
    //若成功获取,异步操作注意异常
    success: res=>{
        //打印记录中第一条里goodName属性
        console.log(res)
        wine=res.data
    },
    fail: function(res){
      console.log(res)
    },
    complete: function(res){
      console.log(res)
    }
})
  console.log(wine)
  console.log(shopCar)
  for (var i in wine) {
    for(var j in shopCar){
      if (j['wine']==i['_id']){
        i['buy']=j['buyCount']
      }else{
        i['buy']=0
      }
    }
    }
    var data={}
    data['product_list']=wine
    data['category_contitions']={
      test:[{
        category_name:'啤酒'
      }]
    }
  return data
}