
// banner元素 自动缩放
//---------------------------------
// 内部第一个标签必须a包裹，a会自动绝对定位
// a标签内可以包裹任意东西


//html
// b-banner(class='banner' imgWH='1280:720')
// 	a
// 		div(class='banner_item box_scc')
// 			p 阿道夫精啊考试的积分链接快放假啊善良的咖啡机
// 			p 阿迪深刻理解发生快乐的就犯困啦圣诞节风口浪尖阿斯顿发空间啊
// 		div(class='banner_mp4')
// 			video(muted src='../res/mp4/1.mp4' width="100%" height="100%" loop="loop" preload="auto" autoplay="autoplay")


// @param:   imgWH banner的宽高比例
// @param:   jg  动画停顿时间
// @param:   animateTime  动画运动时的时间
// @param:   animateDir  动画方向 默认：row横向  cel纵向
// @param:   pointColor  点选中和未选中时的颜色  'rgb(70,65,68):#fff'
// @param:   leftBtnId   控制左右滚动点按钮id
// @param:   rightBtnId
// @param:   notShowPoint  不显示下面的指示点  'true'  'false'

let addStyleFile = require('../fn/addStyleFile'),
	bannerFn = require('../../lib/ui/bannerScroll_customElement');

let createDom = Symbol(),
	autoHeight = Symbol();

class bBanner extends HTMLElement{
	constructor() {
		super();

		this.shadow = this.attachShadow({mode: 'open'});

		let all = addStyleFile('../res/css/common.css');
		this.shadow.appendChild(all);

		this[createDom]();

		this.body = $(this);
		this.body.css({
			overflow:'hidden',
			display:'block'
		})


		let jg = parseInt($(this).attr('jg')) || 5000,
			animateTime = parseInt($(this).attr('animateTime')) || 1200,
			imgWidthHeight = $(this).attr('imgWH'),
			pointColor = $(this).attr('pointColor') || 'rgb(70,65,68):#fff',
			animateDir = $(this).attr('animateDir') || 'row',
			leftBtnId = $(this).attr('leftBtnId') || '',
			rightBtnId = $(this).attr('rightBtnId') || '',
			notShowPoint = $(this).attr('notShowPoint');
		notShowPoint = (notShowPoint=='true')? false : true;
		pointColor = pointColor.split(':');

		let leftBtn = (leftBtnId)? $('#'+leftBtnId) : null,
			rightBtn = (rightBtnId)? $('#'+rightBtnId) : null;


		this.bannerObj = new bannerFn({
			win: this.body,                      //@param:jqobj    外层窗口
			body: this.main,        //@param:jqobj    滑动层
			pointBody:$(this.shadow),
			time: jg,                     //@param:number   滑动间隔时间
			dir:animateDir,
			animateTime: animateTime,         //@param:number   滑动动画时间
			showPoint:notShowPoint,                //@param:number   是否显示下面的小点
			pointBg:pointColor[0],
			pointSelectBg:pointColor[1],
			pointMarginBottom:'60px',
			leftBtn:leftBtn,  //@param:jqobj    左滑动按钮
			rightBtn:rightBtn  //@param:jqobj    右滑动按钮
		 // changeStartFn:function(page){}, //@param:fn       滑动开始时执行函数，传递当前要滑动到的页面number
		 // changeEndFn:function(page){}    //@param:fn       滑动结束时执行函数，传递当前要滑动到的页面number
		});


		if(imgWidthHeight){
			let val = imgWidthHeight.split(':');
			if(val.length == 2){
				this[autoHeight](val);
			}

		}
	}

	[createDom](){
		let div = $('<div></div>'),
			slot = $('<slot></slot>');

		this.main = div;
		div.append(slot);
		$(this.shadow).append(div);
	}


	[autoHeight](val){
		let w = val[0],
			h = val[1],
			banner = $(this);

		let fn = function(){
			let winWidth = parseInt(banner.width()),
				height = winWidth*h/w;

			banner.css({
				height:height+'px'
			});
			banner.find('a').css({
				height:height+'px'
			});
		};

		$(window).resize(function(){
			fn();
		});
		fn();
	}

	go(n){
		this.bannerObj.gotoPage = n;
	}

	refresh(){
		this.bannerObj.refresh();
	}

	destroy(){
		this.bannerObj.destroy();
	}

}



if(!customElements.get('b-banner')){
	customElements.define('b-banner', bBanner );
}





