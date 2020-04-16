

//==========================================================
//switch开关按钮
//==========================================================

// html:
// 可设置的属性,也可以在js中设置
// js中设置直接   banner.xxx = xxx;
// @attr：val                     bool:是否选中     默认：false
// @attr:circleColor              str:中心圆的颜色   默认：白色
// @attr:checkBgColor             str:选中时的背景色 默认：#51ccee
// @attr:notCheckBgColor          str:未选中的背景色 默认：#ccc
// @attr:borderColor              str:外框的颜色     默认：#ccc
// @attr:textShadowColor          str:文字阴影色     默认：#ddd
// @attr:textColor                str:文字颜色      默认：#fff
// @attr:onText                   str:开的文字      默认：ON
// @attr:offText                  str：关的文字      默认：OFF
// 	<b-switch style="..."></b-switch>

//js:
// 	let dom = $('b-switch').get(0);
// 	dom.val = true;
// 	dom.checkBgColor = 'red';




let $$ = require('../lib/event/$$');

let bodyDom = Symbol('bodyDom'),
	init = Symbol('init'),
	refresh = Symbol('refresh'),
	circleDom = Symbol('circleDom'),
	changeDom = Symbol('changeDom'),
	onDom = Symbol('onDom'),
	offDom = Symbol('offDom'),
	setParam = Symbol('setParam'),
	moveLength = Symbol('moveLength'),
	createBody = Symbol('createBody'),
	addEvent = Symbol('addEvent');




//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


