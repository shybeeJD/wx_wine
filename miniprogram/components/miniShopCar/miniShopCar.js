// components/miniShopCar/miniShopCar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        dataSource: null,
        num: 0,
        price: 0,
        marketPrice: 0,
        timer: null,
    },
    // 生命周期
    lifetimes: {
        attached: function () {
            let that = this;
            that.getShopCarGoods();
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getShopCarGoods: function () {
            let that = this;
            // console.log(222222222222);
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
