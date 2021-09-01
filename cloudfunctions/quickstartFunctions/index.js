const getOpenId = require('./getOpenId/index')
const getMiniProgramCode = require('./getMiniProgramCode/index')
const createCollection = require('./createCollection/index')
const selectRecord = require('./selectRecord/index')
const updateRecord = require('./updateRecord/index')
const sumRecord = require('./sumRecord/index')
const writeMsg = require('./writeMsg/index')
const login = require('./login/index')
const getAllWine = require('./selectMethods/getAllWine/index')
const selectIcon = require('./selectMethods/selectIcon/index')
const getOrderInfo =require('./selectMethods/getOrderInfo/index')

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
    case 'writeMsg':{
      return await writeMsg.main(event, context)
    }
     
  }
}
