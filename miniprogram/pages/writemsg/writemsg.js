var nr = "";
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // envId: "",
        msg: "",

        msgData: [
            {
                msg: "天热多冰。",
                selected: false,
            }, //双引号
            {
                msg: "请尽快送达。",
                selected: false,
            },
            {
                msg: "我只有2小时，您看着安排吧。",
                selected: false,
            },
            {
                msg: "帮我带包烟。",
                selected: false,
            },
            {
                msg: "不吃蒜不要香菜。",
                selected: false,
            },
        ],
        // neirong: "",
    },
    selectMsg: function (param) {
        console.log(666);
        var index = parseInt(param.currentTarget.id);

        let msgData = this.data.msgData;
        let msg = msgData[index].msg;
        for (const i in msgData) {
            if (i == index) {
                msgData[i].selected = true;
            } else {
                msgData[i].selected = false;
            }
        }
        this.setData({
            msg: msg,
            msgData: msgData,
        });
    },
    clickMe: function (e) {
        // var that = this;
        // console.log(e);
        // nr = e.currentTarget.dataset.nr;
        // that.setData({
        //     neirong: nr,
        // });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let msg = options.msg;
        this.setData({
            msg: msg,
        });

        // this.setData({
        //     envId: options.envId,
        // });
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
    subMsg: function () {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];

        prevPage.setData({
            msg: this.data.msg,
        });
        wx.navigateBack();
    },

    bindInput(e) {
        var msg = e.detail.value;

        let msgData = this.data.msgData;
        for (const i in msgData) {
            msgData[i].selected = false;
        }
        this.setData({
            msg: msg,
            msgData: msgData,
        });
    },
});
