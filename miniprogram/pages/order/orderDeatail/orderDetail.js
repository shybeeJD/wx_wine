// pages/order/orderDeatail/orderDetail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        address: {
            name: "名字是啥",
            tel: "13623711670",
            detail: "地球中国河南郑州",
        },
        goodsList: [
            {
                title: "我是大烧饼",
                buy: 10,
                price: 3.5,
            },
            {
                title: "我是中烧饼",
                buy: 100,
                price: 30.5,
            },
            {
                title: "我是小烧饼",
                buy: 1000,
                price: 300.5,
            },
        ],
        packingsPrice: 5,
        freight: 6,
        totalPrice: 1000,
        orderDetail: {
            _id: 123123123123,
            createTime: "2020/1/29",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

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
});
