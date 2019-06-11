
//*****************************************************
//获取浏览器或设备名称  以及版本号
//*****************************************************
//输出结果:
//---------------------------------------------------------
//DEVICE.isIpad             @param:bloom    是否是：ipad
//DEVICE.isIphone           @param:bloom    是否是：iphone

//DEVICE.isPhone			@param:bloom	是否是：移动设备，非pc
//DEVICE.isAndroid          @param:bloom    是否是：android
//DEVICE.isIos              @param:bloom    是否是：ios系统


//DEVICE.isIe               @param:bloom    是否是：ie
//DEVICE.isFirefox          @param:bloom    是否是：firefox
//DEVICE.isChrome           @param:bloom    是否是：chrome
//DEVICE.isOpera            @param:bloom    是否是：opera
//DEVICE.isSafari           @param:bloom    是否是：safari
//DEVICE.isWeChat           @param:bloom    是否是：微信浏览器

//DEVICE.isPc				@param:bloom	是否是：pc
//DEVICE.isMac              @param:bloom	是否是：mac系统
//DEVICE.isWin              @param:bloom	是否是：window系统
//DEVICE.isLinux            @param:bloom	是否是：linux系统



//DEVICE.ver                @param:number   浏览器版本或  ipad/iphone/android系统版本
//---------------------------------------------------------




var Sys = {},
	DEVICE = {};
var ua = navigator.userAgent.toLowerCase();
var s = ua.match(/ipad; cpu os ([\d_]+)/)? Sys.ipad = s[1].replace(/_/g, ".") :
		(s = ua.match(/iphone os ([\d_]+)/)) ? Sys.iphone = s[1].replace(/_/g, ".") :
		(s = ua.match(/android[ \/]([\d.]+)/)) ? Sys.android = s[1] :
		(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : Sys._ = 0;


DEVICE.isIpad = (Sys.hasOwnProperty("ipad"));
DEVICE.isIphone = (Sys.hasOwnProperty("iphone"));
DEVICE.isAndroid = (Sys.hasOwnProperty("android"));
DEVICE.isIe = (Sys.hasOwnProperty("ie"));
DEVICE.isFirefox = (Sys.hasOwnProperty("firefox"));
DEVICE.isChrome = (Sys.hasOwnProperty("chrome"));
DEVICE.isOpera = (Sys.hasOwnProperty("opera"));
DEVICE.isSafari = (Sys.hasOwnProperty("safari"));
DEVICE.isWeChat = (ua.match(/MicroMessenger/i) == "micromessenger");
DEVICE.ver = 0;


var ver;
for (var key in Sys) {
	if (Sys.hasOwnProperty(key)) {
		ver = Sys[key];
	}
}
ver = ver.split(".");
var _ver = [];
for (var i = 0, l = ver.length; i < l; i++) {
	if (i >= 2) {
		break;
	}
	_ver.push(ver[i]);
}
_ver = _ver.join(".");
DEVICE.ver = _ver;


DEVICE.isPhone = (DEVICE.isAndroid || DEVICE.isIpad || DEVICE.isIphone);
DEVICE.isIos = (DEVICE.isIpad || DEVICE.isIphone);



var p = navigator.platform;
var win = p.indexOf("Win") == 0;
var mac = p.indexOf("Mac") == 0;
var x11 = (p == "X11") || (p.indexOf("Linux") == 0);

DEVICE.isPc = (win || mac || x11);
DEVICE.isMac = mac;
DEVICE.isWin = win;
DEVICE.isLinux = x11;



module.exports = DEVICE;


