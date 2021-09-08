Page({
  data:{
    "carousel_list" : [{img:'../resource/logintop.png'}
        ],//轮播头信息
    "icon_list" : [{
      name:'啤酒',
      pic:"../resource/beer.png"
    },
    {
      name:'白酒',
      pic:"../resource/rice-wine.png"
    },
    {
      name:'葡萄酒',
      pic:"../resource/wine.png"
    },
    {
      name:'洋酒',
      pic:"../resource/yangjiu.png"
    },
  
  ], //icon
    "sec_kill_round_info" : null,//秒杀
    "host_good_list":null,//热卖商品列表
    "style":{
          "host_good_image_width":0,//商品主图宽
          "host_good_back_width":0,//商品背景宽
          "host_good_back_height":0,//商品背景高
    },
    tmpBuyNum:1,
    tmpNormal:1,
  },
  onLoad:function(options){
    // 获取轮播图等信息
    this.getDataFromServer();
    this.renderControl();
    var app =getApp()
    if (app.globalData.shopNow){
      this.getHostGoodList()
    }else{
      app.homeCallback= (shopNow) => {
        this.getHostGoodList()
      }
    }
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    this.dataControl(this.data.host_good_list);
    var app =getApp()
    console.log(app.globalData)
    if(app.globalData.shopNow){
      this.setData({
        shopNow:app.globalData.shopNow
      })
    }
    else{
      app.shopNowCallback = (shopNow) => {
        this.setData({ 
          shopNow:shopNow
        })
    }
  }
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '酒运达', // 分享标题
      desc: '酒运达，即刻达达，喝酒就上酒运达', // 分享描述
      path: 'http://www.masyang.com' // 分享路径
    }
  },
  // 轮播头被点击
  scrollimageclick:function(tap){
    var id = parseInt(tap.currentTarget.id);
    var data = this.data.carousel_list[id];
    if(data.event_mark == 3){
      wx.navigateTo({
        url: '../group/group?title=' + data.product_group_title + '&par=' + data.event_memo,
        success: function(res){
        },
        fail: function() {
        },
        complete: function() {
        }
      })
      return;
    }
    wx.showToast({
      title:"对不起暂无此专区",
      duration:350,
    })
  },
  changeShop:function(){
    wx.navigateTo({
      url: '../shopList/shopList',
    })
  },
  // 跳转到商品详情
  pushGoodDetail:function(tap){
    var index = tap.currentTarget.id;
    var good = this.data.host_good_list[index];
    wx.navigateTo({
      url: '../shopDetail/shopDetail?good='+ JSON.stringify(good),
      success: function(res){
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
// 添加按钮被点击
  addButtonClick:function(tap){
    var id = parseInt(tap.currentTarget.id);
    var good = this.data.host_good_list[id];
    if(good.buy < good.stock){
        good.buy ++ ;
    }else{
      wx.showToast({
        title:"库存不足",
        duration:350,
      })
      return;
    }
    this.setData({
      "host_good_list":this.data.host_good_list
    })
    var app = getApp();
    app.addGoodToShopCar(good)
  },
  // 减少按钮被点击
  reduceButtonClick:function(tap){
    var id = parseInt(tap.currentTarget.id);
    var good = this.data.host_good_list[id];
    if(good.buy >= 1){
        good.buy -- ;
    }
    this.setData({
      "host_good_list":this.data.host_good_list
    })
    var app = getApp();
    app.reduceGoodFromShopCar(good)
  },

  // 组件控制
  renderControl:function(){
    var app = getApp();
    var goodImageWidth =  (app.globalData.systemInfo.windowWidth - 5) / 2.0;
    var host_good_back_width = app.globalData.systemInfo.windowWidth / 2.0 - 2.5; 
    var host_good_back_height = host_good_back_width + 95;
    this.setData({
      "host_good_image_width":goodImageWidth,
      "host_good_back_width" : host_good_back_width,
      "host_good_back_height":host_good_back_height,
    })
  },
  //获取数据从服务器器
  getDataFromServer:function(){
      var app = getApp();
      var that = this;

      that.getCarouselIcon();
      app.getUserBid(function(re){
        console.log("call")
        that.getCarouselIcon();
        //that.getHostGoodList(re);
      })
  },
  // 获取轮播图，iconn 信息
  getCarouselIcon:function(){
    var that = this;
    wx.cloud.init()
    wx.showLoading({
      title: '',
    })
    /*
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: 'shybeejd-5gv8sqyv03b56093'
      },
      data: {
        type: 'selectIcon'
      }
    }).then((resp) => {
      this.setData({
        "icon_list": resp.result.data
      })
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
    */
       wx.request({
          url: 'http://www.jiuyunda.net:90/api/v2/home_page/index',
          data: {
            "userinfo_id":"",
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            for(var i = 0 ; i < res.data.carousel_list.length; i ++){
              var obj = res.data.carousel_list[i];
              obj.img = "http://www.jiuyunda.net:90" + obj.img;
            }
              that.setData({
              "carousel_list" : res.data.carousel_list,
              "icon_list" : res.data.icon_list,
              "sec_kill_round_info" : res.data.sec_kill_round_info
            })
          },
          fail: function() {
          },
          complete: function() {
          }
    });
    wx.hideLoading()
  },///获取轮播图 icon信息
  // 获取热卖商品列表
  getHostGoodList:function(re){
    var app = getApp();
    var that=this
    // console.log(app.globalData)
    // console.log(app.globalData.userInfo)
    wx.cloud.callFunction({
            name: "quickstartFunctions",
            config: {
                env: app.globalData.envId,
            },
            data: {
                type: "getAllWine",
                userInfo: app.globalData.userInfo,
                shopNow:that.data.shopNow._id,
                num:30,
                offset:0,
                recommend:true
            },
        })
        .then((resp) => {
            console.log(resp.result);
            this.setData({
              host_good_list:resp.result.product_list.concat(resp.result.product_list)
            })
            wx.hideLoading();
        })
        .catch((e) => {
            console.log(e);
            wx.hideLoading();
        });
  },/// 获取热卖商品列表
  openDetail:function(par){
    this.showModal()
    var index = parseInt(par.currentTarget.id);
    // 在右侧数据里搜索对应索引的商品
    this.setData({
        selectedWineindex:index,
    })
},
showModal: function () {
  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
    showModalStatus: true
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  }.bind(this), 200)
},
hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
  }.bind(this), 200)
},
plus:function(){
  var index=this.data.selectedWineindex
  // 在右侧数据里搜索对应索引的商品
  var tmpbuy=this.data.tmpBuyNum
  var tmpnormal=this.data.tmpNormal
  var data = this.data.host_good_list[index];
  if (tmpbuy< data.stock) {
      tmpbuy += 1;
      tmpnormal +=1;
  } else {
      wx.showToast({
          title: "库存不足",
          duration: 2000,
      });
      return;
  }
  this.setData({
      tmpBuyNum:tmpbuy,
      tmpNormal:tmpnormal
  })
  console.log(this.data.tmpNormal)
},
minus:function(){
  var tmpbuy=this.data.tmpBuyNum
  var tmpnormal=this.data.tmpNormal
  if (tmpbuy >0){
      tmpbuy -=1;
  }
  if(tmpnormal >0){
      tmpnormal -=1;
  }
  this.setData({
      tmpBuyNum:tmpbuy,
      tmpNormal:tmpnormal
  })
},
changeSlider:function(e){
  this.setData({
      tmpNormal: e.detail.value 
  })
},
confirm:function(){
  var index=this.data.selectedWineindex
  // 在右侧数据里搜索对应索引的商品
  var tmpBuyNum=this.data.tmpBuyNum
  var tmpNormal=this.data.tmpNormal
  this.data.host_good_list[index].buy=tmpBuyNum
  this.data.host_good_list[index].normal=tmpNormal
  this.setData({
    tmpBuyNum:1,
    tmpBuy:1
  })
  var data= this.data.host_good_list[index]
  console.log(data)
  this.hideModal()

  var app = getApp();
  app.addGoodToShopCar(data,true);

  // 调用自定义组件中的方法,更新底栏购物车
  
  
},
  redirectToWine:function(e){
    var app =getApp()
    app.globalData.cate=e.currentTarget.dataset.id
    wx.switchTab({
      url: '../../pages/category/category',
    })
  },
  dataControl:function(data){
    if(data == null){
      return;
    }
    var app = getApp();
    for(var i = 0 ; i < data.length;i++){
      var good = data[i];
      var tempGood = app.globalData.shopCarGoods[good.id];
      if(tempGood != null){
        good["buy"] = tempGood.buy;
      }else{
        good["buy"] = 0;
      }
    }
    this.setData({
        "host_good_list":data
    })
  }
})