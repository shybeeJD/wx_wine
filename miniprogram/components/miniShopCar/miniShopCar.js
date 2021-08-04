// components/miniShopCar/miniShopCar.js
Component({
    //  组件的属性列表
    properties: {},
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
            let that = this;
            that.getShopCarGoods(); //创建完先更新一下
        },
    },
    //   组件的方法列表
    methods: {
        //获取globalData的购物车数据
        //并执行getGoodsNum更新显示的数据
        getShopCarGoods: function () {
            let that = this;
            let app = getApp();
            var data = new Array();
            for (var key in app.globalData.shopCarGoods) {
                data.push(app.globalData.shopCarGoods[key]);
            }
            that.setData({
                dataSource: data,
            });
            that.getGoodsNum();
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
    },
});
