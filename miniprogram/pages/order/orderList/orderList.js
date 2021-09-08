// pages/order/orderList/orderList.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        envId: null,
        // statusList: ["全部": 0, "代付款", "代发货", "待收货", "待评价"],
        statusCheckIndex: 0,
        statusList: {
            0: "全部",
            1: "待支付",
            2: "配送中",
            3: "已完成",
        },
        orderList: {
            order1: {
                id: "20210712162531", //string, N, 订单编号
                userId: "asdf", //int, N, 用户id
                status: 2, //int, N, 订单状态
                goods: {
                    cbddf0af60fb6e8119051b276dd45d4f: {
                        num: 5, //下单数
                        cold: 1, //一瓶冰的
                        normal: 2, //两瓶常温的
                        Warm: 2, //两瓶温的}
                    },
                    good2: {
                        num: 5, //下单数
                        cold: 1, //一瓶冰的
                        normal: 2, //两瓶常温的
                        Warm: 2, //两瓶温的}
                    },
                },
                packingsPrice: 10, //float, N, 打包费用
                delivery_price: 5, //float, N, 外送费用
                discount: 20, //float, N, 红包优惠
                address: "address", //string, N, 配送地址id
                deliveryMan: "man!!!s", //string, Y, 配送员
                paymentChannels: 1, //int, N, 支付渠道
                addTime: "2021-07-12 16:41:20", //Datetime, default=now
            },
            order2: {
                id: "20210712162531", //string, N, 订单编号
                userId: "asdf", //int, N, 用户id
                status: 1, //int, N, 订单状态
                goods: {
                    cbddf0af60fb6e8119051b276dd45d4f: {
                        num: 5, //下单数
                        cold: 1, //一瓶冰的
                        normal: 2, //两瓶常温的
                        Warm: 2, //两瓶温的}
                    },
                    good2: {
                        num: 5, //下单数
                        cold: 1, //一瓶冰的
                        normal: 2, //两瓶常温的
                        Warm: 2, //两瓶温的}
                    },
                },
                packingsPrice: 10, //float, N, 打包费用
                delivery_price: 5, //float, N, 外送费用
                discount: 20, //float, N, 红包优惠
                address: "address", //string, N, 配送地址id
                deliveryMan: "man!!!s", //string, Y, 配送员
                paymentChannels: 1, //int, N, 支付渠道
                addTime: "2021-07-12 16:41:20", //Datetime, default=now
            },
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var app = getApp();
        this.setData({
            envId: app.globalData.envId,
        });
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: this.envId,
                },
                data: {
                    type: "getOrderInfo",
                    num: 1,
                    status: [1, 2, 3],
                },
            })
            .then((resp) => {
                console.log(resp);
            })
            .catch((e) => {
                console.log(e);
            });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

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
    // 切换状态
    selectStatus: function (e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            statusCheckIndex: index,
        });
    },
});
