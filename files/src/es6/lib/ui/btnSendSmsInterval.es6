



//按钮发送短信后倒计时功能
//var sms = new DEVICE.btnSendSmsInterval({
//    //android有闪烁 不要用 ,ios可以用
//    useAnimate:(device.isIos || device.isIpad),
//    //按钮id
//    btnId:"send_sms",
//    //电话号码输入框id
//    phoneInputId:"phone",
//    //按钮可以点击的class名
//    canClickClass:"regest_send_yes",
//    //按钮不能点击的class
//    canNotClickClass:"regest_send_no",
//    //电话号码验证失败执行
//    error:function(text){
//
//    },
//    //清除失败时的样式，未更改样式可以不传
//    clearError:function(){
//
//    },
//    //电话号码验证成功执行ajax函数
//    ajaxFn:function(){
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
//});



let textChangeEffect = require('./textChangeEffect');


let btnSendSmsInterval = function(opt){
	this.btn = opt.btnId;
	this.phoneInputId = opt.phoneInputId;
	this.canClickClass = opt.canClickClass || "";
	this.canNotClickClass = opt.canNotClickClass || "";
	this.error = opt.error || function(){};
	this.clearError = opt.clearError || function(){};
	this.ajaxFn = opt.ajaxFn || function(){};
	this.intervalTime = opt.intervalTime || 60;
	this.intervalText = opt.intervalText || "{x}秒后重试";
	//android 有闪烁 不要启用
	this.useAnimate = opt.useAnimate || false;

	if(!this.btn || !this.phoneInputId){
		console.log("btnSendSmsInterval 参数错误！");
		return;
	}

	this.dom = $("#"+this.btn);
	this.phoen = $("#"+this.phoneInputId);
	this._interval = null;
	this.startText = this.dom.text();

	this.textEffectFn = null;

	this.init();
};

btnSendSmsInterval.prototype = {
	init:function(){
		this.bindEvent();

	},
	bindEvent:function(){
		var _this = this;

		//按钮事件绑定
		this.dom.click(function(){
			$('input').blur();
			let top = $(document).scrollTop();
			$(document).scrollTop(top);
			_this.clearError();

			//检查phoneNumber输入值
			if(_this.checkPhoneNumber()){
				//发送ajax

				_this.ajaxFn();

			}else{
				//显示错误
				_this.error("请输入11位手机号码！");
			}
		});
	},
	checkPhoneNumber:function(){
		var val = this.phoen.val(),
			reg = new RegExp(/^1\d{10}$/);

		return reg.test(val);
	},
	startInterval:function(){
		var _this = this;

		//删除事件绑定
		_this.dom.unbind("click");

		//设置样式
		this.dom.removeClass(this.canClickClass)
			.addClass(this.canNotClickClass);

		//计时器开始
		var _time = 0;



		if(_this.useAnimate){
			_this.dom.text('');
			_this.textEffectInterval(_this.dom);
			_this.textEffectFn.show(_this.intervalTime);
		}



		this._interval = setInterval(function(){
			_time++;
			if(_time >= _this.intervalTime){
				//重置class 文字
				_this.dom.removeClass(_this.canNotClickClass)
					.addClass(_this.canClickClass)
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
				// _this.dom.text(_text);
				// console.log(_text)
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
			bg:'rgb(255,255,255)',      //背景色  必须rgb  默认:rgb(255,255,255)
			fontSize:16,                //字体大小 @param:number  单位px
			fontColor:'rgb(0,202,174)',     //字体颜色 @param:rgb    默认:rgb(0,0,0)
			textAlign:'center',
			fontSizeUnit:'px'          //字体大小使用单位 @param:str  默认:rem
		});
	}
};


module.exports = btnSendSmsInterval;