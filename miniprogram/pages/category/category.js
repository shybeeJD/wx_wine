Page({
    data: {
        rightDataSource: [
            //字符
        ],
        //rightDataSourceAll:[],
        leftDataSource: ["啤酒","白酒","葡萄酒","洋酒"], //字符
        allDataSouce: null, 
        leftListSelectItem: 0, //字符
        rightItemWidth: 0,
        envId: "",
        showModalStatus:false,
        selectedWine:null,
        pageList:[],
        typeDataSource:[],
        page:0,
        pageSize:1,
    },
    onLoad: function (options) {
        var app = getApp();
        if(app.globalData.shopNow){
            this.setData({
                envId: app.globalData.envId,
                shopNow:app.globalData.shopNow,
                leftDataSource:app.globalData.shopNow.category.split(',')
            });
            for (var i = 0; i < this.data.leftDataSource.length; i++) {
                this.data.pageList.push(0)
                this.data.typeDataSource.push(null)
             }
            this.getAllwines();
            this.renderControl();
        }else{
            app.shopNowCallback = (shopNow) => {
                this.setData({ 
                    envId: app.globalData.envId,
                    shopNow:app.globalData.shopNow,
                    leftDataSource:app.globalData.shopNow.category.split(',')
                })
                for (var i = 0; i < this.data.leftDataSource.length; i++) {
                    this.data.pageList.push(0)
                    this.data.typeDataSource.push(null)
                 }
                this.getAllwines();
                this.renderControl();
            }
        }
       
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        var app = getApp()
        var cate= app.globalData.cate
        for(var i=0;i<this.data.leftDataSource.length;i++){
            if(this.data.leftDataSource[i]==cate){
                this.setData({
                    leftListSelectItem:i
                })
                break
            }
        }
        if(app.globalData.shopChanged){
            this.setData({
                envId: app.globalData.envId,
                shopNow:app.globalData.shopNow,
                leftDataSource:app.globalData.shopNow.category.split(',')
            });
            var list=[]
            var pageList=[]
            for(var i=0;i<this.data.leftDataSource.length;i++){
                list.push(null)
                pageList.push(0)
            }
            this.setData({
                typeDataSource:list,
                pageList:pageList
            })
            this.getAllwines()
            app.globalData.shopChanged=false
        }
        this.updataRightData();
        this.renderControl();
        if(app.globalData.shopNow){
            let myComponent = this.selectComponent("#myComponent");
            myComponent.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
        } else{
            app.shopNowCallback2 = (shopNow) => {
                this.setData({ 
                    shopNow:app.globalData.shopNow
                })
                let myComponent = this.selectComponent("#myComponent");
                myComponent.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
            }
            
        }
    
        // 调用自定义组件中的方法,更新底栏购物车
       
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


    // 跳转到商品详情
    pushGoodDetail: function (tap) {
        var index = tap.currentTarget.id;
        var good = this.data.typeDataSource[this.data.leftListSelectItem][index];
        wx.navigateTo({
            url:
                "../shopDetail/shopDetail?good=" +JSON.stringify(good),
            success: function (res) {},
            fail: function () {},
            complete: function () {},
        });
    },

    getAllwines: function () {
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
                    num:that.data.pageSize,
                    offset:that.data.pageList[that.data.leftListSelectItem]*that.data.pageSize,
                    category:that.data.leftDataSource[that.data.leftListSelectItem]
                },
            })
            .then((resp) => {
                console.log(resp.result);

                this.updateData(resp.result);
                wx.hideLoading();
            })
            .catch((e) => {
                console.log(e);

                wx.hideLoading();
            });
            this.data.pageList[that.data.leftListSelectItem]+=1
        this.updataRightData();
    },
    // 右侧列表被点击
    rightListClick(par) {
        //更新rightdatasource
        var index = parseInt(par.currentTarget.id);
        this.setData({
            leftListSelectItem: index,
        });
        if(this.data.typeDataSource[this.data.leftListSelectItem]==null){
            this.getAllwines()
        }
        this.updataRightData()
    },
    //更新右侧数据
    updataRightData: function () {

        var selectData = new Array();
        var app = getApp();
        for (var index in this.data.typeDataSource[this.data.leftListSelectItem]) {
            var good = this.data.typeDataSource[this.data.leftListSelectItem][index];   
                var tempGood = app.globalData.shopCarGoods[good._id];
                if (tempGood != null) {
                    good["buy"] = tempGood.buy;
                }
                selectData.push(good);
            
        }
        this.setData({
            rightDataSource: selectData,
        });
    },
 
    // 添加商品
    openDetail:function(par){
        this.showModal()
        var index = parseInt(par.currentTarget.id);
        // 在右侧数据里搜索对应索引的商品
        var data = this.data.rightDataSource[index];
        console.log(data)
        var normal=data.normal
        if(!normal){
            normal=0
        }
        console.log(normal)
        this.setData({
            selectedWineindex:index,
            tmpBuyNum:data.buy,
            tmpNormal: normal,
        })
    },
    addImageDidClick(par) {
        // console.log(par)
        // 获取点击的商品索引
        //var index = parseInt(par.currentTarget.id);
        var index=this.data.selectedWineindex
        // 在右侧数据里搜索对应索引的商品
        var data = this.data.rightDataSource[index];
        console.log(data);
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
        console.log(data);
        app.addGoodToShopCar(data);

        // 调用自定义组件中的方法,更新底栏购物车
        let myComponent = this.selectComponent("#myComponent");
        myComponent.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    plus:function(){
        var index=this.data.selectedWineindex
        // 在右侧数据里搜索对应索引的商品
        var tmpbuy=this.data.tmpBuyNum
        var tmpnormal=this.data.tmpNormal
        var data = this.data.rightDataSource[index];
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
    confirm:function(){
        var index=this.data.selectedWineindex
        // 在右侧数据里搜索对应索引的商品
        var tmpbuy=this.data.tmpBuyNum
        var tmpnormal=this.data.tmpNormal
         this.data.rightDataSource[index].buy=tmpbuy
         this.data.rightDataSource[index].normal=tmpnormal
        this.setData({
            rightDataSource: this.data.rightDataSource,
        });
        var data= this.data.rightDataSource[index]
        console.log(data)
        this.hideModal()

        var app = getApp();
        app.addGoodToShopCar(data);

        // 调用自定义组件中的方法,更新底栏购物车
        
        
    },
    changeSlider:function(e){
        this.setData({
            tmpNormal: e.detail.value 
        })
    },
    closeDetail:function(){
        this.hideModal()
    },
    onPullDownRefresh(){
        console.log('下拉刷新')
        this.data.pageList=[]
        this.data.typeDataSource=[]
        for (var i = 0; i < this.data.leftDataSource.length; i++) {
            this.data.pageList.push(0)
            this.data.typeDataSource.push(null)
         }
         this.getAllwines()
        
        　　
    },
    onReachBottom(){
        console.log('上拉加载')
        this.getAllwines()

    },

    // 获取数据
    // requestDataFromServe() {
    //     var that = this;
    //     wx.showLoading({
    //         title: "",
    //     });
    //     // console.log(this.data.envId);
    //     // 从云函数获取数据
    //     // wx.cloud.callFunction({
    //     //   name: 'quickstartFunctions',
    //     //   config: {
    //     //     env: this.data.envId
    //     //   },
    //     //   data: {
    //     //     type: 'getAllWine',
    //     //     userInfo:{
    //     //       openId:'ojVpU5XXun_ZlsmtOJKIJktiTNjc'
    //     //     }
    //     //   }
    //     // }).then((res) => {
    //     //   console.log("res.result")
    //     //   console.log(res.result)
    //     //   that.updateData(res.result);
    //     wx.hideLoading();
    //     // }).catch((e) => {
    //     //   console.log(e)
    //     // })
    // },
    //更新数据
    updateData: function (data) {
        //更新左侧数据
        var app =getApp()

        //更新右侧数据
        var allData = new Array();
        for (var index in data.product_list) {
            var good = data.product_list[index];
            console.log(data.product_list);
            good.buy = 0;
            allData.push(good);
        }
        var product_list =data.product_list
        if(this.data.typeDataSource[this.data.leftListSelectItem]!=null){
            product_list=this.data.typeDataSource[this.data.leftListSelectItem].concat(product_list)
        }
        var key = 'typeDataSource['+this.data.leftListSelectItem+']'
        this.setData({
            [key]:product_list
        });
        this.updataRightData();
        this.upDataFromStorage();
    },
    upDataFromStorage: function () {
        let rightDataSource = this.data.typeDataSource[this.data.leftListSelectItem];
        console.log("assssssssssssssssssss");

        let cart = wx.getStorageSync(this.data.shopNow._id) || [];
        for (let i in cart) {
            let index = rightDataSource.findIndex((v) => v._id === cart[i]._id);
            if (index === -1) {
            } else {
                rightDataSource[index].buy = cart[i].buy;
                rightDataSource[index].normal = cart[i].normal;
            }
            // console.log('key=', i, 'value=', cart[i])
        }

        this.setData({
            rightDataSource: rightDataSource,
        });
        // let index = cart.findIndex((v) => v._id === good._id);
        // if (index === -1) {
        //     good.buy = 0;
        // } else {
        //     good.buy = cart[index].buy;
        // }
    },
});
