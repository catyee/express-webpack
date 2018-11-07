var isMobile = require('./environment'); // 判断是不是手机端
var fs = require('fs');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
if(isMobile) {
    var filePath = './src/mobile/js';
    var files = fs.readdirSync(filePath);
}else {
    var filePath = './src/pc/js';
    var files = fs.readdirSync(filePath);
}
let entry = {

}
files.forEach((file) => {
    if(file === 'common' || file ==='lib' || file ==='utils'){
        return;
    }
    var isDev = /dev/.test(process.env.NODE_ENV);
    if(isDev){
        entry[file] = [filePath + '/'+file+'/app.js',hotMiddlewareScript];
    }else{
        entry[file] = [filePath + '/'+file+'/app.js'];
    }
   
})
module.exports = entry;