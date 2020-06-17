



//==========================================================
//input控件
// b-input-sms
//==========================================================

// html
// b-input(name='名字:'           //输入框前面的标题。 如空不显示标题。
// key='aa'                  //服务器对应的key
// placeholder='测试。。。'    //提示文字
// rule='must,min:6'         //验证规则
// type='sms'                //输入框类型
// err='错。。。'              //验证错误显示提示信息
// icon='./image/aa.jpg'      //输入框前面图标地址，及大小  如空不显示icon
// iconWidth=20
// iconHeight=20
// )


// js
// 	var input = $('b-input-sms').eq(0).get(0);
// 	input.inputStyle = {color:'red'};   //设置样式
// 	input.nameStyle = {color:'red'};
// 	input.inputBodyStyle = {color:'red'};
// 	input.rowStyle = {color:'red'};
// 	input.errStyle ={color:'red'};

//  input.nameWidth = 100;  //获取或设置标题字段的宽度   get、set
//  input.rowHeight = 30;   //获取或设置行高  get、set
//  input.checkPass();      //input检查 返回 true/false 。 错误时会显示errDom提示
//  input.value = '';       //获取或设置对象的值   get、set
//  input.key;              //获取设置的key的值。
//  input.disabled = true;  //设置input是否可用 true/false

// input.phoneId = 'phone';     //关联的phone输入框id，为空不检查（b-input对象）
// input.countdown = 10;        //倒计时时间
// input.countdownText = '剩${x}秒';      //倒计时文字样式
// input.smsBtnStyle = {width:'150px'};     //按钮样式
// input.timeBtnStyle = {width:'150px'};     //倒计时样式
// input.sendFn = function(){               //成功发送后，在函数内调用ajax
// 	setTimeout(function(){
// 		input.sendOk();                     //ajax成功后调用该函数，触发倒计时开始
// 	},3000)
// };





let BInput = require('./input');

let createInput = Symbol.for('createInput'),
	sendFunction = Symbol(),
	smsBtn = Symbol(),
	timeBtn = Symbol(),
	smsBtnClickFn = Symbol();




class BInputSms extends BInput{
	#hasSend = false;

	constructor() {
		super();
	}

	[createInput](type){
		let textInput = $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		textInput.css(this.inputCss);
		textInput.css({paddingRight:'10px'});

		let div = $('<div class="hover box_hcc">获取验证码</div>'),
			div1 = $('<div class="hidden box_hcc">倒计时</div>'),
			_this = this;

		div.css({cursor:'pointer'});
		div.one('click',function(){
			_this[smsBtnClickFn](div);
		});

		this[smsBtn] = div;
		this[timeBtn] = div1;

		this.inputBodyDom.append(textInput).append(div).append(div1);

	}

	[smsBtnClickFn](btn){
		let _this = this;

		if(this.#hasSend){
			btn.one('click',function(){
				_this[smsBtnClickFn](btn);
			});
			return;
		}

		if(this.phoneDomId){
			let dom = $('#'+this.phoneDomId).get(0);
			if(dom.checkPass()){
				this[sendFunction](dom.value);
				return;
			}else{
				btn.one('click',function(){
					_this[smsBtnClickFn](btn);
				});
				return;
			}
		}
		this[sendFunction]('');
	}

	set sendFn(fn){
		fn = fn || function(){};
		this[sendFunction] = function(phoneNumber){
			fn(phoneNumber);
		};
	}
	set phoneId(id){
		this.phoneDomId = id;
	}

	set countdown(time){
		time = parseInt(time);
		time = (time)? time : 60;
		$(this).attr({countdown:time});
	}
	set countdownText(text){
		this.userSetCountdownText = text;
	}
	get countdownText(){
		return this.userSetCountdownText;
	}

	set smsBtnStyle(style){
		this[smsBtn].css(style);
	}
	set timeBtnStyle(style) {
		this[timeBtn].css(style);
	}

	sendOk(){
		this.#hasSend = true;
		let countdown = parseInt($(this).attr('countdown')) || 60,
			countdownText = this.countdownText || '${x}',
			getText = function(t){
				return countdownText.replace('${x}',t);
			},
			_this = this;

		this[smsBtn].addClass('hidden');
		this[timeBtn].text(getText(countdown)).removeClass('hidden');

		let aa = setInterval(function(){
			countdown--;
			if(countdown<0){
				_this.#hasSend = false;
				_this[smsBtn].removeClass('hidden');
				_this[timeBtn].addClass('hidden');
				_this[smsBtn].one('click',function(){
					_this[smsBtnClickFn](_this[smsBtn]);
				});
				clearInterval(aa);
			}else{
				_this[timeBtn].text(getText(countdown));
			}
		},1000)
	}
}



if(!customElements.get('b-input-sms')){
	customElements.define('b-input-sms', BInputSms );
}