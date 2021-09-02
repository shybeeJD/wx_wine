// pages/settlement/settlement.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    envId: null,
    address: null,
    goodsList: null,
    totalPrice: null,
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
  onShow: function () {
    this.updateAdress();
    this.updateGoods();
  },

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
    let goods = []
    for (let i in this.data.goodsList) {
      // todo: 提交订单
      let asd = this.data.goodsList[i]._id
      let i_buy = this.data.goodsList[i].buy
      let i_info = {
        asd: i_buy
      }
      goods.push(i_info)
    }
    console.log("-------------------------");




    // wx.cloud.callFunction({
    //     name: "quickstartFunctions",
    //     config: {
    //       env: this.data.envId,
    //     },
    //     data: {
    //       type: "createOrder",
    //       goods: {
    //         "79550af260fb6de22905a79f046fe0c9": 1,
    //       }, //购物车商品,key为wine._id, value为购买数量
    //       delivery_price: 5,
    //       address: "asdfasdfasdf",
    //       discount: 2,
    //       packingsPrice: 0,
    //     },
    //   }).then(res => {
    //     console.log(res.result)
    //   })
    //   .catch(console.error)
  },

  selectAddress: function () {
    wx.navigateTo({
      url: '../address/selectAddress',
    })
  },
  updateAdress: function () {
    let address_id = wx.getStorageSync("address_id")
    console.log(wx.getStorageSync("address_id"));

    wx.cloud.callFunction({
      name: "quickstartFunctions",
      config: {
        env: this.data.envId,
      },
      data: {
        type: "getAddress",
      },
    }).then((resp) => {
      for (let i in resp.result.data) {
        let address_item = resp.result.data[i]
        if (address_item._id == address_id) {
          this.setData({
            address: address_item
          })
        } else {
          console.log("未成功找到缓存中的地址id");
        }
      }
      console.log(this.data.addressList)
    }).catch((e) => {
      console.log(e);

      wx.hideLoading();
    });


  },
  updateGoods: function () {
    let goodsList = wx.getStorageSync("cart")


    let p = 0
    for (let i in goodsList) {
      p += goodsList[i].price * goodsList[i].buy
    }
    this.setData({
      goodsList: goodsList,
      totalPrice: p
    })
  }
});