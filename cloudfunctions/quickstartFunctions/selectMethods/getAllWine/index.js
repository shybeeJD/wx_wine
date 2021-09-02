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

  var userInfo=cloud.getWXContext()

  wine=await db.collection('wine').get({
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
    data['test']="test"
    var type=await db.collection('winTypes').where({
      name:'type'
    }).get()
    console.log(type.data)
    var type_list=type.data[0]['type'].split(",")
    console.log(type_list)
    data['category_contitions']=type_list

    console.log(data)
  return data
}