//需要jq，setting.js

let device = require("./device"),
    getUrlParam = require("./fn/getParamFromUrl"),
    session = require("./h5/sessionData"),
    localData = require('./h5/localData'),
    alertFn = require('./ui/alert'),
    confirmFn = require('./ui/confirm'),
    isDebug = Symbol("isDebug"),
    checkPageVer = Symbol('checkPageVer'),
    getServerVer = Symbol('getServerVer'),
    hasAllReady = Symbol("hasAllReady"),
    readyFns = Symbol("readyFns"),
    init = Symbol("init"),
    run = Symbol('run'),
    $$ = require('./event/$$'),
    pageReady = Symbol("pageReady"),
    appReady = Symbol("appReady"),
    needWeChatApi = Symbol("needWeChatApi"),
    weChatReady = Symbol("weChatReady"),
    weChatCertification = Symbol("weChatCertification"),
    loadScripts = Symbol("loadScripts"),
    autoSaveUrlParam = Symbol("autoSaveUrlParam"),
    base64Fn = require('./fn/base64'),
    myFetch = require('./resLoader/myFetch'),
    signPage = require('../lib/signPage/b_page_rout'),
    errorHandler = require('../lib/fn/errorHandler');

require('./jq/extend');


let path = require('path');
window.path = path;


