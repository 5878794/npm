

//==========================================================
//banner滚动
//==========================================================


// html:
//  可设置的属性,也可以在js中设置，最后需要运行banner.run方法才会生效
//  js中设置直接   banner.xxx = xxx;
//  @attr:intervals             number 动画间隔时间
//  @attr:animateTime           number 动画时间
//  @attr:leftBtnId             str 左边按钮的id
//  @attr:rightBtnId            str 右边按钮的id
//  @attr:pointMarginBottom     str 指示点距离底部的距离 eg:10px或10rem
// 	<b-banner style="..."></b-banner>

// js
//  //获取元素
// 	let banner = $('b-banner').get(0);
//  //设置数据
// 	banner.data = [
// 		{href:'#',image:'http://pic37.nipic.com/20140113/8800276_184927469000_2.png'},
// 		{href:'#',image:'http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg'},
// 		{href:'#',image:'http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg'},
// 		{href:'#',image:'http://pic9.nipic.com/20100923/2531170_140325352643_2.jpg'}
// 	];
//  //开始执行
// 	banner.run();






//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let bannerFn = require('../lib/ui/bannerScroll'),
	bodyDom = Symbol('body'),
	winDom = Symbol('win'),
	objFn = Symbol('obj'),
	init = Symbol('init'),
	createBody = Symbol('createBody'),
	createList = Symbol('createList'),
	bindData = Symbol('bindData'),
	setParam = Symbol('setParam');


class bBanner extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			"intervals",
			"animatetime",
			"showpoints",
			"leftbtnid",
			"rightbtnid",
			"pointmarginbottom"
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {
		this[setParam]();
	}

	//元素加入页面回调
	connectedCallback() {
		// console.log('connect');
		this[setParam]();
	}

	//元素删除回调
	// disconnectedCallback(){
	// 	console.log('删除咯');
	// }

	constructor(){
		super();

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this[bodyDom] = null;
		this[winDom] = null;
		this[objFn] = null;


		this.changeStartFn = null;
		this.changeEndFn = null;
		this[bindData] = [];

		this.param = {
			intervals:2000,
			animateTime:600,
			showPoints:true,
			leftBtnId:null,
			rightBtnId:null,
			pointMarginBottom:null
		};


		this[init]();
	}


	[setParam](){
		let intervals = $(this).attr('intervals') || 2000,
			animateTime = $(this).attr('animateTime') || 600,
			showPoints = $(this).attr('showPoints') || false,
			leftBtnId = $(this).attr('leftBtnId') || null,
			rightBtnId = $(this).attr('rightBtnId') || null,
			pointMarginBottom = $(this).attr('pointMarginBottom') || null;

		intervals = parseInt(intervals);
		animateTime = parseInt(animateTime);
		showPoints = (showPoints === 'true');

		this.param.intervals = intervals;
		this.param.animateTime = animateTime;
		this.param.showPoints = showPoints;
		this.param.leftBtnId = leftBtnId;
		this.param.rightBtnId = rightBtnId;
		this.param.pointMarginBottom = pointMarginBottom;
	}


	[init](){
		this[createBody]();


		this[winDom].append(this[bodyDom]);
		this.shadow.appendChild(this[winDom].get(0));

	}


	[createBody](){
		let div = $('<div></div>'),
			div1 = $('<div></div>');

		div.css({
			width:'100%',
			height:'100%'
		});
		div1.css({
			width:'100%',
			height:'100%'
		});

		this[winDom] = div1;
		this[bodyDom] = div;
	}

	[createList](){
		// data=[{href:'',image:''}];

		let data = this[bindData];
		data.map(rs=>{
			this[bodyDom].append('<a href="'+rs.href+'" style="background-image:url('+rs.image+');background-size:100% 100%;"></a>')
		});
	}

	run(){
		if(this[objFn]){
			this[objFn].destroy();
		}

		this[createList]();

		let _this = this,
			win = this[winDom],
			body = this[bodyDom],
			intervals = this.param.intervals,
			animateTime = this.param.animateTime,
			showPoints = this.param.showPoints,
			pointMarginBottom = this.param.pointMarginBottom,
			leftBtn = (this.param.leftBtnId)? $('#'+this.param.leftBtnId) : null,
			rightBtn = (this.param.rightBtnId)? $('#'+this.param.rightBtnId) : null;

		this[objFn] = new bannerFn({
			win: win,                      //@param:jqobj    外层窗口
			body: body,        //@param:jqobj    滑动层
			time: intervals,                         //@param:number   滑动间隔时间
			animateTime: animateTime,             //@param:number   滑动动画时间
			showPoint:showPoints,                    //@param:number   是否显示下面的小点
			pointMarginBottom:pointMarginBottom,     //@param：str 显示的指示点距离底部距离
			leftBtn:leftBtn,    //@param:jqobj    左滑动按钮
			rightBtn:rightBtn,      //@param:jqobj    右滑动按钮
			changeStartFn:function(page){
				if(_this.changeStartFn){
					_this.changeStartFn.call(this,page);
				}
			},     //@param:fn       滑动开始时执行函数，传递当前要滑动到的页面number
			changeEndFn:function(page){
				if(_this.changeEndFn){
					_this.changeEndFn.call(this,page);
				}
			}        //@param:fn       滑动结束时执行函数，传递当前要滑动到的页面number
		})
	}

	get data(){
		return this[bindData];
	}
	set data(data){
		this[bindData] = data;
	}

	get changeStart(){
		return this.changeStartFn;
	}
	set changeStart(fn){
		this.changeStartFn = fn;
	}

	get changeEnd(){
		return this.changeEndFn;
	}
	set changeEnd(fn){
		this.changeEndFn = fn;
	}

	get intervals(){
		return this.param.intervals;
	}
	set intervals(val){
		val = parseInt(val);
		//属性有监听，赋值属性会自动写入this对象
		$(this).attr({intervals:val});
	}

	get animateTime(){
		return this.param.animateTime;
	}
	set animateTime(val){
		val = parseInt(val);
		//属性有监听，赋值属性会自动写入this对象
		$(this).attr({animateTime:val});
	}

	get showPoints(){
		return this.param.showPoints;
	}
	set showPoints(isShow){
		isShow = (isShow)? true : false;
		$(this).attr({showPoints:isShow});
	}

	get leftBtnId(){
		return this.param.leftBtnId;
	}
	set leftBtnId(id){
		$(this).attr({leftBtnId:id});
	}

	get rightBtnId(){
		return this.param.leftBtnId;
	}
	set rightBtnId(id){
		$(this).attr({rightBtnId:id});
	}

	get pointMarginBottom(){
		return this.param.pointMarginBottom;
	}
	//val:  40px  /   10rem  带单位的
	set pointMarginBottom(val){
		$(this).attr({pointMarginBottom:val});
	}
}

if(!customElements.get('b-banner')){
	customElements.define('b-banner', bBanner );
}
