


//==========================================================
//发送短信按钮，发送成功按钮倒计时
//==========================================================

// html:
//  可设置的属性,也可以在js中设置，最后需要运行dom.run()方法才会生效
//  注意：运行 .run()方法后改属性无效咯。。。
//  js中设置直接   dom.xxx = xxx;

//  @attr:canClickCss           //能点击时的样式
//  @attr:canNotClickCss        //不能点击时的样式
//      这2个属性  写入attr时是  display:block;
//                写入js时是   {display:'block'};
//  @attr:intervalTime          //number 倒计时的长度
//  @attr:intervalText          //str 倒计时 时的文字 eg:'{x}秒后重试' {x}不能改
//  @attr:text                  //str 按钮显示的文字

//  @attr:bgColor               //str 倒计时的背景颜色 必须为rgb值
//  @attr:fontColor             //str 倒计时的文字颜色 必须为rgb值
//  @attr:fontSize              //number 倒计时的字体大小
//  @attr:textAlign             //str 倒计时的文字对齐 'left','center'
//  @attr:fontSizeUnit          //str 倒计时的文字大小单位  eg:'px' 'rem'
// 	<b-sms-btn style="..."></b-sms-btn>


// js
//  //获取元素
// let dom = $('b-sms-btn').get(0);
//  //设置属性
// dom.intervalTime = 60;
// dom.intervalText = '{x}秒';
// dom.fontColor = 'rgb(0,0,0)';
// dom.bgColor = 'rgb(255,255,255)';
// dom.fontSize = '16';
//  //设置按钮事件
// dom.runFn = async function(){
//      //表单验证
//      //ajax 请求。。。
//
//      //请求成功，开始倒计时，不成功不处理
//      dom.success();
// }
//  //开始执行
// dom.run();



//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');



let btnSendSmsFn = require('../lib/ui/btnSendSmsInterval_custom'),
	device = require('../lib/device');

let setParam = Symbol('setParam'),
	param = Symbol('param'),
	bodyDom = Symbol('bodyDom'),
	createDom = Symbol('createDom'),
	runFn = Symbol('runFn'),
	setLineHeight = Symbol('setLineHeight'),
	objFn = Symbol(objFn);

