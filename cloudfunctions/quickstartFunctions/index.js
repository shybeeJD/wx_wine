const getOpenId = require('./getOpenId/index')
const getMiniProgramCode = require('./getMiniProgramCode/index')
const createCollection = require('./createCollection/index')
const selectRecord = require('./selectRecord/index')
const updateRecord = require('./updateRecord/index')
const sumRecord = require('./sumRecord/index')
const writeMsg = require('./writeMsg/index')
const login = require('./login/index')
const getAllType= require('./selectMethods/getAllType/index')
const getAllWine = require('./selectMethods/getAllWine/index')
const selectIcon = require('./selectMethods/selectIcon/index')
const getOrderInfo =require('./selectMethods/getOrderInfo/index')
const createOrder = require('./createMethods/createOrder/index')
const closeOrder = require('./updateMethods/closeOrder/index')
const createAddress =require('./createMethods/createAddress/index')
const getAddress = require('./selectMethods/getAddress')
const deleteAddress =require('./deleteMethods/deleteAddress')
const getFreight =require ('./selectMethods/getFreight/index')
const updateStatus = require('./updateStatus/index')
const createWine = require('./createMethods/createWine/index')
const refuseOrder =require ('./updateMethods/refuseOrder/index')
const createShop  =require('./createMethods/createShop/index')
const getShop = require('./selectMethods/getShop/index')
const computeDistance = require('./selectMethods/computeDistance')
const changeOrderStatus =require('./updateMethods/changeOrderStatus/index')
const updateBill = require('./updateMethods/updateBill/index')
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.type)
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context)
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context)
    case 'createCollection':
      return await createCollection.main(event, context)
    case 'selectRecord':
      return await selectRecord.main(event, context)
    case 'updateRecord':
      return await updateRecord.main(event, context)
    case 'sumRecord':
      return await sumRecord.main(event, context)
    case 'login':
      return await login.main(event, context)
    case 'getAllType':
      return await getAllType.main(event,context)
    case 'selectIcon':
      return await selectIcon.main(event, context)
    case 'getAllWine':
      return await getAllWine.main(event, context)
    case 'selectWineItems':
      return await selectWineItems.main(event,context)
    case 'selectWinTypes':
      return await selectWinTypes.main(event,context)
    case 'getOrderInfo':
      return await getOrderInfo.main(event,context)
    case 'createOrder':
      return await createOrder.main(event,context)
    case 'createAddress':
      return await createAddress.main(event,context)
    case 'getAddress':
      return await getAddress.main(event,context)
    case 'closeOrder':
      return await closeOrder.main(event,context)
    case 'deleteAddress':
      return await deleteAddress.main(event,context)
    case 'getFreight':
      return await getFreight.main(event,context)
    case 'updateStatus':(event,context)
      return await updateStatus.main(event,context)
    case 'createWine':
      return await createWine.main(event,context)
    case 'refuseOrder':
      return await refuseOrder.main(event,context)
    case 'updateBill':
      return await updateBill.main(event,context)
    case 'createShop':
      return await createShop.main(event,context)
    case 'getShop':
      return await getShop.main(event,context)
    case 'computeDistance':
      return computeDistance.main(event,context)
    case 'changeOrderStatus':
      return await changeOrderStatus.main(event,context)
    case 'writeMsg':{
      return await writeMsg.main(event, context)
    }
     
  }
}
