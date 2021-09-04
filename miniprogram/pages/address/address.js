// miniprogram/pages/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    region: ["北京市", "北京市", "东城区"],
    storeAddress:null,
    consigneeName: "", 
    phone: "",
    consigneeRegion: "",
    detailedAddress: "",
    labelList: ["家", "公司", "学校"],            //标签
    labelDefault: 0,              // 标签默认,
    isChecked:false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.current)
    console.log(data)
    this.setData({
      _id:data._id,
      region:data.region,
      consigneeName:data.receiver,
      phone:data.phone,
      detailedAddress:data.detail,
      labelDefault:data.label ,
      storeAddress:{province:data.region[0],city:data.region[1],
        district:data.region[2],title:data.title}
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
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation

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
  consigneeNameInput: function(e) {
    
    this.setData({
      consigneeName: e.detail.value
    })
  },
  phoneInput: function(e) {
    
    this.setData({
      phone: e.detail.value
    })
  },
  consigneeRegionInput: function (e) {
   
    this.setData({
      consigneeRegion: e.detail.value
    })
  },
  detailedAddressInput: function (e) {
    this.setData({
      detailedAddress: e.detail.value
    })
  },
  changeSwitch:function(e){
    this.setData({
      isChecked:e.detail.value
    })
      console.log(this.data.isChecked)
  },


  select: function (e) {
    // 如果已经显示，不在执行显示动画
    if (this.data.addressMenuIsShow) {
      return false
    } else {
      // 执行显示动画
      this.startAddressAnimation(true)
    }
  },
  chooseLabelSelect: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      labelDefault: index
    })
  },
  startAddressAnimation: function (isShow) {
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      this.animation.translateY(0 + 'vh').step()
    } else {
      this.animation.translateY(40 + 'vh').step()
    }
    this.setData({
      animationAddressMenu: this.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var consigneeRegion = that.data.provinces[value[0]].name + '-' + that.data.citys[value[1]].name + '-' + that.data.areas[value[2]].name
    that.setData({
      consigneeRegion: consigneeRegion,
    })
  },
  changeRegin: function(e){
    this.setData({ region: e.detail.value });
  },
  // 处理省市县联动逻辑
  changeAddress:function(e){
    wx.navigateTo({
      url: '../shopMap/shopMap',
    })
  },

  submit: function() {
    var consigneeName = this.data.consigneeName;
    console.log(consigneeName)
    var phone = this.data.phone;
    console.log(phone)
    var region = this.data.region;

    var detailedAddress = this.data.detailedAddress
    console.log(detailedAddress)
    if (consigneeName == "") {
      wx: wx.showToast({
        title: '请输入姓名',
        image: "../../../img/icon/icon-reminder.png"
      })
      return false
    }
    else if (phone == "") {
      wx: wx.showToast({
        title: '请输入手机号码',
        image: "../../../img/icon/icon-reminder.png"
      })
      return false
    }
    else if (this.data.storeAddress == null) {
      wx: wx.showToast({
        title: '请选择所在地区',
        image: "../../../img/icon/icon-reminder.png"
      })
      return false
    }
    else if (detailedAddress == "") {
      wx: wx.showToast({
        title: '请输入详细地址',
        image: "../../../img/icon/icon-reminder.png"
      })
      return false
    }
    else {
      var app =getApp()
      var region = [this.data.storeAddress.province,this.data.storeAddress.city,this.data.storeAddress.district]
      wx.cloud.callFunction({
                  name: "quickstartFunctions",
                  config: {
                      env:app.globalData.envId,
                  },
                  data: {
                      type: "createAddress",
                      _id:this.data._id,
                      receiver:consigneeName,
                      phone:phone,
                      region:region,
                      detail:detailedAddress,
                      default:this.data.isChecked,
                      label:this.data.labelList[this.data.labelDefault],
                      latitude:this.data.storeAddress.latitude,
                      longitude:this.data.storeAddress.longitude,
                      title:this.data.storeAddress.title,

                  },
              }) .then((resp) => {
          wx.redirectTo({
            url: 'addressList',
          })
         
            })
      .catch((e) => {
          console.log(e);
  
          wx.hideLoading();
      });
        
    }
  },


})