class bSwitch extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		return [
			"val",
			"checkbgcolor",
			"notcheckbgcolor",
			"bordercolor",
			"textshadowcolor",
			"textcolor",
			"ontext",
			"offtext"
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {
		if(this[bodyDom]){
			this[refresh]();
		}
	}

	//元素加入页面回调
	connectedCallback() {
		this.width = parseInt($(this).width());
		this.height = parseInt($(this).height());
		this[init]();

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
		this[circleDom] = null;
		this[onDom] = null;
		this[offDom] = null;

		this[moveLength] = 0;
		this.height = 0;
		this.width = 0;

		//在 setParam 中设置的
		this.param = {
			circleColor:null,
			checkBgColor:null,
			notCheckBgColor:null,
			borderColor:null,
			textShadowColor:null,
			textColor:null,
			onText:null,
			offText:null,
			val:false
		};

	}

	[init](){
		this[setParam]();
		this[createBody]();
		this[addEvent]();
		this[refresh]();
	}

	[setParam](){
		this.param.circleColor = $(this).attr('circlecolor') || '#fff';
		this.param.checkBgColor = $(this).attr('checkbgcolor') || '#51ccee';
		this.param.notCheckBgColor = $(this).attr('notcheckbgcolor') || '#ccc';
		this.param.borderColor = $(this).attr('borderColor') || '#ccc';
		this.param.textShadowColor = $(this).attr('textShadowColor') || '#ddd';
		this.param.textColor = $(this).attr('textColor') || '#fff';
		this.param.onText = $(this).attr('onText') || 'ON';
		this.param.offText = $(this).attr('offText') || 'OFF';
		this.param.val = ($(this).attr('val') === 'true');
	}

	//connectedCallback 中触发
	//加入到dom到时候会触发改函数
	[createBody](){
		let div = $('<div></div>'),
			span = $('<span></span>'),
			on = $('<span>'+this.param.onText+'</span>'),
			off = $('<span>'+this.param.offText+'</span>');

		let border = this.height/15,
			width =  this.width - border*2,
			height = this.height - border*2,
			radio = this.height/2,
			move = width - height;

		this[moveLength] = move;

		div.css({
			position:'relative',
			top:border+'px',
			left:border+'px',
			width: width+'px',
			height:height+'px',
			'transition': 'all 0.3s',
			background:this.param.notCheckBgColor,
			'box-shadow':'0px 0px 0px '+border+'px '+this.param.borderColor,
			'border-radius':radio+'px',
			overflow:'hidden'
		});

		span.css({
			position:'absolute',
			top: 0,
			left: 0,
			width:height+'px',
			height:height+'px',
			'z-index':10,
			'border-radius':radio+'px',
			'background-color':this.param.circleColor,
			'transition': 'all 0.3s'
		});

		let btnCss = {
			'line-height':height+'px',
			'font-size': radio+'px',
			'text-shadow': '0 0 '+radio/15+'px '+this.param.textShadowColor,
			color: this.param.textColor,
			display:'inline-block',
			position:'absolute',
			top:'0',
			height:height+'px'
		};

		on.css(btnCss).css({left:'0.5em',display:'none'});
		off.css(btnCss).css({right:'0.5em'});


		div.append(span).append(on).append(off);

		this[circleDom] = span;
		this[bodyDom] = div;
		this[onDom] = on;
		this[offDom] = off;

		this.shadow.appendChild(div.get(0));
	}

	[addEvent](){
		let _this = this;

		$$(this[bodyDom]).myclickok(function(){
			_this[changeDom]();
		});
	}

	[changeDom](){
		let state = ($(this).attr('val') === 'true');
		$(this).attr({val:!state});
	}

	[refresh](){
		this[setParam]();
		let state = ($(this).attr('val') === 'true');

		if(state){
			this[bodyDom].css({background:this.param.checkBgColor});
			this[onDom].css({display:'inline-block'});
			this[offDom].css({display:'none'});
			this[circleDom].css({transform:'translateX('+this[moveLength]+'px)'});
		}else{
			this[bodyDom].css({background:this.param.notCheckBgColor});
			this[onDom].css({display:'none'});
			this[offDom].css({display:'inline-block'});
			this[circleDom].css({transform:'translateX(0px)'});
		}

		this[bodyDom].css({
			'box-shadow':'0px 0px 0px '+this.height/15+'px '+this.param.borderColor
		});
		this[circleDom].css({
			'background-color':this.param.circleColor
		});
		this[onDom].css({
			'text-shadow': '0 0 '+this.height/30+'px '+this.param.textShadowColor,
			color: this.param.textColor
		}).text(this.param.onText);
		this[offDom].css({
			'text-shadow': '0 0 '+this.height/30+'px '+this.param.textShadowColor,
			color: this.param.textColor
		}).text(this.param.offText);
	}



	get val(){
		return this.param.val;
	}
	set val(val){
		val = (val)? true : false;
		this.param.val = val;
		$(this).attr({val:val});
	}

	get checkBgColor(){
		return this.param.checkBgColor;
	}
	set checkBgColor(val){
		this.param.checkBgColor = val;
		$(this).attr({checkBgColor:val});
	}

	get notCheckBgColor(){
		return this.param.notCheckBgColor;
	}
	set notCheckBgColor(val){
		this.param.notCheckBgColor = val;
		$(this).attr({notCheckBgColor:val});
	}

	get circleColor(){
		return this.param.circleColor;
	}
	set circleColor(val){
		this.param.circleColor = val;
		$(this).attr({circleColor:val});
	}

	get borderColor(){
		return this.param.borderColor;
	}
	set borderColor(val){
		this.param.borderColor = val;
		$(this).attr({borderColor:val});
	}

	get textShadowColor(){
		return this.param.textShadowColor;
	}
	set textShadowColor(val){
		this.param.textShadowColor = val;
		$(this).attr({textShadowColor:val});
	}

	get textColor(){
		return this.param.textColor;
	}
	set textColor(val){
		this.param.textColor = val;
		$(this).attr({textColor:val});
	}

	get onText(){
		return this.param.onText;
	}
	set onText(text){
		this.param.onText = text;
		$(this).attr({onText:text});
	}

	get offText(){
		return this.param.offText;
	}
	set offText(text){
		this.param.offText = text;
		$(this).attr({offText:text});
	}
}




if(!customElements.get('b-switch')){
	customElements.define('b-switch', bSwitch );
}
