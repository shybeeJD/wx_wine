// pages/order/bill/bill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billClass: 1,
    billContent: 1,
    riseClass: 2,
    riseName: null,
    company: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      riseClass: type
    })
  },
  inputRiseName: function (e) {
    this.setData({
      riseName: e.detail.value
    })
  },
  inputCompany: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  Submit: function (params) {
    
  }
})