Page({
    data: {
        dataSource: null,
        lower_price:5000,
    },
    onLoad: function (options) {},
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
       
        var app = getApp()
        console.log(app.globalData)
        this.setData({
            shopNow:app.globalData.shopNow
        })
        this.renderData();

        // 调用自定义组件中的方法,更新底栏购物车
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
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
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: "title", // 分享标题
            desc: "desc", // 分享描述
            path: "path", // 分享路径
        };
    },
    renderData: function () {
        var data = wx.getStorageSync(this.data.shopNow._id);

        this.setData({
            dataSource: data,
        });
    },
    // 添加按钮被点击
    addButtonClick: function (tap) {
        var index = parseInt(tap.currentTarget.id);
        var good = this.data.dataSource[index];
        if (good.buy < good.stock) {
            good.buy++;
            good.normal++;
        } else {
            wx.showToast({
                title: "库存不足",
                duration: 350,
            });
        }
        this.setData({
            dataSource: this.data.dataSource,
        });
        var app = getApp();
        app.addGoodToShopCar(good);

        // 调用自定义组件中的方法,更新底栏购物车
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    // 减少按钮被点击

    switchSelect: function(tap){
        var id = parseInt(tap.currentTarget.dataset.id);
        this.data.dataSource[id].isSelect=!this.data.dataSource[id].isSelect
        this.setData({
            dataSource:this.data.dataSource
        })
        var app = getApp();
        app.reduceGoodFromShopCar(this.data.dataSource[id]);
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    reduceButtonClick: function (tap) {
        var id = parseInt(tap.currentTarget.id);
        var good = this.data.dataSource[id];
        if (good.buy == 1) {
            good.buy = 0;
            var tempData = this.data.dataSource;
            tempData.splice(id, 1);
            this.setData({
                dataSource: tempData,
            });
        } else {
            if (good.buy > 1) {
                good.buy--;
            }
            if(good.normal>0){
                good.normal--;
            }
            this.setData({
                dataSource: this.data.dataSource,
            });
        }
        var app = getApp();
        app.reduceGoodFromShopCar(good);

        // 调用自定义组件中的方法,更新底栏购物车
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    getShopCarGoods: function (_id) {
          
        var data = this.data.dataSource
        console.log(data)
        this.setData({
            dataSource: data,
        });
        this.getGoodsNum();
    },
    getGoodsNum: function () {
        let that = this;

        let DS = that.data.dataSource;

        let num = 0;
        let price = 0;
        let marketPrice = 0;

        for (var i = 0; i < DS.length; ++i) {
          if(DS[i].isSelect){
            let buy = 0;
            num += DS[i].buy;
            buy = DS[i].buy;
            price += DS[i].price * buy;
            marketPrice += DS[i].marketPrice * buy;
          }  
        }

        price = price.toFixed(2);
        marketPrice = marketPrice.toFixed(2);
        console.log(price)

        that.setData({
            num: num,
            price: price,
            marketPrice: marketPrice,
        });
    },
    buyButton: function () {
        let goodsNum = this.data.num;
        if (goodsNum <= 0) {
            wx.showToast({
                title: "购物车为空",
                icon: "error",
                duration: 1000,
            });
        } else if(this.data.price<this.data.lower_price){
            wx.showToast({
                title: "不够起送费",
                icon: "error",
                duration: 1000,
            });
        }
        else {
            wx.navigateTo({
                url: "../../pages/settlement/settlement",
            });
        }
    },
    allSelect:function(){
        var data = wx.getStorageSync(this.data.shopNow._id);
        var isAllSelect=this.data.isAllSelect
        if(isAllSelect){
            isAllSelect=false
            for(var i=0;i<data.length;i++){
                data[i].isSelect=false
            }
        }else{
            isAllSelect=true
            for(var i=0;i<data.length;i++){
                data[i].isSelect=true
            }
        }
       
        this.setData({
            dataSource: data,
            isAllSelect:isAllSelect
        });
        console.log(this.data.dataSource)
        wx.setStorageSync(this.data.shopNow._id, data);
        this.getShopCarGoods(this.data.shopNow._id);

    },
});
