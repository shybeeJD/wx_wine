const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  if (!event.save){
    console.log(event.userInfo.openId)
    return await db.collection('users').where({
      openId: event.userInfo.openId,
    }).get({
      success: function(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        return res.data
      },
     
    })
  }else{
    console.log(event)
    data=Object.assign(event.userInfoDetial,event.userInfo)
    console.log(data)
    await db.collection('todos').where({
      openId: event.userInfo.openId
    }).remove()
    await db.collection('users').add({
      // data 字段表示需新增的 JSON 数据
      data: data,
      success: function(res){
        console.log(res)
      },
      fail: function(err){
        console.log(err)
      }
    })
    var res={
      success:'ok'
    }
    return res
  }

 

  
}
