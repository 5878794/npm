/**
 * Created by beens on 2017/4/18.
 */



var SETTING = {
	//服务器地址
	serverUrl:"//phr.care4u.cn/",              //正式
	// serverUrl:"//118.123.173.101:7001/",    //测试



	//-----------------------------------------------
	//是否是app
	isAPP : true,



	//-----------------------------------------------
	//是否是调试
	isDebug: false,



	//-----------------------------------------------
	//是否需要初始加载js字典和服务器的配置文件
	//需要加载的js列表
	needLoadOtherJsList:[
		this.serverUrl+"config/js/config.js"
	],



	//-----------------------------------------------
	//是否需要加载微信api 需要才设置
	//微信js库地址
	weChatJsUrl:"//res.wx.qq.com/open/js/jweixin-1.2.0.js",
	//微信认证api接口
	weChatCertificationApi:this.serverUrl+"healthweixin/wx/getJsapi.do",
	//微信功能需要api列表,数组有值会自动加载js，和请求权限
	weChatUseApiList:[
		'closeWindow'
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
		"userToken"
	],
	//页面传入token时设置的key
	tokenKeyFromUrl:"userToken",


	//pug模版编译成js后相对于html的路径
	pugTemplatePath:"./template/",


	//-----------------------------------------------
	//版本说明
	ver:"test1"



};
