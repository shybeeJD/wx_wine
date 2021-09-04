const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  var shopLatitude = event.shopLatitude
  var shopLongitude = event.shopLongitude
  var addressLatitude = event.addressLatitude
  var addressLongitude = event.addressLongitude
  var La1 = shopLatitude * Math.PI / 180.0;
  var La2 = addressLatitude * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = shopLongitude * Math.PI / 180.0 - addressLongitude * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
  
  return {distance:s}

}