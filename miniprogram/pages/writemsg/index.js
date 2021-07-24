var nr = '';
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    envId: '',
    msg:'',
 
    msgData:
    [
      {
        msg:
        "泡澡水不要太热。"
      },//双引号
      {
        msg:
        "面部比较干，想补个水。"
      },
      {
        msg:
        "我只有2小时，您看着安排吧。"
      },
      {
        msg:
        "我想把眉毛在修下。"
      },
      {
        msg:
        "给我清个痘痘。"
      },
      {
        msg:
        "头疼，能轻点按。"
      }
    ],
    neirong: '',
 
  },
 
  clickMe: function (e) {
    var that = this;
    console.log(e);
    nr = e.currentTarget.dataset.nr;
    that.setData({
      neirong: nr
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      envId: options.envId
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
  subMsg: function (){
    console.log(this.data.envId)
    wx.showLoading({
      title: '',
    })
    this.data.user='shybee'
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'writeMsg',
        msg: this.data.msg,
        user:this.data.user,
      }
    }).then((resp) => {
      wx.navigateTo({
        url: `/pages/updateRecordSuccess/index`,
      })
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  },

  bindInput (e) {


    var msg=e.detail.value

    this.setData({
      msg
    })
  },
})
