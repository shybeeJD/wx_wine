const cloud = require('wx-server-sdk')

cloud.init({
  env: "shybeejd-5gv8sqyv03b56093"
})
const db = cloud.database()

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {

  try {
    await db.collection('message').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
       user:event.user,
       msg:event.msg,
      },
    })
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }
}