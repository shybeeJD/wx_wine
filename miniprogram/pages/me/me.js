Page({
    data: {
        islogin: false,
        user_nickname: null,
        avatar_url: null,
        order_list: [{
                image: "../resource/ToBePaid.png",
                title: "待支付",
                status: 1
            },
            {
                image: "../resource/Deliveries.png",
                title: "配送中",
                status: 2
            },
            {
                image: "../resource/ItHasShipped.png",
                title: "待收货",
                status: 2,
            },
            {
                image: "../resource/Completed.png",
                title: "已完成",
                status: 3
            },
        ],
        money_list: [{
                image: "../resource/JKSetUpJiFen.png",
                title: "积分"
            },
            {
                image: "../resource/JKMSYSetUpWineLib.png",
                title: "酒库"
            },
            {
                image: "../resource/JKMSYSetUpRecommend.png",
                title: "优惠券"
            },
            {
                image: "../resource/JKMSYSetUpWineRecommend.png",
                title: "酒券"
            },
        ],
        other_list: ["推荐有奖", "地址管理", "客服热线", "意见反馈"],
        // inited: false,
        // loaded: false
    },
    onLoad: function (options) {
        // 如果用户没有登录需要用户登录
        var that = this;
        var app = getApp();
        if (app.globalData.islogin) {
            that.setData({
                islogin: true,
                user_nickname: app.globalData.userInfo.nickName,
                avatar_url: app.globalData.userInfo.avatarUrl,
            });
        }
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        // wx.showLoading({
        //     // title: "",
        // });
        // this.setData({
        //     inited: false,
        //     loaded: false
        // })
        // var that = this
        // var timer = setInterval(function () {
        //     if (that.data.loaded) {
        //         that.setData({
        //             inited: true
        //         })
        //         console.log('获取数据中...');
        //         wx.hideLoading();
        //         clearInterval(timer)
        //     }
        // }, 500);

        var app = getApp();
        // console.log(app.globalData);
        if (app.globalData.islogin) {
            this.setData({
                islogin: app.globalData.islogin,
                user_nickname: app.globalData.userInfo.nickName,
                avatar_url: app.globalData.userInfo.avatarUrl,
            });
        }

        if (this.data.islogin) {
            this.requestServiceData();
        }
        // this.setData({
        //     loaded: true
        // })
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
    showAllOrder: function () {
        // console.log("ck ");
        wx.navigateTo({
            url: "../../pages/order/orderList/orderList",
        });
        // wx.navigateTo({
        //     url: "../order/orderList",
        // });
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: "title", // 分享标题
            desc: "desc", // 分享描述
            path: "path", // 分享路径
        };
    },
    manageAddress: function () {
        wx.navigateTo({
            url: "../address/addressList",
        });
    },
    // 去登陆
    gotologin: function () {
        var that = this;
        var app = getApp();
        wx.getUserProfile({
            desc: "用于完善会员资料",
            success: function (res) {
                that.setData({
                    islogin: true,
                    userInfo: res.userInfo,
                    user_nickname: res.userInfo.nickName,
                    avatar_url: res.userInfo.avatarUrl,
                });

                // console.log(res);
                // console.log(app.data);
                wx.cloud.callFunction({
                    name: "quickstartFunctions",
                    config: {
                        env: "shybeejd-5gv8sqyv03b56093",
                    },
                    data: {
                        type: "login",
                        save: true,
                        userInfoDetial: res.userInfo,
                    },
                });
            },
            fail: function (err) {
                console.log(err);
            },
        });

        // console.log(this.data);
    },
    imageloaderror: function (image) {
        // console.log(image);
        this.setData({
            avatar_url: "../resource/JKMSYDefaultUserImage.png",
        });
    },
    // 请求我的数据
    requestServiceData: function () {
        var app = getApp();
        var that = this;
        wx.request({
            url: "http://customer.jiuyunda.net:3000/api/v1/customer/customerInfo?mobile=17638574518",
            data: {
                mobile: app.globalData.user_mobile,
            },
            method: "GET", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                that.setData({
                    avatar_url: res.data.avatar_url,
                    user_nickname: res.data.nick_name,
                });
                // console.log(res);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            },
        });
    },
    goOrderList: function (e) {
        let status = e.currentTarget.dataset.status;
        // console.log(status);
        // wx.navigateTo("../order/orderList/orderList");
        wx.navigateTo({
            url: "../order/orderList/orderList?status=" + status,
        });
    },
});