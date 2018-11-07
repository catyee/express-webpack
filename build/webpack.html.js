var fs = require('fs');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var isMobile = require('./environment'); // 判断是不是手机端

var header = fs.readFileSync( './views/pc/common/header.html');
var footer = fs.readFileSync('./views/pc/common/footer.html');
var header_mobile = fs.readFileSync( './views/mobile/common/header.html');
var footer_mobile = fs.readFileSync('./views/mobile/common/footer.html');

if(isMobile) {
    var files = fs.readdirSync( './src/mobile/js');
    var templatePath ='./views/mobile/' ;
}else{
    var files = fs.readdirSync('./src/pc/js');
    var templatePath = './views/pc/';
}

// 配置html
var plugins = [];


files.forEach((file) => {
    if (file === 'common' || file === 'lib' || file === 'utils') {
		return;
	}
    let opts = {
        inject: 'body',
        filename: 'views/'+file + '.html',
        template:'handlebars-loader!'+(templatePath + file + '.html'),
        chunksSortMode: 'manual',
        chunks: [file],
        hash: true,
        header: header,
        footer: footer,
        header_mobile:header_mobile,
        footer_mobile:footer_mobile
    }
    plugins.push(new HtmlWebpackPlugin(opts));
});


module.exports = plugins;