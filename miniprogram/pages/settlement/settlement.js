// pages/settlement/settlement.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    envId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      envId: app.globalData.envId,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  createOrder: function (event) {
    wx.cloud.callFunction({
        name: "quickstartFunctions",
        config: {
          env: this.data.envId,
        },
        data: {
          type: "createOrder",
          goods: {
            "79550af260fb6de22905a79f046fe0c9": 1,
          }, //购物车商品,key为wine._id, value为购买数量
          delivery_price: 5,
          address: "asdfasdfasdf",
          discount: 2,
          packingsPrice: 0,
        },
      }).then(res => {
        console.log(res.result) 
      })
      .catch(console.error)
  },
});