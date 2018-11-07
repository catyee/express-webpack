var express = require('express'),
    router = express.Router();
var path = require('path');
var model = require('./model');
function isMobile(req) {
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    return agentID; 
}
var viewPath = path.join(process.cwd(), 'public/pc/views');
var mobileViewPath = path.join(process.cwd(), 'public/mobile/views');

router.get('/', function (req, res, next) {
    model.getNewsList();
    next();
}, function(req, res, next) {
    if (isMobile(req)) {
        res.render(mobileViewPath + '/index', { baseMsg: model.baseMsg, allNews: model.allNews});
    } else {
        res.render(viewPath + '/index', { baseMsg: model.baseMsg, rollNewsList: model.rollNewsList });
    }
});
router.get(/^\/index(.html)?/, function (req, res, next) {
    res.redirect('/');

});

module.exports = function (app) {
    app.use('/', router);
}