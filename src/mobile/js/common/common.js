
var common = {
    init: {},
    bind: {},
}

common.init = function () {
    common.bind();
}
//防止ios误触
common.avoidIOSMistakeTouch = function () {
    var isMove = false;
    document.documentElement.addEventListener("touchstart", function () {
        isMove = false;
    })

    document.documentElement.addEventListener("touchmove", function () {
        isMove = true;
    })

    document.documentElement.addEventListener("touchend", function (e) {
        if (isMove) {
            e.stopPropagation()
            return false;
        }
    }, true);
}
common.bind = function () {
    this.avoidIOSMistakeTouch();
    $(".common-header .menu").click(function () {
        $(this).toggleClass('active');
        $("#menu-list-panel").fadeToggle(500);
        return false;
    })

    $("#menu-list-panel").bind("touchmove scroll", function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    })

    $("#menu-list-panel").bind("touchmove scroll", function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    })

    $(window).scroll(function (e) {
        var top = $(document).scrollTop();
        top = top / 100;
        $(".common-header-con").css("background", "rgba(30,30,30," + top + ")");

    })
    var u = navigator.userAgent;
    var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (ios) {
        var y = 0;
        document.addEventListener('touchstart', function (e) {
            y = e.touches[0].pageY;
        }, false);
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
            window.scroll(0, y - e.touches[0].pageY + window.scrollY);
        }, false);

    }



}

$(function () {
    common.init();
})

window.common = common;