class bSmsBtn extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'canclickcss',
			'cannotclickcss',
			'intervaltime',
			'intervaltext',
			'bgcolor',
			'fontsize',
			'fontcolor',
			'textalign',
			'fontsizeunit'
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
		this[setLineHeight]();
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
		this[runFn] = function(){};
		this[objFn] = null;
		this[param] = {
			text:'',
			canClickCss:{},
			canNotClickCss:{},
			intervalTime:60,
			intervalText:'{x}秒后重试',
			bgColor:'rgb(255,255,255)',
			fontSize:16,
			fontColor:'rgb(0,0,0)',
			textAlign:'center',
			fontSizeUnit:'px'
		};
		this[createDom]();
	}

	[setParam](){
		let canClickCss = $(this).attr('canClickCss') || '',
			canNotClickCss = $(this).attr('canNotClickCss') || '',
			intervalTime = parseInt($(this).attr('intervalTime')) || 60,
			intervalText = $(this).attr('intervalText') || '{x}秒后重试',
			text = $(this).attr('text') || '点击发送短信',
			canClickCssObj = {},
			canNotClickCssObj = {},
			bgColor = $(this).attr('bgColor') || 'rgb(255,255,255)',
			fontSize = parseInt($(this).attr('fontSize')) || '16',
			fontColor = $(this).attr('fontColor') || 'rgb(0,0,0)',
			textAlign = $(this).attr('textAlign') || 'center',
			fontSizeUnit = $(this).attr('fontSizeUnit') || 'px';

		canClickCss = canClickCss.split(';') || [];
		canClickCss.map(rs=>{
			let items = rs.split(':');
			if(items.length == 2){
				canClickCssObj[items[0]] = items[1];
			}
		});
		canNotClickCss = canNotClickCss.split(';') || [];
		canNotClickCss.map(rs=>{
			let items = rs.split(':');
			if(items.length == 2){
				canNotClickCssObj[items[0]] = items[1];
			}
		});

		//按钮本身样式
		this[param].canClickCss = canClickCssObj;
		this[param].canNotClickCss = canNotClickCssObj;
		this[param].intervalTime = intervalTime;
		this[param].intervalText = intervalText;
		this[param].text = text;

		//按钮倒计时中间文字 的css样式
		//有可能是canvas画的
		this[param].bgColor = bgColor;
		this[param].fontSize = fontSize;
		this[param].fontColor = fontColor;
		this[param].textAlign = textAlign;
		this[param].fontSizeUnit = fontSizeUnit;


		this[bodyDom].text(text);
		this[bodyDom].css(canNotClickCssObj);
	}

	[setLineHeight](){
		let height = parseInt(this[bodyDom].height());
		this[bodyDom].css({
			'line-height':height+'px'
		});
	}

	[createDom](){
		let div = $('<div>'+this.text+'</div>');
		div.css({
			width:'100%',
			height:'100%',
			display:'block',
			'line-height':'100%',
			'text-align':'center'
		});

		div.css(this[param].canClickCss);

		this[bodyDom] = div;
		this.shadow.appendChild(div.get(0));
	}

	run(){
		let _this = this;
		this[objFn] = new btnSendSmsFn({
			//按钮dom
			dom:this[bodyDom],   //domObj/jqObj
			//android有闪烁 不要用 ,ios可以用
			useAnimate:(device.isIphone || device.isIpad),
			//按钮可以点击的css名
			canClickCss:this[param].canClickCss,
			//按钮不能点击的css
			canNotClickCss:this[param].canNotClickCss,
			//按钮点击执行
			clickFn:function(){
				_this[runFn]();
			},
			//倒计时时间
			intervalTime:this[param].intervalTime,
			//倒计时按钮显示的文字，{x}为变量。
			intervalText:this[param].intervalText,

			bgColor:this[param].bgColor,
			fontSize:this[param].fontSize,
			fontColor:this[param].fontColor,
			textAlign:this[param].textAlign,
			fontSizeUnit:this[param].fontSizeUnit
		});
	}

	success(){
		this[objFn].startInterval();
	}

	get runFn(){
		return this[runFn];
	}
	set runFn(fn){
		this[runFn] = fn;
	}

	get text(){
		return this[param].text;
	}
	set text(text){
		$(this).attr({text:text});
	}

	get canClickCss(){
		return this[param].canClickCss;
	}
	set canClickCss(css){
		let text = [];
		for(let [key,val] of Object.entries(css)){
			text.push(key+':'+val);
		}
		text = text.join(';');
		text += ';';

		$(this).attr({canClickCss:text});
	}

	get canNotClickCss(){
		return this[param].canNotClickCss;
	}
	set canNotClickCss(css){
		let text = [];
		for(let [key,val] of Object.entries(css)){
			text.push(key+':'+val);
		}
		text = text.join(';');
		text += ';';

		$(this).attr({canNotClickCss:text});
	}

	get intervalTime(){
		return this[param].intervalTime;
	}
	set intervalTime(time){
		$(this).attr({intervalTime:time});
	}

	get intervalText(){
		return this[param].intervalText;
	}
	set intervalText(text){
		$(this).attr({intervalText:text});
	}

	get bgColor(){
		return this[param].bgColor;
	}
	set bgColor(val){
		$(this).attr({bgColor:val});
	}

	get fontSize(){
		return this[param].fontSize;
	}
	set fontSize(val){
		$(this).attr({fontSize:val});
	}

	get fontColor(){
		return this[param].fontColor;
	}
	set fontColor(val){
		$(this).attr({fontColor:val});
	}

	get textAlign(){
		return this[param].textAlign;
	}
	set textAlign(val){
		$(this).attr({textAlign:val});
	}

	get fontSizeUnit(){
		return this[param].fontSizeUnit;
	}
	set fontSizeUnit(val){
		$(this).attr({fontSizeUnit:val});
	}
}



if(!customElements.get('b-sms-btn')){
	customElements.define('b-sms-btn', bSmsBtn );
}
