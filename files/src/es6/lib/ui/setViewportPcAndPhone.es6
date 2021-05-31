
//viewport设置，高精度效果图用。 可能动画性能降低？
//设置了viewport宽度后，最好用rem单位布局。


//使用时meta需要设置
//<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">
//psd_width 需要设置psd的实际输出宽度
//psd中的元素布局按实际大小除以100，然后使用rem为单位


//改变viewport大小


let viewport = {
	psdWidth:750,
	pcMinWidth:799,
	style:null,
	setViewPort(){
		let viewport = document.querySelector('meta[name="viewport"]');
		if(viewport){
			// viewport.setAttribute('content', 'width= '+win_width*dpr+',initial-scale='+scale+',maximum-scale='+scale+', minimum-scale='+scale+',user-scalable=no');
			viewport.setAttribute('content', 'width= device-width,initial-scale=1,maximum-scale=1, minimum-scale=1,user-scalable=no');
		}else{
			// $("head").append('<meta name="viewport" content="width='+win_width*dpr+', initial-scale='+scale+', user-scalable=no, minimum-scale='+scale+', maximum-scale='+scale+'">');
			$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1">');/**/
		}
	},
	createStyle(){
		if(this.style){
			document.querySelector("head").removeChild(this.style);
		}

		let style = document.createElement('style');
		document.querySelector("head").appendChild(style);

		this.style = style;
	},
	init(psdWidth,pcMinWidth){
		this.psdWidth = psdWidth || 750;
		this.pcMinWidth = pcMinWidth || 799;
		this.setViewPort();
		this.createStyle();
		this.setStyle();
		this.LXSet();

		let _this = this;
		$(window).resize(function(){
			_this.setStyle();
		});

	},
	setStyle(){
		let winWidth = window.innerWidth;

		if(winWidth>this.pcMinWidth){
			this.style.innerHTML = '';
		}else{
			let rem = winWidth/this.psdWidth*100;
			this.style.innerHTML = `html{font-size:${rem}px!important;}body{font-size:.32rem;}`;
		}
	},
	LXSet(){
		let _this = this;

		let temp_interval = setInterval(function () {
			_this.setStyle();
		},500);

		//10秒后取消自动刷新
		setTimeout(function(){
			clearInterval(temp_interval);
		},10000);
	}
};








module.exports = function(psdWidth,pcMinWidth){
	viewport.init(psdWidth,pcMinWidth);
};

