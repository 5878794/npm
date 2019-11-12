



//按钮发送短信后倒计时功能
// var sms = new DEVICE.btnSendSmsInterval({
//    //按钮dom
//    dom:$('#a'),   domObj/jqObj
//    //android有闪烁 不要用 ,ios可以用
//    useAnimate:(device.isIos || device.isIpad),
//    //按钮可以点击的css名
//    canClickCss:{background:'red'},
//    //按钮不能点击的css
//    canNotClickCss:{background:'#ccc'},
//    //按钮点击执行
//    clickFn:function(){
//         //表单检查。。。
//        //ajax。。。
//
//        //ajax成功后执行，开始倒计时
//        sms.startInterval();
//
//    },
//    //倒计时时间
//    intervalTime:60,
//    //倒计时按钮显示的文字，{x}为变量。
//    intervalText:"{x}秒后重试"
// });



let textChangeEffect = require('./textChangeEffect'),
	$$ = require('../event/$$');


let btnSendSmsInterval = function(opt){
	this.canClickCss = opt.canClickCss || "";
	this.canNotClickCss = opt.canNotClickCss || "";
	this.intervalTime = opt.intervalTime || 60;
	this.intervalText = opt.intervalText || "{x}秒后重试";
	//android 有闪烁 不要启用
	this.useAnimate = opt.useAnimate || false;
	this.clickFn = opt.clickFn || function(){};

	this.bgColor = opt.bgColor || 'rgb(255,255,255)';
	this.fontSize = opt.fontSize || 16;
	this.fontColor = opt.fontColor || 'rgb(0,202,174)';
	this.textAlign = opt.textAlign || 'center';
	this.fontSizeUnit = opt.fontSizeUnit || 'px';

	this.dom = $(opt.dom);
	this._interval = null;
	this.startText = this.dom.text();

	this.textEffectFn = null;

	this.init();
};

btnSendSmsInterval.prototype = {
	init:function(){
		// this.dom.css({
		// 	background:this.bgColor,
		// 	'font-size':this.fontSize+this.fontSizeUnit,
		// 	'text-align':this.textAlign,
		// 	color:this.fontColor
		// });


		this.bindEvent();

	},
	bindEvent:function(){
		var _this = this;

		//按钮事件绑定
		$$(this.dom).myclickok(function(){
			_this.clickFn();
		});
	},
	startInterval:function(){
		var _this = this;

		//删除事件绑定
		$$(_this.dom).unbind(true);

		//设置样式
		this.dom.css(this.canNotClickCss);

		//计时器开始
		var _time = 0;



		if(_this.useAnimate){
			_this.dom.text('');
			_this.textEffectInterval(_this.dom);
			let text = this.intervalText.replace("{x}",_this.intervalTime);
			_this.textEffectFn.show(text);
		}



		this._interval = setInterval(function(){
			_time++;
			if(_time >= _this.intervalTime){
				//重置class 文字
				_this.dom.css(_this.canClickCss)
					.text(_this.startText);
				//事件绑定
				_this.bindEvent();
				if(_this.useAnimate){
					_this.textEffectFn.destroy();
				}

				//清除定时器
				clearInterval(_this._interval);
			}else{
				var __time = _this.intervalTime - _time,
					_text = _this.intervalText.replace("{x}",__time);
				if(_this.useAnimate){
					_this.textEffectFn.show(_text);
				}else{
					_this.dom.text(_text);
				}

			}
		},1000)

	},
	textEffectInterval:function(btnDom){
		this.textEffectFn = new textChangeEffect({
			dom:btnDom,                 //容器dom @param:jqobj
			bg:this.bgColor,      //背景色  必须rgb  默认:rgb(255,255,255)
			fontSize:this.fontSize,                //字体大小 @param:number  单位px
			fontColor:this.fontColor,     //字体颜色 @param:rgb    默认:rgb(0,0,0)
			textAlign:this.textAlign,
			fontSizeUnit:this.fontSizeUnit          //字体大小使用单位 @param:str  默认:rem
		});
	}
};


module.exports = btnSendSmsInterval;