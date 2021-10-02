// pages/order/bill/bill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billClass: 1,
    billContent: 1,
    riseClass: 1,
    riseName: "个人",
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
    // console.log(type);
    this.setData({
      billClass: type
    })
  },
  billContent: function (e) {
    let type = e.currentTarget.dataset.type
    // console.log(type);
    this.setData({
      billContent: type
    })
  },
  riseClass: function (e) {
    let type = e.currentTarget.dataset.type
    let riseName = e.currentTarget.dataset.riseName
    console.log(e);
    this.setData({
      riseClass: type,
      riseName: riseName,
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

  Submit: function (params) {
    let header = this.data.riseName
    let tax = this.data.tax

    if (this.data.riseClass == 1) {
      this.updateBill(header, tax)
    } else {
      if (header == "" || tax == "") {
        wx.showToast({
          title: '请检查您的输入',
          icon: 'error',
          duration: 2000
        })
      } else {
        this.updateBill(header, tax)

      }
    }
  },
  updateBill: function (header, tax) {
    let app = getApp()
    let orderID = this.data.orderID
    if (tax == "") {
      wx.cloud
        .callFunction({
          name: "quickstartFunctions",
          config: {
            env: app.enId,
          },
          data: {
            type: "updateBill",
            _id: orderID,
            header: header
          },
        }).then((resp) => {
          // console.log(resp.result)

          wx.showModal({
            title: '申请成功',
            content: '请等待商家确认,现在将返回上一级页面',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

        })
        .catch((e) => {
          console.log(e);
          wx.showToast({
            title: '出错了',
            icon: 'error',
            duration: 2000
          })
        });
    } else {
      wx.cloud
        .callFunction({
          name: "quickstartFunctions",
          config: {
            env: app.enId,
          },
          data: {
            type: "updateBill",
            _id: orderID,
            header: header,
            tax: tax
          },
        }).then((resp) => {
          // console.log(resp.result)
          wx.showModal({
            title: '申请成功',
            content: '请等待商家确认,现在将返回上一级页面',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

        })
        .catch((e) => {
          console.log(e);
          wx.showToast({
            title: '出错了',
            icon: 'error',
            duration: 2000
          })
        });
    }

  }
})