const dateFormat = require('format-datetime');

var utils = {};

// 格式化日期(事件戳转换成对应的日期格式format:yy-mm-dd)
utils.formatTime = function (inputTime, format) {
    let date = new Date(inputTime);
    return dateFormat(date, format);
    // return 'aaa';
};

module.exports = utils;
