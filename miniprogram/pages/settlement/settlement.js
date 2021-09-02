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
    freight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.getFreight()
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
  getFreight:function(){
    wx.cloud.callFunction({
      name: "quickstartFunctions",
      config: {
        env: this.data.envId,
      },
      data: {
        type: "getFreight",
      },
    }).then((resp) => {
      this.setData({
        freight:resp.result.data[0].price
      })
      console.log(resp.result.data[0].price)
    }).catch((e) => {
      console.log(e);

      wx.hideLoading();
    });

  },
  createOrder: function (event) {
    let goods = {}
    for (let i in this.data.goodsList) {
      let i_id = this.data.goodsList[i]._id
      let i_buy = this.data.goodsList[i].buy
      goods[i_id] = i_buy
    }

    wx.cloud.callFunction({
        name: "quickstartFunctions",
        config: {
          env: this.data.envId,
        },
        data: {
          type: "createOrder",
          // goods: {
          //   "79550af260fb6de22905a79f046fe0c9": 1,
          // }, //购物车商品,key为wine._id, value为购买数量
          goods: goods,
          delivery_price: 5,
          address: "asdfasdfasdf",
          discount: 2,
          packingsPrice: 0,
        },
      }).then(res => {
        // todo:该写提交订单成功后的操作了,弹窗提示并跳转到待支付页面
        console.log(res.result)
        
      })
      .catch(console.error)
  },

  selectAddress: function () {
    wx.navigateTo({
      url: '../address/selectAddress',
    })
  },
  updateAdress: function () {

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
        if (address_item.default==true) {
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
    let pack=0
    for (let i in goodsList) {
      console.log(goodsList[i].packingsPrice)
      p += goodsList[i].price * goodsList[i].buy
      pack += goodsList[i].packingsPrice * goodsList[i].buy
    }
    console.log(this.data.freight)
    this.setData({
      goodsList: goodsList,
      packingsPrice:pack,
      totalPrice: p
    })
  }
});