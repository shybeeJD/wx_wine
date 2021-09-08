var app = getApp();
Page({
    data: {
        product_id: "", //商品id
        good_id: "",
        good_detail: {
            product_info: {
                pic_array: [
                    "cloud://shybeejd-5gv8sqyv03b56093.7368-shybeejd-5gv8sqyv03b56093-1306511324/code.png",
                    "cloud://shybeejd-5gv8sqyv03b56093.7368-shybeejd-5gv8sqyv03b56093-1306511324/my-photo.png",
                ],
                item: "青岛",
                price: 1499,
                marketPrice: 2099,
                sale_count: 5,
                brand: "青岛",
                specification: "5o, 500mL",
                origin: "青岛",
                title: "青岛大啤酒",
            },
            comment_count: 500,
            comment_scale: 500,
            product_desc_url: [
                "cloud://shybeejd-5gv8sqyv03b56093.7368-shybeejd-5gv8sqyv03b56093-1306511324/my-photo.png",
                "cloud://shybeejd-5gv8sqyv03b56093.7368-shybeejd-5gv8sqyv03b56093-1306511324/my-photo.png",
            ],
        }, //商品详情数据
        loop_image_height: 0, //轮播图高
        good_detail_image_height: 0, //商品详情图高
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

        var data = JSON.parse(options.good);
        data.comment_count = 0;
        data.comment_scale = 0;
        let good_detail = {
            product_info: data,
        };
        good_detail.comment_count = 0;
        good_detail.comment_scale = 0;
        this.setData({
            good_detail: good_detail,
        });
        //
        wx.setNavigationBarTitle({
            title: options.title,
            success: function (res) {},
        });
        var that = this;
        app.getUserBid(function (res) {
            that.requestFromService(res);
        });
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        this.setData({
            loop_image_height: (app.globalData.systemInfo.windowWidth / 4) * 3,
        });
    },
    getGoodInfo: function (options) {
        let good_id = options.good_id;
        this.setData({
            good_id: good_id,
        });

        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: app.globalData.envId,
                },
                data: {
                    type: "getAllWine",
                    userInfo: app.globalData.userInfo,
                    _id: "8937eaa961332b5808b4657835d39257",
                },
            })
            .then((resp) => {
                console.log(resp);

                wx.hideLoading();
            })
            .catch((e) => {
                console.log(e);

                wx.hideLoading();
            });
    },
    // 图片加载
    imageLoad: function (image) {
        var app = getApp();
        console.log(image);
        var imageHeight =
            (app.globalData.systemInfo.windowWidth / image.detail.width) *
            image.detail.height;
        this.setData({
            good_detail_image_height: imageHeight,
        });
    },
    previewImage: function (image) {
        var url = image.currentTarget.dataset.id;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: this.data.good_detail.product_info.product_desc_url, // 需要预览的图片http链接列表
        });
    },
    previewTopImage: function (image) {
        var url = image.currentTarget.dataset.id;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: this.data.good_detail.product_info.pic_array, // 需要预览的图片http链接列表
        });
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
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: "title", // 分享标题
            desc: "desc", // 分享描述
            path: "path", // 分享路径
        };
    },
    //   从服务器请求数据
    requestFromService: function (re) {
        var that = this;
        wx.request({
            url: "http://www.jiuyunda.net:90/api/v2/product/product_details",
            data: {
                userinfo_id: re._id,
                product_id: that.data.product_id,
            },
            method: "GET", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                that.setData({
                    good_detail: res.data,
                });
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            },
        });
    },
});
