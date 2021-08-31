Page({
    data: {
        rightDataSource: [
            //字符
            
        ],
        //rightDataSourceAll:[],
        leftDataSource: ["啤酒", "葡萄酒"], //字符
        allDataSouce: null,
        leftListSelectItem: 0, //字符
        rightItemWidth: 0,
        envId: "",
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var app = getApp();
        this.setData({
            envId: app.globalData.envId,
        });
        this.getAllwines();
        this.requestDataFromServe();
        this.renderControl();
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        this.updataRightData();
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    // 用户点击右上角分享
    onShareAppMessage: function () {
        return {
            title: "酒运达", // 分享标题
            desc: "酒运达，即刻达达，喝酒就上酒运达", // 分享描述
            path: "http://www.masyang.com", // 分享路径
        };
    },
    // 渲染控制
    renderControl: function () {
        var app = getApp();
        var width = app.globalData.systemInfo.windowWidth - 75.0;
        this.setData({
            rightItemWidth: width,
        });
    },

    // 跳转到商品详情
    pushGoodDetail: function (tap) {
        var index = tap.currentTarget.id;
        var good = this.data.rightDataSource[index];
        wx.navigateTo({
            url:
                "../shopDetail/shopDetail?product_id=" +
                good.id +
                "&title=" +
                good.title,
            success: function (res) {},
            fail: function () {},
            complete: function () {},
        });
    },

    getAllwines: function(){
        var app = getApp();
        console.log(app.globalData)
        console.log(app.globalData.userInfo)
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            config: {
              env: app.globalData.envId
            },
            data: {
              type: 'getAllWine',
              userInfo:app.globalData.userInfo
            }
          }).then((resp) => {
              console.log(resp.result)
        
            this.updateData(resp.result)
            wx.hideLoading()
          }).catch((e) => {
            console.log(e)
            
            wx.hideLoading()
          })
          this.updataRightData();
            
    },
    // 右侧列表被点击
    rightListClick(par) {
        //更新rightdatasource
        var index = parseInt(par.currentTarget.id);
        this.setData({
            leftListSelectItem: index,
        });
        this.updataRightData();
    },
    //更新右侧数据
    updataRightData: function () {


        if (this.data.allDataSource == null) {
            return;
        }
        var selectClassStr =
            this.data.leftDataSource[this.data.leftListSelectItem];
        var selectData = new Array();
        var app = getApp();
        for (var index in this.data.allDataSource) {
            var good = this.data.allDataSource[index];
            if (good.category_name == selectClassStr) {
                var tempGood = app.globalData.shopCarGoods[good.id];
                if (tempGood != null) {
                    good["buy"] = tempGood.buy;
                }
                selectData.push(good);
            }
        }
        this.setData({
            rightDataSource: selectData,
        });
    },
    // 减少商品
    reduceImageClick(par) {
        var index = parseInt(par.currentTarget.id);
        var data = this.data.rightDataSource[index];
        if (data.buy > 0) {
            data.buy -= 1;
            this.setData({
                rightDataSource: this.data.rightDataSource,
            });
        }

        var app = getApp();
        app.reduceGoodFromShopCar(data);

        // 调用自定义组件中的方法,更新底栏购物车
        let myComponent = this.selectComponent("#myComponent");
        myComponent.getShopCarGoods();
    },
    // 添加商品
    addImageDidClick(par) {
        // console.log(par)
        // 获取点击的商品索引
        var index = parseInt(par.currentTarget.id);
        // 在右侧数据里搜索对应索引的商品
        var data = this.data.rightDataSource[index];
        console.log(data)
        // 比较是否超过库存
        if (data.buy < data.stock) {
            data.buy += 1;
        } else {
            wx.showToast({
                title: "库存不足",
                duration: 2000,
            });
            return;
        }
        this.setData({
            rightDataSource: this.data.rightDataSource,
        });

        var app = getApp();
        console.log(data)
        app.addGoodToShopCar(data);

        // 调用自定义组件中的方法,更新底栏购物车
        let myComponent = this.selectComponent("#myComponent");
        myComponent.getShopCarGoods(); // 调用自定义组件中的方法
    },

    // 获取数据

    requestDataFromServe() {
        var that = this;
        wx.showLoading({
            title: "",
        });
        // console.log(this.data.envId);
        // 从云函数获取数据
        // wx.cloud.callFunction({
        //   name: 'quickstartFunctions',
        //   config: {
        //     env: this.data.envId
        //   },
        //   data: {
        //     type: 'getAllWine',
        //     userInfo:{
        //       openId:'ojVpU5XXun_ZlsmtOJKIJktiTNjc'
        //     }
        //   }
        // }).then((res) => {
        //   console.log("res.result")
        //   console.log(res.result)
        //   that.updateData(res.result);
        wx.hideLoading();
        // }).catch((e) => {
        //   console.log(e)
        // })
    },
    //更新数据
    updateData: function (data) {
        //更新左侧数据
        var leftData = new Array();
        for (var i=0; i<data.category_contitions.length;i++) {
            
            leftData.push(data.category_contitions[i]);
        }
        this.setData({
            leftDataSource: leftData,
        });
        //更新右侧数据
        var allData = new Array();
        for (var index in data.product_list) {
            var good = data.product_list[index];
            console.log(data.product_list);
            good.buy = 0;
            allData.push(good);
        }
        this.setData({
            allDataSource: allData,
        });
        this.updataRightData();
    },
});
