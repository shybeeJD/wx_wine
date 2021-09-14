function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join("/") +
        " " +
        [hour, minute, second].map(formatNumber).join(":")
    );
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
}

// 修改订单状态 changeOrderStatus
function changeOrderStatus(order_id, status) {
    var app = getApp();
    wx.cloud.callFunction({
        name: "quickstartFunctions",
        config: {
            env: app.globalData.envId,
        },
        data: {
            type: "changeOrderStatus",
            _id: order_id,
            status: status,
        },
    });
}

module.exports = {
    formatTime: formatTime,
    changeOrderStatus: changeOrderStatus,
};
