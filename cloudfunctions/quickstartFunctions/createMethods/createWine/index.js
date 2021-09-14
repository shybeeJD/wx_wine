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
  data={
    brand:event.brand,
    category_name:event.category_name,
    marketPrice:event.marketPrice,
    item:event.item,
    origin:event.origin,
    packingsPrice:event.packingsPrice,
    pic_array:event.pic_array,
    price: event.price,
    shop:event.shop,
    specification:event.specification,
    stock:event.stock,
    thumb_url:event.thumb_url,
    title:event.title,
    product_desc_url:event.product_desc_url,
    recommend:event.recommend
  }
  if (event._id !=undefined && event._id!=null){

    return await db.collection('wine')
    .where({
      _id:event._id
    })
    .update({
      data:data
    })
  }
  data['sale_count']=0
  return await db.collection('wine').add({
    // data 字段表示需新增的 JSON 数据
    data: data
  })

}