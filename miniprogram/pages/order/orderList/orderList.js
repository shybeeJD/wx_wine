// pages/order/orderList/orderList.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        envId: null,
        // statusList: ["全部": 0, "代付款", "代发货", "待收货", "待评价"],
        statusCheckIndex: 0,
        selectStatusList: {
            0: "全部",
            1: "待支付",
            2: "待收货",
            3: "已完成",
        },

        orderStatusList: {
            1: "订单已完成",
            2: "正在配送",
            3: "商家已接单",
            4: "商家拒绝接单",
            5: "等待支付",
            6: "取消支付",
            7: "正在退款",
        },
        orderList: null,
        priceList: [],
        imgList: null,
        defaultImg: "../../resource/暂无图片.jpeg",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: "加载中...",
        });
        this.getOrderList(10, [1, 2, 3, 4, 5, 6, 7]);
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
    // 去订单详情
    orderDetail: function (e) {
        let order_id = e.currentTarget.dataset.order_id;
        // console.log(e.currentTarget.dataset.order_id);
        wx.navigateTo({
            url: "../orderDeatail/orderDetail?id=" + order_id,
        });
        // todo:订单列表去订单详情
    },
    // 切换状态
    selectStatus: function (e) {
        wx.showLoading({
            title: "加载中...",
        });
        let index = e.currentTarget.dataset.index;
        this.setData({
            statusCheckIndex: index,
        });
        // 根据状态重新加载数据
        let selectStatusList = [];
        if (index == 0) {
            selectStatusList = [1, 2, 3, 4, 5, 6, 7];
        } else if (index == 1) {
            selectStatusList = [5];
        } else if (index == 2) {
            selectStatusList = [2, 3];
        } else if (index == 3) {
            selectStatusList = [1];
        }
        this.getOrderList(10, selectStatusList);
        wx.hideLoading({
            success: (res) => {},
        });
    },
    // 获取订单列表
    getOrderList: function (num, status) {
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
                    num: num,
                    status: status,
                },
            })
            .then((resp) => {
                this.setData({
                    orderList: resp.result.data,
                });
                this.getOrderPrice();
                this.getGoodsImg();
            })
            .catch((e) => {
                console.log(e);
            });
    },
    // 获取订单价格
    getOrderPrice: function () {
        let orderList = this.data.orderList;
        let priceList = [];
        for (const i in orderList) {
            let orderPrice = 0;
            for (const j in orderList[i].goods) {
                let good = orderList[i].goods[j];
                orderPrice += good.price * good.num;
            }
            priceList[i] = orderPrice;
        }
        // todo: 上拉下拉刷新需要重构数据结构
        // let thisData_priceList=this.data.price
        this.setData({
            priceList: priceList,
        });
    },
    // 设置商品图片
    getGoodsImg: function () {
        let imgList = [];
        let orderList = this.data.orderList;

        for (const i in orderList) {
            let goodsImg = {};
            for (const j in orderList[i].goods) {
                let good = orderList[i].goods[j];
                goodsImg[j] = good.info.thumb_url;
            }
            imgList[i] = goodsImg;
        }
        this.setData({
            imgList: imgList,
        });
    },
    imgErrorFunction: function (e) {
        if (e.type == "error") {
            var errorImgIndex = e.currentTarget.dataset.errorimg; //获取错误图片循环的下标
            var errorOrderIndex = e.currentTarget.dataset.errororder; //获取错误图片循环的下标
            var imgList = this.data.imgList; //将图片列表数据绑定到变量
            imgList[errorOrderIndex][errorImgIndex] = this.data.defaultImg; //错误图片替换为默认图片
            this.setData({
                imgList: imgList,
            });
        }
    },
});
