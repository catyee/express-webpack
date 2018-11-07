var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');


// 判断是否在开发模式    
var isDev = /dev/.test(process.env.NODE_ENV);

var app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.resolve(__dirname, 'public/pc/views'));
app.set('views', path.resolve(__dirname, 'public/mobile/views'));
app.set('view engine', 'html');

// 记录日志
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/%DATE%.log',
  frequency: 'daily',
  verbose: false
})
app.use(logger('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (isDev) {
  var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./build/webpack.config');
  var compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    writeToDisk: (filename) => {
      return /\.html$/.test(filename)
    },
    stats: {
      colors: true
    }
  }))
 
  app.use(webpackHotMiddleware(compiler));
  require('./routes/app')(app);
} else {

  app.use(express.static(path.join(__dirname, 'public/pc')));
  app.use(express.static(path.join(__dirname, 'public/mobile')));
  require('./routes/app')(app);
}

module.exports = app;
