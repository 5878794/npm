
//viewport设置，高精度效果图用。 可能动画性能降低？
//设置了viewport宽度后，最好用rem单位布局。


//使用时meta需要设置
//<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">
//psd_width 需要设置psd的实际输出宽度
//psd中的元素布局按实际大小除以100，然后使用rem为单位


//改变viewport大小

let setFn = function(psdWidth){
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
	win_width = window.innerWidth;
	rem = win_width/psd_width*100;

	style.innerHTML = "html{font-size:"+rem+"px!important;}";
	document.querySelector("head").appendChild(style);

	//有些浏览器viewport宽度获取不准确
	//因此初始不停刷新页面字体
	let temp_interval = setInterval(function () {

		win_width = window.innerWidth;
		let _rem = win_width/psd_width*100;
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
		win_width = window.innerWidth;
		rem = win_width/psd_width*100;
		style.innerHTML = "html{font-size:"+rem+"px!important;}";
	});

};


//延迟显示body  600ms
// let style = require('../css/style');
// let id = '__temp__body__hide__';
// let imgSrc = 'data:image/png;base64,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';
// let imgSrc = '#';

// let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><circle cx="50" cy="50" r="50" stroke="black" stroke-width="2" fill="red" /></svg>';
// let svgHref = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));

//添加一个页面等待时的背景logo于html上
// style.add('body{visibility:hidden;}html{background:#e8e8e8;}',id);
// setTimeout(function(){
// 	// $('body').css({visibility:'unset'});
// 	document.head.removeChild(document.getElementById(id));
// },600);


module.exports = setFn;

