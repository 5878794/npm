/**
 * Created by beens on 2017/4/18.
 */


(function(){
	//服务器地址
	//正式
	// var serverUrl = "//phr.care4u.cn/";
	//测试

	// https://tcm.care4u.cn:8443/ess/static/wechat/index.html?urlCode=3105075e2803

	var serverUrl = '/bens/';
	// var serverUrl = "https://jy.care4u.cn/ess/";
	// var serverUrl = "http://110.185.187.117/ess/";
	//正式
	// var serverUrl = "https://tcm.care4u.cn:8443/ess/";


	// var serverUrl = '//tcm.care4u.cn:8443/ess/';
	// var serverUrl = 'https://10.254.72.7:8443/ess/';

	//测试
	// var serverUrl = 'https://jy.care4u.cn:8443/ess/';


	// var serverUrl = "//tcm.care4u.cn:8080/ess/";
	var psd_width = 750;

	window.SETTING = {
		serverUrl:serverUrl,

		//-----------------------------------------------
		//是否是app
		isAPP : false,

		//


		//公共js库，单页面用
		publishJS:[
			'polyfill.js',
			'jquery-3.1.1.min.js',
			'setting.js',
			'common.min.js',
			'sign_page_init.min.js'
		],

		//-----------------------------------------------
		//是否是调试
		isDebug: false,



		//-----------------------------------------------
		//是否需要初始加载js字典和服务器的配置文件
		//需要加载的js列表
		needLoadOtherJsList:[
			// serverUrl+"config/js/config.js"
		],



		//-----------------------------------------------
		//是否需要加载微信api 需要才设置
		//微信js库地址
		weChatJsUrl:"//res.wx.qq.com/open/js/jweixin-1.2.0.js",
		//微信认证api接口
		weChatCertificationApi:serverUrl+"healthweixin/wx/getJsapi.do",
		//微信功能需要api列表,数组有值会自动加载js，和请求权限
		weChatUseApiList:[
			// 'closeWindow'
			// 'onMenuShareTimeline',
			// 'onMenuShareAppMessage',
			// 'showAllNonBaseMenuItem'
			// 'scanQRCode'
			// 'chooseImage',
			// 'uploadImage'
		],



		//-----------------------------------------------
		//一些自动化需要的参数

		//链接传入的参数列表，方便后面直接获取，重名的会被覆盖
		//如a页面地址带入userToken，b页面也带入该参数，获取时会取到最后带入参数时的值
		//最好放每个页面都需要的参数
		//app不支持
		saveUrlParamList:[
			// "userToken"
		],
		//页面传入token时设置的key
		tokenKeyFromUrl:"",


		//pug模版编译成js后相对于html的路径
		pugTemplatePath:"./template/",


		//-----------------------------------------------
		//版本说明
		ver:"1.0"



	};

	var win_width = window.innerWidth || window.outerWidth,
		viewport = document.querySelector('meta[name="viewport"]'),
		dpr = window.devicePixelRatio || 1,
		scale = 1 / dpr,
		rem;

// 设置meta
// 由于cordova app内嵌初始屏幕宽度获取有问题,只能设置width=device-width 不能设置实际的像素宽度在缩放
// 需要自行切换注释
	if(viewport){
		// viewport.setAttribute('content', 'width= '+win_width*dpr+',initial-scale='+scale+',maximum-scale='+scale+', minimum-scale='+scale+',user-scalable=no');
		viewport.setAttribute('content', 'width= device-width,initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no');
	}else{
		// $("head").append('<meta name="viewport" content="width='+win_width*dpr+', initial-scale='+scale+', user-scalable=no, minimum-scale='+scale+', maximum-scale='+scale+'">');
		$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">');/**/
	}


//设置页面字体,可使用rem
	var style = document.createElement('style');
	win_width = window.innerWidth;
	rem = win_width/psd_width*100;

	style.innerHTML = "html{font-size:"+rem+"px!important;}";
	document.querySelector("head").appendChild(style);

//有些浏览器viewport宽度获取不准确
//因此初始不停刷新页面字体
	var temp_interval = setInterval(function () {

		win_width = window.innerWidth;
		var _rem = win_width/psd_width*100;
		console.log(win_width,psd_width,rem,1)
		if(rem != _rem){
			rem = _rem;
			style.innerHTML = "html{font-size:"+rem+"px!important;}";
		}
	},500);
//10秒后取消自动刷新
	setTimeout(function(){
		clearInterval(temp_interval);
	},10000);


//页面大小变化刷新
	window.onresize = function(){
		win_width = window.innerWidth;
		rem = win_width/psd_width*100;
		style.innerHTML = "html{font-size:"+rem+"px!important;}";
	};
})();
