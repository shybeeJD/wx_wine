// pages/order/bill/seeBill/seeBill.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderID: null,
        orderInfo: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderID: options._id,
        });
        this.getOrderInfo();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getOrderInfo();
    },
    // 获取订单数据
    getOrderInfo: function (params) {
        let app = getApp();

        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: app.enId,
                },
                data: {
                    type: "getOrderInfo",
                    _id: this.data.orderID,
                },
            })
            .then((res) => {
                // 保留两位
                let orderInfo = res.result.data[0];
                let money = orderInfo.money;
                money = money.toFixed(2);
                orderInfo.money = money;
                console.log(orderInfo);
                this.setData({
                    orderInfo: orderInfo,
                });
                console.log(res);
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
    bill: function (e) {
        wx.navigateTo({
            url: "../bill/bill?_id=" + this.data.orderID,
        });
    },
});
