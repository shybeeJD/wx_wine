// components/miniShopCar/miniShopCar.js
Component({
    //  组件的属性列表
    properties: {
        _id:String
    },
    // 组件的初始数据
    data: {
        dataSource: null, //购物车数据
        num: 0, //数量
        price: 0, //实付价
        marketPrice: 0, //市场价
    },
    // 生命周期
    lifetimes: {
        attached: function () {
            var app =getApp()
            if(app.globalData.shopNow){
                this.getShopCarGoods(app.globalData.shopNow._id)
            }
        },
    },
    //   组件的方法列表
    methods: {
        //获取缓存的购物车数据
        //并执行getGoodsNum更新显示的数据
        getShopCarGoods: function (_id) {
            
            var data = wx.getStorageSync(_id);
            // console.log(data)
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
                let buy = 0;
                num += DS[i].buy;
                buy = DS[i].buy;
                price += DS[i].price * buy;
                marketPrice += DS[i].marketPrice * buy;
            }

            price = price.toFixed(2);
            marketPrice = marketPrice.toFixed(2);

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
            } else {
                wx.navigateTo({
                    url: "../../pages/settlement/settlement",
                });
            }
        },
    },
});
