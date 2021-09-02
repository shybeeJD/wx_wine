
const cloud = require('wx-server-sdk')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  var userInfo=cloud.getWXContext()

  await db.collection('address').where({
    userId:userInfo.OPENID,
    _id:event._id
  })
  .remove({
    success: function(res) {
      return res.data
    }
  })
}
