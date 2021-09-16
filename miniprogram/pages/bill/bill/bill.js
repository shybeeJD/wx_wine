// pages/order/bill/bill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billClass: 1,
    billContent: 1,
    riseClass: 1,
    riseName: "",
    tax: "",
    orderID: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderID: options._id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  billType: function (e) {
    let type = e.currentTarget.dataset.type
    console.log(type);
    this.setData({
      billClass: type
    })
  },
  billContent: function (e) {
    let type = e.currentTarget.dataset.type
    console.log(type);
    this.setData({
      billContent: type
    })
  },
  riseClass: function (e) {
    let type = e.currentTarget.dataset.type
    console.log(type);
    this.setData({
      riseClass: type,
      riseName: "个人",
      tax: ""
    })
  },
  inputRiseName: function (e) {
    this.setData({
      riseName: e.detail.value
    })
  },
  tax: function (e) {
    this.setData({
      tax: e.detail.value
    })
  },

  // #todo:申请开票出错
  Submit: function (params) {
    let header = this.data.riseName
    let tax = this.data.tax
    this.updateBill(header)
  },
  updateBill: function (header, tax) {
    let app = getApp()

    if (tax == "") {
      wx.cloud
        .callFunction({
          name: "quickstartFunctions",
          config: {
            env: app.enId,
          },
          data: {
            type: "updateBill",
            _id: this.data.orderId,
            header: header
          },
        })
    } else {
      wx.cloud
        .callFunction({
          name: "quickstartFunctions",
          config: {
            env: app.enId,
          },
          data: {
            type: "updateBill",
            _id: this.data.orderId,
            header: header,
            tax: tax
          },
        })
    }

  }
})