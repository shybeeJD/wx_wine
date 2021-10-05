// pages/order/orderDeatail/orderDetail.js
var util = require("../../../utils/utils.js");

Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderId: null,
        enId: null,
        orderInfo: null, //下面那一大串,其实都包含在orderInfo里了,但我懒得改
        goods_num: 0,

        address: {},
        goodsList: [],
        packingsPrice: 5, //打包费
        freight: 6, //配送费
        totalPrice: 1000, //总价格
        more: false, //是否显示更多菜单列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            // title: "加载中",
        });

        let app = getApp();
        this.setData({
            orderId: options.id,
            enId: app.globalData.envId,
        });

        this.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 暂时也没用上
        this.getData();
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

    getData: function (options) {
        this.getOrderData();
    },
    // 获取订单数据
    getOrderData: function (params) {
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: this.data.enId,
                },
                data: {
                    type: "getOrderInfo",
                    _id: this.data.orderId,
                },
            })
            .then((res) => {
                var goodsList = [];
                for (var key in res.result.data[0].goods) {
                    var tmp = {
                        title: res.result.data[0].goods[key].info.title,
                        buy: res.result.data[0].goods[key].num,
                        price: res.result.data[0].goods[key].price,
                        normal: res.result.data[0].goods[key].normal,
                    };
                    goodsList.push(tmp);
                }
                this.setData({
                    orderInfo: res.result.data[0],
                    address: res.result.data[0].address,
                    packingsPrice: res.result.data[0].packingsPrice,
                    freight: res.result.data[0].delivery_price,
                    money: res.result.data[0].money,
                    goodsList: goodsList,
                    id: res.result.data[0].id,
                    createTime: res.result.data[0].addTime,
                });
                this.getGoodsNum();
                // console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    },
    getGoodsNum: function (params) {
        let goodsNum = 0;
        let goods = this.data.orderInfo.goods;
        for (const i in goods) {
            goodsNum += goods[i].info.buy;
        }
        this.setData({
            goods_num: goodsNum,
        });
    },
    Receiving: function (e) {
        let order_id = this.data.orderInfo._id;
        let status = 1;
        util.changeOrderStatus(order_id, status);

        let orderInfo = this.data.orderInfo;
        orderInfo.status = status;
        this.setData({
            orderInfo: orderInfo,
        });

        wx.showToast({
            title: "收货成功",
            icon: "success",
            duration: 2000,
        });
    },
    cancelOrder: function (e) {
        let order_id = this.data.orderInfo._id;
        let status = 6;

        util.changeOrderStatus(order_id, status);

        let orderInfo = this.data.orderInfo;
        orderInfo.status = status;
        this.setData({
            orderInfo: orderInfo,
        });
        wx.showToast({
            title: "取消成功",
            icon: "success",
            duration: 2000,
        });
    },
    // todo:联系商家
    ContactShop: function (e) {},
    // todo:支付
    ContactShop: function (e) {},
    // more
    more: function () {
        if (this.data.more == false) {
            this.setData({
                more: true,
            });
        } else {
            this.setData({
                more: false,
            });
        }
        // console.log("mask");
    },
    // bill
    bill: function () {
        wx.navigateTo({
            url: "../../bill/bill/bill?_id=" + this.data.orderId,
        });
    },
    // seebill
    seeBill: function () {
        wx.navigateTo({
            url: "../../bill/seeBill/seeBill?_id=" + this.data.orderId,
        });
    },
});
