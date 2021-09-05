// pages/order/orderDeatail/orderDetail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderId: null,
        enId: null,
        orderInfo: null,
        
        address: {
            name: "名字是啥",
            tel: "13623711670",
            detail: "地球中国河南郑州",
        },
        goodsList: [{
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
        packingsPrice: 5, //打包费
        freight: 6, //配送费
        totalPrice: 1000, //总价格
        orderDetail: {
            _id: 123123123123,
            createTime: "2020/1/29",
        },
        payed: true, //根据订单是否已经付过款,来决定底栏按钮的显示模式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: "加载中",
        });

        let app = getApp();
        this.setData({
            orderId: options.id,
            enId: app.globalData.envId
        });

        this.getData();

        wx.hideLoading();
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
                this.setData({
                    // todo:刚获取到了数据
                    orderInfo: res.result.data[0]
                })
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
        // wx.cloud
        //     .callFunction({
        //         name: "quickstartFunctions",
        //         config: {
        //             env: this.data.envId,
        //         },
        //         data: {
        //             type: "getAddress",
        //         },
        //     })
        //     .then((resp) => {
        //         wx.setStorageSync("address_list", resp.result.data);

        //         // 下面这堆东西是设置默认的地址
        //         for (let i in resp.result.data) {
        //             let address_item = resp.result.data[i];
        //             if (address_item.default == true) {
        //                 wx.setStorageSync("address_id", address_item._id);
        //                 this.setData({
        //                     address: address_item,
        //                 });
        //             } else {
        //                 console.log("未成功找到缓存中的地址id");
        //             }
        //         }
        //     })
        //     .catch((e) => {
        //         console.log(e);

        //         wx.hideLoading();
        //     });
    },
});