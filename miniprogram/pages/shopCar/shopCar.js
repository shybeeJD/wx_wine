Page({
    data: {
        dataSource: null,
        lower_price: 500,
        inited: false,
        loaded: false,
        btn1Selected: false,
        empty: false
    },
    onLoad: function (options) {},
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        wx.showLoading({
            // title: "",
        });
        this.setData({
            inited: false,
            loaded: false,
        });
        var that = this;
        var timer = setInterval(function () {
            if (that.data.loaded) {
                that.setData({
                    inited: true,
                });
                console.log("获取数据中...");
                wx.hideLoading();
                clearInterval(timer);
            }
        }, 500);

        var app = getApp();
        // console.log(app.globalData)
        this.setData({
            shopNow: app.globalData.shopNow,
        });
        this.renderData();
        this.isAllSelect();

        this.setData({
            loaded: true,
        });
        this.isEmpty()
    },
    isEmpty: function (params) {
        let that = this
        if (this.data.dataSource.length == 0) {
            console.log(0);
            that.setData({
                empty: true
            })
        } else {
            console.log(1);

            that.setData({
                empty: false
            })
        }
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
    renderData: function () {
        var data = wx.getStorageSync(this.data.shopNow._id);

        this.setData({
            dataSource: data,
        });
    },
    // 添加按钮被点击
    addButtonClick: function (tap) {
        var index = parseInt(tap.currentTarget.id);

        var good = this.data.dataSource[index];
        if (good.buy < good.stock) {
            good.buy++;
            good.normal++;
        } else {
            wx.showToast({
                title: "库存不足",
                duration: 350,
            });
        }
        this.setData({
            dataSource: this.data.dataSource,
        });
        var app = getApp();
        app.addGoodToShopCar(good);

        // 调用自定义组件中的方法,更新底栏购物车
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    // 减少按钮被点击

    switchSelect: function (tap) {
        var id = parseInt(tap.currentTarget.dataset.id);
        this.data.dataSource[id].isSelect = !this.data.dataSource[id].isSelect;

        // 检查是否全选
        for (const i in this.data.dataSource) {
            if (!this.data.dataSource[i].isSelect) {
                this.setData({
                    dataSource: this.data.dataSource,
                    isAllSelect: false,
                });
                break;
            } else {
                this.setData({
                    dataSource: this.data.dataSource,
                    isAllSelect: true,
                });
            }
        }

        var app = getApp();
        app.reduceGoodFromShopCar(this.data.dataSource[id]);
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    reduceButtonClick: function (tap) {
        var id = parseInt(tap.currentTarget.id);
        var good = this.data.dataSource[id];
        if (good.buy == 1) {
            good.buy = 0;
            good.normal = 0;
            var tempData = this.data.dataSource;
            tempData.splice(id, 1);
            this.setData({
                dataSource: tempData,
            });
        } else {
            if (good.buy > 1) {
                good.buy--;
            }
            if (good.normal > 0) {
                good.normal--;
            }
            this.setData({
                dataSource: this.data.dataSource,
            });
        }
        // console.log(good)
        var app = getApp();
        app.reduceGoodFromShopCar(good);

        // 调用自定义组件中的方法,更新底栏购物车
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    getShopCarGoods: function (_id) {
        var data = this.data.dataSource;
        // console.log(data)
        this.setData({
            dataSource: data,
        });
        this.getGoodsNum();
    },
    getGoodsNum: function () {
        let that = this;

        let DS = that.data.dataSource;

        let num = 0;
        let price = 0;
        let marketPrice = 0;

        for (var i = 0; i < DS.length; ++i) {
            if (DS[i].isSelect) {
                let buy = 0;
                num += DS[i].buy;
                buy = DS[i].buy;
                price += DS[i].price * buy;
                marketPrice += DS[i].marketPrice * buy;
            }
        }

        price = price.toFixed(2);
        marketPrice = marketPrice.toFixed(2);
        // console.log(price)

        that.setData({
            num: num,
            price: price,
            marketPrice: marketPrice,
        });
    },
    buyButton: function () {
        let goodsNum = this.data.num;
        if (goodsNum <= 0) {
            wx.showToast({
                title: "未选择商品",
                icon: "error",
                duration: 1000,
            });
        } else if (this.data.price < this.data.shopNow.min_fee) {
            wx.showToast({
                title: "不够起送费",
                icon: "error",
                duration: 1000,
            });
        } else {
            wx.navigateTo({
                url: "../../pages/settlement/settlement",
            });
        }
    },
    allSelect: function () {
        var data = wx.getStorageSync(this.data.shopNow._id);
        var isAllSelect = this.data.isAllSelect;
        if (isAllSelect) {
            isAllSelect = false;
            for (var i = 0; i < data.length; i++) {
                data[i].isSelect = false;
            }
        } else {
            isAllSelect = true;
            for (var i = 0; i < data.length; i++) {
                data[i].isSelect = true;
            }
        }

        this.setData({
            dataSource: data,
            isAllSelect: isAllSelect,
        });
        // console.log(this.data.dataSource)
        wx.setStorageSync(this.data.shopNow._id, data);
        this.getShopCarGoods(this.data.shopNow._id);
    },
    inputBuyNum: function (tap) {
        var index = parseInt(tap.currentTarget.id);
        let value = Number(tap.detail.value);

        var good = this.data.dataSource[index];
        let ice = good.buy - good.normal;
        if (good.buy < good.stock) {
            good.buy = ice + value;
            good.normal = value;
        } else {
            wx.showToast({
                title: "库存不足",
                icon: "error",
                duration: 350,
            });
        }
        this.setData({
            dataSource: this.data.dataSource,
        });
        var app = getApp();
        app.addGoodToShopCar(good);

        // 调用自定义组件中的方法,更新底栏购物车
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    isAllSelect: function (param) {
        // 检查是否全选
        for (const i in this.data.dataSource) {
            if (!this.data.dataSource[i].isSelect) {
                this.setData({
                    isAllSelect: false,
                });
                break;
            } else {
                this.setData({
                    isAllSelect: true,
                });
            }
        }

        var app = getApp();
        // app.reduceGoodFromShopCar(this.data.dataSource[id]);
        var miniShopCar = this.selectComponent("#miniShopCar");
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
    },
    selectedBtn: function (params) {
        let btn1Selected = this.data.btn1Selected
        this.setData({
            btn1Selected: !btn1Selected
        })
    },
    deleteButton: function (params) {
        var app = getApp();
        var goods = this.data.dataSource;


        for (let i = 0, len = goods.length; i < len; i++) {
            console.log(i);
            if (goods[0].isSelect == true) {
                goods[0].buy = 0
                app.reduceGoodFromShopCar(goods[0]);
                goods.splice(0, 1);
            }
        }

        this.setData({
            dataSource: goods
        })
        // 调用自定义组件中的方法,更新底栏购物车
        this.getShopCarGoods(this.data.shopNow._id); // 调用自定义组件中的方法
        this.isEmpty()

        wx.showToast({
            title: "已删除",
            duration: 350,
        });
    }
});