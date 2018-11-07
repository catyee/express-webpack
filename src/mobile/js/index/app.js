import '../../scss/index.scss';
import '../common/common.js';

var ctrl = {
    init: {},
    bind: {},
    baseUrl: 'http://api.dianwutong.com'
}
ctrl.init = function () {
    //banner图 section1
    ctrl.swiper = new Swiper('#banner', {
        loop: true,
        autoplay: 5000,
        followFinger: true,
        onSlideChangeStart: function (swiper) {
            ctrl.disNumber();
        }
    });

    //section4 banner
    ctrl.swiperForSection4 = new Swiper('#section4-banner', {
        loop: true,
        followFinger: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 5000,
        spaceBetween: 30,
    });

    //section5-banner
    ctrl.swiperForSection5 = new Swiper('.section5-banner', {
        loop: true,
        followFinger: true,
        autoplay: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        speed: 2000,
        autoplayDisableOnInteraction: false
    })
    ctrl.disNumber();
    ctrl.changeNews();
    ctrl.bind();
}
ctrl.bind = function () {
    $('.tech-list').on('touchend', function () {
        $(this).find('.show-detail').toggleClass('tech-arrow');
        $(this).find('.show-detail').toggleClass('tech-arrow-click');
        $(this).next().toggleClass('hide');

    })

}
//新闻滚动切换
ctrl.changeNews = function () {
    if(newsTimer){
        window.clearInterval(newsTimer);
    }
    var newsTimer = window.setInterval(function () {
        $('.news-panel').find(".news-panel-con").animate({
            marginTop: "-3.666rem"
        }, 1000, function() {
            $(this).css({marginTop:"0rem"}).find(".news-list:first").appendTo(this);
        });
    },5000)
}

//显示电力数据总量
ctrl.disNumber = function () {
    if(socket){
        socket.close();
    }
    var baseUrl = location.host;
    var socket = new WebSocket('ws://api.dianwutong.com/admin/influxstats');
    socket.onopen = function () {
        socket.send('1');
    }
    socket.onmessage = function (res) {
        var data = res.data;
        $('.num').html(data)
    }
    if (timer) {
        window.clearInterval(timer);
    }
    var timer = window.setInterval(function () {
        socket.send('1');
    },10000)
}
ctrl.init();