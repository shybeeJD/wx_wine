const cloud = require('wx-server-sdk')
const updateStatus =require('../../updateStatus/index')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  await updateStatus.main(event,context)


  var wine=''

  var userInfo=cloud.getWXContext()
  if(event._id){
    wine=await db.collection('wine').where({
      _id:event._id
    }).get()
    var data={
      product_list:wine.data
    }
    return data
  }

  wine=await db.collection('wine').where({
    shop:event.shopNow,
    category_name:event.category,
    recommend:event.recommend
  }).limit(event.num).skip(event.offset).get({
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

 
    var data={}
    data['product_list']=wine.data
    data['category_contitions']=[]
 

    console.log(data)
  return data
}