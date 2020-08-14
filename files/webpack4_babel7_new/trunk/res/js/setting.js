/**
 * Created by beens on 2017/4/18.
 */


(function(){
	//服务器地址
	//开发
	var serverUrl = 'http://47.105.184.219:8089',
		downloadFileUrl = 'https://golden-system.oss-cn-beijing.aliyuncs.com/';


	//正式
	// var serverUrl = "https://tcm.care4u.cn:8443/ess/";



	//内测
	// var serverUrl = 'https://testedu.care4u.cn:8443/ess/';
	// var serverUrl = 'https://testedu1.care4u.cn:8443/ess/';


	//测试
	// var serverUrl = 'https://jy.care4u.cn:8499/ess/';


	var psd_width = 750;



	window.SETTING = {
		serverUrl:serverUrl,
		downloadFileUrl:downloadFileUrl,

		//js报错提交地址
		jsErrorReportUrl:'',

		//-----------------------------------------------
		//是否是app
		isAPP : false,

		//


		//公共js库，单页面用
		publishJS:[
			// 'polyfill.js',
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
		//接口版本
		apiVer:"1.0",

		//是否检查版本强制刷新
		isCheckVer:false

	};
})();
