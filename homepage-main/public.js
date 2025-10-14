/**
 * Created by haoguo on 17/6/30.
 */

var wxData = {
    getData: function () {
        var _this = this;
        var url = window.location.origin + window.location.pathname + window.location.search;

        $.post("/util/get_jssdk_wxconfig.do",
            { "url": url },
            function (data) {
                if (data.code == 200) {
                    _this.wxConfig(data);
                } else {
                    alert('获取wxconfig失败');
                }
            }
        )
    },
    wxConfig: function (data) {
        var retData = data.result;
        wx.config(retData);
    }
};
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.Mobile./), //是否为移动终端
            ios: !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X)/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};



function is_weixn() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

if (IsPC()) {
    $('.j-phone-down').hide();
} else {
    $('.j-phone-down').show();
    $('.j-ipad-down').hide();
    $('.down-app').show();
}

function stringVersion(v) {
    var v = v;
    if (v.toString().length == 3) {
        v += '0';
    } else if (v.toString().length == 1) {
        v += '.00';
    }
    return v;
}

var androidVersion = 6.16;
var ios_version = 1.23;
var androidDownloadUrl = "";
var kind = null;
var open = true;
var downWork = {
    init: function () {
        kind = check_kind();
        this.setVersion();

    },
    setVersion: function () {
        var self = this;
        $.ajax({
            url: 'https://loghomeService.codesocean.top/app/get_app_update',
            type: 'get',
            success: function (data) {
                data = data[0];
                androidVersion = data.version;
                androidDownloadUrl = data.update_url;
                self.downKind();
                self.bindEvent();
                $('.j-android-version-txt').text(stringVersion(androidVersion));
                $('.j-android-version-url').attr('href', androidDownloadUrl);
            }
        });

    },
    getWindow: function () {
        var height = window.innerHeight - $('.j-header').height();
        $('.j-follow-main >div').height(height);
    },
    bindEvent: function () {
        var _this = this;
        // $('.j-follow').bind('click', function () {
        //     _this.getWindow();
        //     if (open) {
        //         $('.j-follow-main').show();
        //         $('.j-header').css('backgroundColor', 'transparent');
        //         open = false;
        //     } else {
        //         $('.j-follow-main').hide();
        //         $('.j-header').css('backgroundColor', '#202636');
        //         open = true;
        //     }
        //     return false
        // });
        $('body').click(function () {
            $('.j-follow-main').hide();
            open = true;
        });
        // $('.j-follow-main').click(function () {
        //     return false;
        // });
        $('.j_close_app').click(function () {
            $('.down-app').fadeOut(function () {
                $('body').css('paddingTop', 60);
                var height = window.innerHeight - $('.j-header >.container').height();
                $('.j-follow-main >div').height(height);
            });
            return false;
        });
        $('.down-app').click(function () {


            if (kind == 'ios') {
                iosAlert();
                if (is_weixn()) {
                    tipAlert();
                } else {
                    window.location.href = ('./Index.html');
                }
            } else if (kind == 'android') {
                if (is_weixn()) {
                    tipAlert();
                } else {
                    window.location.href = ('./Index.html');
                }
            }
        });
        $('body').on('click', '.j-tip-mask', function () {
            $('.j-tip-mask').remove();
        })

    },
    downKind: function () {
        var str = '';
        if (kind == 'ios') {
            if (is_weixn()) {
                str = '<a href="http://loghome.codesocean.top" class="btn-red"><img src="img/web.png" style="margin-left: 15px; width: 30px; margin-right: 10px;">打开网页版</a>';
            } else {
                str = '<a href="http://loghome.codesocean.top" class="btn-red"><img src="img/web.png" style="margin-left: 15px; width: 30px; margin-right: 10px;">打开网页版</a>';
            }
        } else if (kind == 'android') {
            if (is_weixn()) {
                str = '<a  onclick="tipAlert()" class="btn-red"><img src="img/andorid.png">下载安卓版</a>' +
                 '<a href="http://loghome.codesocean.top" class="btn-red"><img src="img/web.png" style="margin-left: 15px; width: 30px; margin-right: 10px;">打开网页版</a>';
            } else {
                str = '<a  href="'+ androidDownloadUrl + '" class="btn-red"><img src="img/andorid.png">下载安卓版</a>' + 
                '<a href="http://loghome.codesocean.top" class="btn-red" style="margin-left: 15px;"><img src="img/web.png" style="width: 30px; margin-right: 10px;">打开网页版</a>';
            }
        }

        $('.j-phone-down').html(str);
    }
};
downWork.init()

if (navigator.userAgent.toLowerCase().indexOf('ipad') > -1) {
    $('.down-app').hide();
}

function tipAlert() {
    $('body').append('<div class="tip-mask j-tip-mask">\n' +
        '    <img src="img/usebrowser.png">\n' +
        '\n' +
        '</div>')
}

function iosAlert() {
    window.location.href = ('https://itunes.apple.com/us/app/id726029718');
}

function IsPC() {
    if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
        browser.versions.iPhone || browser.versions.iPad) {
        return false;
    } else {
        return true;
    }

}

function check_kind() {
    var kind = getQueryString('kind');
    if (kind == null) {
        //如果没有传递参数,则判断设备类型，如果识别不了，则显示安卓
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var isAndroid = browser.versions.android,
            isIos = browser.versions.iPhone,
            isIpad = browser.versions.iPad;
        if (isIos || isIpad) {
            kind = 'ios';

        } else if (isAndroid) {
            kind = 'android';
        } else {
            kind = 'android';
        }
    }
    return kind;


}

Date.prototype.Format = function (fmt) { //
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2].toLowerCase());
    return null;
}


