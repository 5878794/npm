
//viewport设置，高精度效果图用。 可能动画性能降低？
//设置了viewport宽度后，最好用rem单位布局。


//使用时meta需要设置
//<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">
//psd_width 需要设置psd的实际输出宽度
//psd中的元素布局按实际大小除以100，然后使用rem为单位


//改变viewport大小

var a = (function(){
	var DEVICE = {};
	var p = navigator.platform;
	var win = p.indexOf("Win") == 0;
	var mac = p.indexOf("Mac") == 0;
	var x11 = (p == "X11") || (p.indexOf("Linux") == 0);


	DEVICE.isPc = (win || mac || x11);
	// DEVICE.isPhone = !DEVICE.isPc;
	DEVICE.isMac = mac;
	DEVICE.isWin = win;
	DEVICE.isLinux = x11;
	return DEVICE;
})();
if(a.isPc){
	var style = document.createElement('style');
	style.innerHTML = 'body{max-width:600px;margin:0 auto;}';
	document.head.appendChild(style);
}

var getWinWidth = function(){
	if(a.isPc){
		var wW = window.innerWidth;
		return (wW>600)? 600 : wW;
	}else{
		return window.innerWidth;
	}
};
var setFn = function(psdWidth){
	var psd_width = psdWidth,
		win_width = window.innerWidth || window.outerWidth,
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
	win_width = getWinWidth();
	rem = win_width/psd_width*100;

	style.innerHTML = "html{font-size:"+rem+"px!important;}";
	document.querySelector("head").appendChild(style);

	//有些浏览器viewport宽度获取不准确
	//因此初始不停刷新页面字体
	var temp_interval = setInterval(function () {

		win_width = getWinWidth();
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
	$(window).resize(function(){
		win_width = getWinWidth();
		rem = win_width/psd_width*100;
		style.innerHTML = "html{font-size:"+rem+"px!important;}";
	});

};




module.exports = setFn;

