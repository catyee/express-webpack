const axios = require('axios');
const utils = require('../lib/utils.js');
var model = {
    baseMsg: {
        title: "北京电务通能源股份有限公司",
        imgCDN: "//cdn.dianwutong.com/home/images",
        fileCDN: "//cdn.dianwutong.com/vendor",
        prefixImg: '',  // 新闻图片路径前缀
        formatTime: utils.formatTime,
    },
    // baseUrl: 'http://api.saas.dianwutong.com',
    baseUrl: 'http://api.saas.dianwutong.com/admin/',
    data: null, // 新闻页数据(返回数据body中的内容)
    prefix: '', // 图片的路径前缀
    rollNewsList: [], // 滚动新闻列表数据
    allNews: [], // 分页查询获取到的所有的新闻arr，pageSize=10
    detailNews: null, // 新闻详情数据
    hotNewsList: [], // 热门新闻列表
    lastNews: null, // 上一篇新闻
    nextNews: null, // 下一篇新闻
    allPositions: [], // 职位列表
}
// 分页获取新闻列表
model.getNewsList = function (callback, currentPage) {

    clearData();
    axios.all([getNewsList(currentPage, 10, 2), getNewsList(1, 9999, 2)])
    .then(axios.spread(function(acct,prems){
        if(acct.data.code == 200) {
            model.data = acct.data.body;
            model.prefix = acct.data.prefix;
            model.allNews = acct.data.body.records;
            model.allNews = model.allNews.map(item => {
                item.lastModifyTime = utils.formatTime(item.lastModifyTime, 'yyyy-MM-dd');
                return item;
            });
        }
        // 筛选hot新闻和滚动新闻列表
        if(prems.data.code == 200) {
            model.hotNewsList = filterHotNews(prems.data.body.records);
            model.rollNewsList = prems.data.body.records;
            model.rollNewsList = model.rollNewsList.map(item => {
                item.lastModifyTime = utils.formatTime(item.lastModifyTime, 'yyyy-MM-dd');
                return item;
            });
        }
        callback && callback();
    }))
    .catch(function(error){
        callback && callback();
    });

};

// 获取新闻详情
model.getNewsById = function (callback, newsId) {

    clearData();
    axios.all([getNewsList(1, 9999, 2), getNewsDetail(newsId, null), getNewsDetail(newsId, -1), getNewsDetail(newsId, 1)])
    .then(axios.spread(function(acct, perms, last, next) {
        // acct:第一个请求返回的数据；perms:第二个请求返回的数据
        // 筛选hot新闻
        if (acct.data.code == 200) {
            model.hotNewsList = filterHotNews(acct.data.body.records);
            model.prefix = acct.data.prefix;
        }
        // 新闻详情
        if (perms.data.code == 200) {
            model.detailNews = perms.data.body;
            model.detailNews.lastModifyTime = utils.formatTime(model.detailNews.lastModifyTime, 'yyyy-MM-dd hh:mm:ss');
        }
        // 上一篇新闻
        if (last.data.code == 200) {
            model.lastNews = last.data.body;
        }
        // 下一篇新闻
        if (next.data.code == 200) {
            model.nextNews = next.data.body;
        }
        callback && callback();
    }))
    .catch(function(error){
        callback && callback();
    });

};

// 分页获取新闻列表请求
function getNewsList(currentPage, pageSize, status) {
    return axios.get(model.baseUrl + 'rest/news/page', {
        params: {
            page: currentPage,
            pageSize: pageSize,
            status: status, // 新闻状态：1保存，2发布
        }
    });
}
// 根据id获取新闻详情
function getNewsDetail(newsId, flag) {
    return axios.get(model.baseUrl + 'rest/news', {
        params: {
            newsId: newsId,
            flag: flag, // -1表示查询上一篇，1表示查询下一篇
        }
    });
}
// 筛选所有的hot新闻
function filterHotNews(newsList) {
    return newsList.filter(function(value, index){
        return value.hot == 1;
    });
}
// 清空上次的数据
function clearData() {
    model.data = null;
    model.newsList = null;
    model.detailNews = null;
    model.hotNewsList = [];
    model.allNews = null;
    model.lastNews = null;
    model.nextNews = null;
}

// 获取职位列表
model.getPositions = function(currentPage,callback) {
    return axios.get(model.baseUrl + 'rest/position/page', {
        params: {
            page: currentPage,
            pageSize:10,
            status: 2, // 发布 
        }
    }).then(response => {
        if(response.data.code === 200){
            model.allPositions = response.data.body.records;
            model.allPositions = model.allPositions.map(item => {
                item.lastModifyTime = utils.formatTime(item.lastModifyTime, 'yyyy-MM-dd');
                return item;
            });
            model.positionPageResult = response.data.body;
            var currentPage = model.positionPageResult.currentPage;
            var totalPages = model.positionPageResult.totalPages;
            model.startPage =  (currentPage-2)>1?(currentPage-2):2;
            
            model.endPage = (currentPage+3)>totalPages?totalPages:(currentPage+3);
            model.prePage = (currentPage-1)>1?(currentPage-1):1;
            model.nextPage = (currentPage+1)>totalPages?(totalPages):(currentPage+1);
        }
        callback && callback();
    }).catch(e => {
        callback && callback();
    });
}

module.exports = model;
