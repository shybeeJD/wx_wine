//app.js
App({
    globalData: {
        userInfo: null, //用户信息
        location: null, //经纬度信息
        city: {
            city: "郑州",
            province: "河南",
            district: ""
        }, //用户城市信息
        bid: null, //用户bid
        systemInfo: null, //系统信息
        shopCarGoods: {}, //购物车商品
        islogin: false, //是否登录
        envId: "shybeejd-5gv8sqyv03b56093",
        shopList:[],
        shopNow:null,
    },
    permission: {
        "scope.userLocation": {
            desc: "你的位置信息将用于小程序位置接口的效果展示",
        },
    },

    onLaunch: function () {
        if (!wx.cloud) {
            console.error("请使用 2.2.3 或以上的基础库以使用云能力");
        } else {
            var logs = wx.getStorageSync("logs") || [];
            logs.unshift(Date.now());
            wx.setStorageSync("logs", logs);
            wx.cloud.init({
                env: "shybeejd-5gv8sqyv03b56093", //环境ID
                traceUser: true,
            });
            var that = this;
            // 获取用户定位信息
            this.getUserLocation(function (res) {});

            // 获取用户bid信息
            this.getUserBid(function (resC) {});
            this.globalData.systemInfo = wx.getSystemInfoSync();
            var that = this;

            // console.log(this.globalData)
        }
    },
    onShow: function () {
        this.getUserInfo();
        var that = this;
        wx.getStorage({
            key: "globalData",
            success: function (res) {
                this.globalData = res.data;
                // console.log(that.globalData);
            },
            fail: function () {},
            complete: function () {},
        });
    },

    onHide: function () {
        var that = this;
        wx.setStorage({
            key: "globalData",
            data: this.globalData,
            success: function (res) {
                console.log(res);
            },
            fail: function () {},
            complete: function () {},
        });
    },
    //获取用户的登录状态
    userIsLogin: function () {
        wx.getStorage({
            key: "login",
            success: function (res) {
                if (res == null || res == {}) {
                    that.globalData.islogin = false;
                } else {
                    that.globalData.islogin = true;
                }
                console.log(that.globalData.islogin);
            },
            fail: function () {},
            complete: function () {},
        });
    },
    //获取用户的登录状态
    userIsLogin: function () {
        wx.getStorage({
            key: "login",
            success: function (res) {
                if (res == null || res == {}) {
                    this.globalData.islogin = false;
                } else {
                    this.globalData.islogin = true;
                }
                console.log(this.globalData.islogin);
            },
            fail: function () {},
            complete: function () {},
        });
    },
    // 获取用户bid信息
    getUserBid: function (res) {
        if (this.globalData.bid) {
            res(this.globalData.bid);
            return;
        }
        var that = this;
        wx.request({
            url: "http://www.jiuyunda.net:90/api/v1/city/current_city",
            data: {
                province: that.globalData.city.province,
                city: that.globalData.city.city,
                district: that.globalData.city.district,
            },
            method: "POST", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (bid) {
                that.globalData.bid = bid.data;
                res(bid.data);
            },
            fail: function () {},
            complete: function () {},
        });
    },
    // 获取位置信息
    getUserLocation: function (res) {
        var that = this;
        if (this.globalData.location) {
            res(this.globalData.location);
            return;
        }
        wx.getLocation({
            type: "wgs84", // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function (location) {
                that.globalData.location = location;
                console.log(location)
                wx.cloud.callFunction({
                name: "quickstartFunctions",
                config: {
                    env: "shybeejd-5gv8sqyv03b56093",
                },
                data: {
                    type: "getShop",
                    latitude:location.latitude,
                    longitude:location.longitude,
                },
            })
            .then((resp) => {
                console.log(resp.result.list);
                that.globalData.shopList=resp.result.list
                that.globalData.shopNow=resp.result.list[0]
            })
            },
            fail: function () {
                wx.showToast({
                    title: "获取位置失败",
                    icon: "success",
                    duration: 350,
                });
            },
            complete: function () {},
        });
    },
    // 获取用户信息
    getUserInfo: function (cb) {
        wx.showLoading({
            title: "",
        });
        var that = this;
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: "shybeejd-5gv8sqyv03b56093",
                },
                data: {
                    type: "login",
                    save: false,
                },
            })
            .then((resp) => {
                console.log(resp.result);
                if (resp.result.data.length > 0) {
                    that.globalData.islogin = true;
                    that.globalData.userInfo = resp.result.data[0];
                }
            })
            .catch((e) => {
                console.log(e);
            });
            
        wx.hideLoading();

    },
    // 添加商品到购物车
    addGoodToShopCar: function (good) {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex((v) => v._id === good._id);
        // 如果缓存中没有,则push当前商品
        // 否则更新对应位置的商品信息
        if (index === -1) {
            cart.push(good);
        } else {
            cart[index] = good;
        }
        wx.setStorageSync("cart", cart);

        // console.log(this.globalData.shopCarGoods)
        // 获取购物车中的对应id的商品设置为临时商品
        var tempGood = this.globalData.shopCarGoods[good._id];
        // 若临时商品为空,则在购物车中对应id的位置添加商品
        // 不为空就把购买数量+1
        if (tempGood != null) {
            tempGood.buy = good.buy;
            this.globalData.shopCarGoods[good._id] = tempGood;
        } else {
            this.globalData.shopCarGoods[good._id] = good;
        }
        console.log(this.globalData.shopCarGoods);
    },
    // 从购物车减少商品
    reduceGoodFromShopCar: function (good) {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex((v) => v._id === good._id);
        // 如果缓存中没有,则push当前商品
        // 否则更新对应位置的商品信息
        if (index === -1) {
            return;
        } else {
            if (good.buy == 0) {
                cart.splice(index, 1);
            } else {
                cart[index] = good;
            }
        }
        wx.setStorageSync("cart", cart);

        //  console.log(this.globalData.shopCarGoods)
        // 若数量=0则删除它
        if (good.buy == 0) {
            delete this.globalData.shopCarGoods[good._id];
            //  console.log("删除")
            //  console.log(this.globalData.shopCarGoods)
            return;
        }
        //  不等于0则修改数量
        var tempGood = this.globalData.shopCarGoods[good._id];
        if (tempGood) {
            tempGood.buy = good.buy;
            this.globalData.shopCarGoods[good._id] = tempGood;
        } else {
            this.globalData.shopCarGoods[good._id] = good;
        }
        //  console.log(this.globalData.shopCarGoods[good._id])
    },
});