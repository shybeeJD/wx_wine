// pages/settlement/settlement.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        envId: null,
        address: null,
        goodsList: null,
        totalPrice: null,
        freight: 0,
        address_list: null,
        addressSelectState: 0, //地址选择状态,值为0创建订单的时候用的是默认地址,值为1用的是选择的地址
        dialogShow: false,
        orderID: null, //创建完成后生成的订单ID
        shopNow: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: "加载中",
        });
        if (options.good) {
            this.data.goodTemp = JSON.parse(options.good);
        }

        var app = getApp();
        this.getFreight();
        this.setData({
            envId: app.globalData.envId,
        });
        this.updateAddress();
        this.updateGoods();

        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log(this.data.address_list);
        this.updateSelectedAddress();
        this.updateGoods();
        if (this.data.address_list) {
            this.coumputeDeliveryPrice();
            this.updateGoods();
        } else {
            this.getAddressCallback = (loginInfo) => {
                this.updateSelectedAddress();
                this.updateGoods();
            };
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.data.goodTemp = null;
    },

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
    getFreight: function () {
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: this.data.envId,
                },
                data: {
                    type: "getFreight",
                },
            })
            .then((resp) => {
                this.setData({
                    freight: resp.result.data[0].price,
                });
                // console.log(resp.result.data[0].price);
            })
            .catch((e) => {
                console.log(e);

                wx.hideLoading();
            });
    },
    // 创建订单
    createOrder: function (event) {
        wx.showLoading({
            title: "加载中",
        });

        let goods = {};
        let goodsLeft = [];
        for (let i in this.data.goodsList) {
            if (this.data.goodsList[i].isSelect) {
                let i_id = this.data.goodsList[i]._id;
                let i_buy = this.data.goodsList[i].buy;
                let i_normal = this.data.goodsList[i].normal;
                let brand = this.data.goodsList[i].brand;
                let price = this.data.goodsList[i].price;
                goods[i_id] = {
                    num: i_buy,
                    normal: i_normal,
                    brand: brand,
                    price: price,
                    info: this.data.goodsList[i],
                };
            } else {
                goodsLeft.push(this.data.goodsList[i]);
            }
        }
        // todo:添加订单时候选择的地址
        let address = this.data.address;
        if (address == undefined || address == null) {
            wx.hideLoading();
            wx.showToast({
                title: "地址不能为空",
                icon: "error",
                duration: 2000, //持续的时间
            });
            return;
        } else {
            // console.log(this.data.freight);
            wx.cloud
                .callFunction({
                    name: "quickstartFunctions",
                    config: {
                        env: this.data.envId,
                    },
                    data: {
                        type: "createOrder",
                        goods: goods,
                        delivery_price: this.data.freight,
                        address: this.data.address,
                        discount: 2,
                        packingsPrice: 0,
                    },
                })
                .then((res) => {
                    // console.log(res.result);
                    if (res.result.success == false) {
                        wx.showToast({
                            title: res.result.msg,
                            icon: "error",
                        });
                    } else {
                        this.setData({
                            dialogShow: true,
                            orderID: res.result.res._id,
                        });
                        var app = getApp();
                        //提交订单后清除购物车缓存
                        if (
                            this.data.goodTemp == undefined ||
                            this.data.goodTemp == null
                        ) {
                            wx.setStorageSync(
                                app.globalData.shopNow._id,
                                goodsLeft
                            );
                        }
                    }
                })
                .catch(console.error);
            wx.hideLoading();
        }
    },
    // 计算配送费
    coumputeDeliveryPrice: function () {
        var distance = this.data.address.distance;
        var app = getApp();
        this.setData({
            shopNow: app.globalData.shopNow,
        });
        var freight = this.data.shopNow.freight;
        var dprice = 0;
        for (var i = 0; i < freight.length; i++) {
            if (distance > freight[i].km) {
                dprice = freight[i].cny;
            }
        }

        this.setData({
            freight: dprice,
        });
        // console.log(this.data.freight);
    },

    selectAddress: function () {
        wx.navigateTo({
            url: "../address/selectAddress",
        });
    },
    // 从缓存中更新已选择的地址
    updateSelectedAddress: function () {},

    // 云函数获取地址列表,并添加到缓存
    // 然后显示默认的地址
    updateAddress: function () {
        var app = getApp();
        var that = this;
        wx.cloud
            .callFunction({
                name: "quickstartFunctions",
                config: {
                    env: this.data.envId,
                },
                data: {
                    type: "getAddress",
                    shopLatitude:
                        app.globalData.shopNow.location.coordinates[1],
                    shopLongitude:
                        app.globalData.shopNow.location.coordinates[0],
                },
            })
            .then((resp) => {
                var app = getApp();
                for (let i in resp.result.list) {
                    let address_item = resp.result.list[i];
                    // console.log(address_item);
                    if (
                        address_item.distance > app.globalData.shopNow.postRange
                    ) {
                        break;
                    }
                    if (address_item.default == true) {
                        wx.setStorageSync("address_id", address_item._id);
                        that.setData({
                            address: address_item,
                        });

                        break;
                    }
                }
                that.setData({
                    address_list: resp.result.list,
                });
                if (this.getAddressCallback) {
                    this.getAddressCallback(null);
                }

                that.coumputeDeliveryPrice();
                // console.log(that.data);
            })
            .catch((e) => {
                console.log(e);

                wx.hideLoading();
            });
    },

    // 更新商品数据
    updateGoods: function () {
        var app = getApp();
        let goodsList = [];

        if (this.data.goodTemp) {
            this.data.goodTemp.isSelect = true;
            goodsList.push(this.data.goodTemp);
        } else {
            goodsList = wx.getStorageSync(app.globalData.shopNow._id);
        }
        // console.log(goodsList);

        let p = 0;
        let pack = 0;
        for (let i in goodsList) {
            if (goodsList[i].isSelect) {
                // console.log(goodsList[i].packingsPrice);
                p += goodsList[i].price * goodsList[i].buy;
                pack += goodsList[i].packingsPrice * goodsList[i].buy;
            }
        }
        // console.log(this.data.freight);
        this.setData({
            goodsList: goodsList,
            packingsPrice: pack,
            totalPrice: p,
        });
    },
    tapDialogButton: function (e) {
        // console.log("dialog", e.detail);
        // console.log("dialog", e.detail.index);
        if (e.detail.index == 1) {
            console.log("点击确认按钮啦", "");
        } else {
            console.log("点击放弃付款按钮啦", "");
            wx.redirectTo({
                url:
                    "../order/orderDeatail/orderDetail?id=" + this.data.orderID,
            });
        }
    },
});
