// miniprogram/pages/address/addressList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //addressList=[],
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
    this.getAddress()
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
  addAddress: function () {
    wx.redirectTo({
      url: 'address',
    })
  },
  editAddress: function (e) {
    var id = e.currentTarget.dataset.id
    var address = this.data.addressList[id]
    console.log(address)
    wx.redirectTo({
      url: 'address?current=' + JSON.stringify(address),
    })
  },
  delAddress: function (e) {
    var id = e.currentTarget.dataset.id
    var address = this.data.addressList[id]
    console.log(address)
    this.data.addressList.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    this.setData({
      addressList: this.data.addressList
    })
    var app = getApp()
    wx.cloud.callFunction({
        name: "quickstartFunctions",
        config: {
          env: app.globalData.envId,
        },
        data: {
          type: "deleteAddress",
          _id: address._id
        },
      })
      .then((resp) => {
        console.log(resp.result)

      })
      .catch((e) => {
        console.log(e);

        wx.hideLoading();
      });
  },
  getAddress: function () {
    var app = getApp()
    console.log(app.globalData)
    wx.cloud.callFunction({
        name: "quickstartFunctions",
        config: {
          env: app.globalData.envId,
        },
        data: {
          type: "getAddress",
          shopLatitude:app.globalData.shopNow.location.coordinates[1],
          shopLongitude:app.globalData.shopNow.location.coordinates[0],
        },
      })
      .then((resp) => {
        console.log(resp.result)
        this.setData({
          addressList: resp.result.list
        })
        console.log(this.data.addressList)
      })
      .catch((e) => {
        console.log(e);

        wx.hideLoading();
      });
  },
  setAddress: function (e) {
    console.log( e)
    wx.setStorageSync("address_id", e.currentTarget.dataset.id)
    wx.navigateBack()
  }
})