let page = {
    //是否调试模式
    [isDebug]:SETTING.isDebug || false,
    //是否是健康成都app内的h5页面
    //是否需要加载微信js
    [needWeChatApi]:(SETTING.weChatUseApiList && SETTING.weChatUseApiList.length!=0)? SETTING.weChatUseApiList : [],
    //页面是否已经ready
    [hasAllReady]:false,

    //缓存的readyFn的调用
    [readyFns]:[],

    async [checkPageVer](){
        let localVer = window.__ver__ || '',
            serverVer = await this[getServerVer]();

        if(!localVer){
            console.log('未发现本地版本号');
            return;
        }

        console.log('localVer:'+localVer+'   serverVer:'+serverVer);
        if(localVer < serverVer && !window.sessionStorage.getItem('hasRefresh')){
            let url = '';
            if(window.location.search){
                url = window.location.href+'&t='+new Date().getTime();
            }else{
                url = window.location.href+'?t='+new Date().getTime();
            }

            console.log('refresh url:'+url);
	        window.sessionStorage.setItem('hasRefresh','true');
            window.location.href = url;
        }

    },
    [getServerVer](){
        return new Promise((success,error)=>{
            $.getScript('./js/ver.js').then(rs=>{
                rs = rs.split('=')[1];
                rs = parseInt(rs);
                success(rs);
            }).catch(e=>{
                console.log(e);
                error(e);
            });
        })
    },

    //页面初始执行入口
    run(obj){
        if(!this[hasAllReady]){
            this[readyFns].push(obj);
        }else{
            this[run](obj);
        }
    },
    [run](obj){
        //注册函数到最近创建的<b-page>对象上
        // b-page.pageInit          obj.init
        // b-page.pageDestroy       obj.pageDestroy
        // b-page.pageShow          obj.pageShow
        // b-page.pageHide          obj.pageHide
        // b-page.pageRefresh       obj.pageRefresh
        if((window.location.href.indexOf('\/#\/') > -1)){
            signPage.registerFn(obj);
        }

        //运行
        obj.init();
    },


    //类的入口
    async [init](callback){
        await Promise.all([
            this[pageReady](),
            this[weChatReady](),
            this[loadScripts](SETTING.needLoadOtherJsList)
        ]);

        //判断是否检查页面文件是否最新
        if(SETTING.isCheckVer){
            await this[checkPageVer]();
        }


        //设置全部已经ready状态
        this[hasAllReady] = true;

        //需要初始执行的。。。。
        callback();

        //运行队列中的函数
        this[readyFns].map(obj=>{
            this[run](obj);
        });

        return true;
    },
    //页面准备ok
    [pageReady](){
        return new Promise(success=>{
            $(document).ready(function(){
                console.log('page ok');
                success();
            });
        })
    },
    //微信ready
    [weChatReady](){
        let _this = this;
        return new Promise(async (success,error)=>{
            if(this[needWeChatApi].length == 0){
                console.log('not need wx api');
                success();
                return;
            }

            if(!device.isWeChat){
                console.log('not in wx');
                success();
                return;
            }


            //加载微信js
            await _this.loadScript(SETTING.weChatJsUrl);
            //客户端权限认证
            await _this[weChatCertification](
                SETTING.weChatCertificationApi,
                SETTING.weChatUseApiList
            ).catch(async e=>{
                if(_this[isDebug]){
                    await _this.alert(e);
                    error(e);
                }else{
                    console.log(e);
                    success();
                }
            });
            console.log('wx api ok');
            success();
            // wx.ready(function(){
            //     success();
            // });
        })
    },
    //加载配置文件、字典等
    [loadScripts](src=[]){
        let _this = this;

        if(src.length != 0){
            return Promise.all(
                src.map(url=>{
                    return _this.loadScript(url);
                })
            )
        }else{
            return new Promise(success=>{
                success();
            });
        }
    },
    //微信权限认证
    [weChatCertification](apiUrl,apiList=[]){
        return new Promise((success,error)=>{
            $.ajax({
                type : 'POST',
                url : apiUrl,
                dataType : "json",
                data : {
                    url : window.location.href
                },
                success : function(data) {
                    if(data.code == '200'){
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.appId, // 必填，公众号的唯一标识
                            timestamp: data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.nonceStr, // 必填，生成签名的随机串
                            signature: data.signature,// 必填，签名，见附录1
                            jsApiList: apiList
                        });
                        success();
                    }else{
                        error("接口错误");
                    }
                },
                error:function(e){
                    error(e);
                }
            });
        })
    },

    //自动缓存链接带入的参数，如果重名会被覆盖  app无法使用
    //主要方便微信的userToken存入，统一微信和app获取userToken的方法
    [autoSaveUrlParam](){
        let list = SETTING.saveUrlParamList || [],
            param = getUrlParam();

        list.map(item=>{
            if(param[item]){
                session.save(item,param[item]);
            }
        });
    },

    //加载js接口
    loadScript(src){
        return new Promise(success=>{
            // $.getScript(src,function(){
            //     success();
            // });
            $.ajax({
                cache:true,
                url: src,
                dataType: "script",
                success: function(){
                    success();
                }
            });
        })
    },

    //alert        async
    alert(text,title,icon,iconWidth,iconHeight){
        return new Promise(async success=>{
            // alert(text);
            // callback();
            await alertFn(true,text,title,icon,iconWidth,iconHeight);
            success();
        });
    },

    //confirm
    confirm(msg,title,icon,iconWidth,iconHeight) {
        return new Promise(async success=>{
            msg = msg || "";

            let state = await alertFn(false,msg,title,icon,iconWidth,iconHeight);
            success(state);
        });
    },
    //相对地址转绝对地址
    getFullUrl(url){
        if(url.substr(0,2) == '\/\/' || url.substr(0,4)=='http'){
            return url;
        }


        if(url.substr(0,1) == '\/'){
            return window.location.origin + url;
        }else{
            let win_url = window.location.href;
            win_url = win_url.substr(0,win_url.lastIndexOf('\/')+1);
            let newUrl = path.join(win_url,url);

            //path转换时会将//2个斜杠当成本地路径转换成一个斜杠
            newUrl = newUrl.replace('http:\/','http:\/\/');
            newUrl = newUrl.replace('https:\/','https:\/\/');
            return newUrl;
        }
    },

    //打开新页面
    openUrl(url,type) {
        if(window.location.href.indexOf('\/#\/') > -1){
            //单页面的
            let pageUrl = window.location.href;
            signPage.openUrl(pageUrl,url);
        }else{
            //非单页面
            if(type == 'noCatch'){
                window.location.replace(url);
            }else{
                window.location.href=url;
            }
        }
    },

    async test(url){
        let div = $('<div></div>');
        div.css({
            position:'fixed',
            left:'100%',
            width:'100%',
            'min-height':'100vh',
            top:0,
            background:'#cfcfcf',
            'z-index':1000000
        }).addClass('hover_animate');

        let html = await myFetch.getBodyHtml('./hospital_info.html');
        let css = await myFetch.catchFile('./css/hospital_list.css');
        let js = await myFetch.catchFile('./js/dist/hospital_info.min.js');



        div.html(html);
        $('body').append(div);
        $('head').append('<script src="'+js+'"></script>');
        $('head').append('<link rel="stylesheet" type="text/css" href="'+css+'">');

        device.sleep(0.1);
        div.css({
            transform:'translateX(-414px)'
        })
    },


    //关闭子应用回到主界面，微信需要注入接口
    closeApp(){
        if(window.wx && wx.closeWindow){
            wx.closeWindow();
        }
    },

    //主动退后
    goBack() {
        window.history.go(-1);
    },

    //点击后退时关闭 app
    backClose(){
        let _this = this;
        window.addEventListener("popstate",function(e){
            if(e.state && e.state.close){
                console.log("close");
                _this.closeApp();
            }
        },false);
        history.replaceState({close:true},"",window.location.href);
        history.pushState("", "", window.location.href);
    },

    //退回到当前页面时 执行传入到函数
    backRefresh:(function(){
        let fn = [];

        //浏览器是当前窗口地址跳转
        window.addEventListener('pageshow',function(e){
            //第一次加载时 persisted 为false
            //从缓存读取时 persisted 为true
            if(e.persisted){
                for(var i= 0,l=fn.length;i<l;i++){
                    fn[i]();
                }
            }
        },false);


        return function(callback){
            callback = callback || function(){
                window.location.reload();
            };
            fn.push(callback);
        };
    })(),

    //后退刷新页面  //待测试
    //  必须页面打开就执行不能放到ready里面
    historyBackRefresh:function(){
        window.onpageshow=function(e){
            console.log(e.persisted)
            //从缓存加载页面 e.persisted=true
            if(e.persisted){
                window.location.reload();
            }
        }
    },

    //获取用户token
    //如果非app需要使用，要在setting中设置
    //tokenKeyFromUrl中需要设置获取时的key
    //同时saveUrlParamList数组中也需要添加该值
    getUserToken(){
        return new Promise((success,error)=>{
            let token = session.get(SETTING.tokenKeyFromUrl);

            if(token){
                success(token);
            }else{
                error("还未登陆");
            }
        });
    },


    //设置标题
    setTitle(text){
        document.title = text;
        if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
            var i = document.createElement('iframe');
            i.src = '/favicon.ico';
            i.style.display = 'none';
            i.onload = function() {
                setTimeout(function(){
                    i.remove();
                }, 9)
            };
            document.body.appendChild(i);
        }
    },

    //微信设置分享 要设置setting的wx的api列表
    //showAllNonBaseMenuItem
    //onMenuShareTimeline
    //onMenuShareAppMessage
    wxSetShare(opt){
        let {title="",link,imgUrl="",desc="",type="link",dataUrl=""} = opt;

        wx.showAllNonBaseMenuItem();

        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {

            },
            cancel: function () {

            }
        });

        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: type, // 分享类型,music、video或link，不填默认为link
            dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                //alert('确认分享');
            },
            cancel: function () {
                //alert('取消分享');
            }
        });
    },

    //微信不分享 要设置setting的wx的api列表
    //hideMenuItems
    wxNotShowShare(){
        wx.hideMenuItems({
            // 发送给朋友: "menuItem:share:appMessage"
            // 分享到朋友圈: "menuItem:share:timeline"
            // 分享到QQ: "menuItem:share:qq"
            // 分享到Weibo: "menuItem:share:weiboApp"
            // 收藏: "menuItem:favorite"
            // 分享到FB: "menuItem:share:facebook"
            // 分享到 QQ 空间/menuItem:share:QZone
            menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline",
                "menuItem:share:qq",
                "menuItem:share:weiboApp",
                "menuItem:share:facebook",
                "menuItem:share:QZone"
            ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
    },

    //获取模版 模版位置需要在setting中设置
    getTemplate(templateName){
        return new Promise((success,error)=>{
            $.ajax({
                type: "get",
                cache: false,
                url: SETTING.pugTemplatePath+templateName+".js",
                //contentType:"application/json",
                dataType: "script",
                timeout: 60000,
                success: function() {
                    success();
                },
                error: function() {
                    error();
                }
            });

        })
    },

    //微信 照相或从相册获取图片base64
    //微信权限
    //chooseImage
    //getLocalImgData
    //uploadImage
    getImageSrc(){
        return new Promise((success,error)=>{
            if(!wx){
                error("不支持浏览器直接调用");
                return;
            }
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'], // original原图   compressed压缩
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    let localIds = res.localIds,
                        src= localIds[0];

                    if(wx.getLocalImgData && (device.isIphone || device.isIpad)){
                        wx.getLocalImgData({
                            localId: src, // 图片的localID
                            success: function (res) {
                                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                success({
                                    src:localData,
                                    id:localData
                                })
                            }
                        });
                    }else{
                        wx.uploadImage({
                            localId: src, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                let serverId = res.serverId; // 返回图片的服务器端ID
                                success({
                                    src:src,
                                    id:serverId
                                })
                            }
                        });
                    }
                }
            });
        })
    },

    //微信 身份证照相及读取信息
    //type=1 正面
    //type=2 反面
    //微信权限 微信不能识别，只能调用相机
    //chooseImage
    //getLocalImgData
    //uploadImage
    getIdCardInfo(type){
        return new Promise((success,error)=>{
            if(!wx){
                error("不支持浏览器直接调用");
                return;
            }
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'], // original原图   compressed压缩
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    let localIds = res.localIds,
                        src= localIds[0];

                    if(wx.getLocalImgData && (device.isIphone || device.isIpad)){
                        wx.getLocalImgData({
                            localId: src, // 图片的localID
                            success: function (res) {
                                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                success({
                                    src:localData,
                                    id:localData,
                                    info:null
                                })
                            }
                        });
                    }else{
                        wx.uploadImage({
                            localId: src, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                let serverId = res.serverId; // 返回图片的服务器端ID
                                success({
                                    src:src,
                                    id:serverId,
                                    info:null
                                })
                            }
                        });
                    }
                }
            });
        })
    },

    //报错提示并返回
    async error(text){
        var _this = this;
        console.log(text);

        // if(this[isDebug]){
        text = text || "网络连接出现了一点问题，请重新尝试";
        // }else{
        // 	text = "系统错误，请稍后在试";
        // }

        await this.alert(text);

        if(!_this[isDebug]){
            _this.goBack();
        }
    },


    //后退提示表单有变动
    //表单是否变化需要自己判断
    inputChangeBackAlert(){
        let _this = this;
        window.addEventListener("popstate",async function(e){
            if(e.state && e.state.input_change){
                if(await _this.confirm("确定放弃保存？")){
                    _this.goBack();
                }else{
                    _this.inputChangeBackAlert();
                }

                // _this.confirm("确定放弃保存？",function(){
                //     _this.goBack();
                // },function(){
                //     _this.inputChangeBackAlert();
                // });
            }
        },false);
        history.replaceState({input_change:true},"",window.location.href);
        history.pushState("", "", window.location.href);
    },

    //页面缓存 数据
    pageCatch : {
        async get(key){
            return new Promise((success,error)=>{
                let val = localStorage.getItem(key) || "";
                success(val);
            })
        },
        async save(key,val){
            return new Promise((success,error)=>{
                localStorage.setItem(key,val);
                success();
            });
        },
        async del(key){
            return new Promise((success,error)=>{
                localStorage.removeItem(key);
                success();
            })
        }
    },

    //删除html标签
    delHtmlTag(str){
        return str.replace(/<[^>]+>/g,"");    //去掉所有的html标记
    },

    //获取本地缓存数据
    appLocalData:{
        get(key){
            return new Promise((success,error)=>{
                let data = localData.getItem(key);
                success(data);

            })
        },
        set(key,val){
            return new Promise((success,error)=>{
                localData.setItem(key,val);
                success();
            })
        }
    },
    mdfSoftKeyBoardBug(){
        let has = false;
        $('input').each(function(){
            this.addEventListener('touchstart',function(e){
                has = true;
                e.stopPropagation();
            },device.eventParam)
        });
        document.body.addEventListener('touchstart',function(){
            if(has){
                has = false;
                $('input').blur();
                setTimeout(function(){
                    let top = $("body").scrollTop();
                    $("html,body").animate({scrollTop:top+'px'},0);
                },100)
            }

        },device.eventParam)
    },


    //微信中  获取图片base64
    wxGetImageBase64FromLocal(){
        return new Promise((success,error)=>{
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'], // original原图   compressed压缩
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    let localIds = res.localIds,
                        src= localIds[0];

                    wx.getLocalImgData({
                        localId: src, // 图片的localID
                        success: function (res) {
                            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示


                            if(device.isAndroid){
                                // let base64 = new base64Fn();
                                // localData = base64.encode(localData);
                                localData = 'data:image/jpg;base64,'+localData;
                            }
                            if(device.isIphone || device.isIpad){
                                localData = localData.split('base64,') || [];
                                localData = localData[1] || '';
                                localData = 'data:image/jpg;base64,'+localData;
                            }

                            success(localData);
                        }
                    });
                }
            });
        });
    },


    //history 处理类
    history:{
        addEvent(fn){
            fn = fn || function(){};
            window.addEventListener("popstate", function() {
                //获取之前的页面id
                let currentState = history.state || {};
                fn(currentState);
                // console.log(currentState)
            });
        },
        //当前页面增加缓存数据
        //传入 json对象
        save(data,url){
            url = url || window.location.href;
            window.history.replaceState(data,'',url);
        },
        //增加历史记录,并新开页面
        add(data,url){
            url = url || window.location.href;
            window.history.pushState(data,'',url);
        }

    }


};



page[init](function(){
    //初始执行，优先于page.isReady中传入的函数

    //自动缓存参数，非app用
    page[autoSaveUrlParam]();
    if(device.isPhone){
        page.mdfSoftKeyBoardBug();
    }

}).then(()=>{
    if(page[isDebug]){
        console.log("初始化完成");
    }
}).catch(async e=>{
    errorHandler.error(e);
    if(page[isDebug]){
        console.log(e);
        await page.alert("网络连接出现了一点问题，请重新尝试");
    }else{
        await page.alert("网络连接出现了一点问题，请重新尝试;");
        page.goBack();
    }
});
module.exports = page;



