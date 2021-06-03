
//同 b-input-text

//增加
// input.phoneId = 'phone';     //关联的phone输入框id，为空不检查（b-input对象）
								//检查通过 dom.checkPass()检查，未通过使用输入验证的提示错误

// input.countdown = 10;        //倒计时时间
// input.countdownText = '剩${x}秒';      //倒计时文字样式
// input.smsBtnStyle = {width:'150px'};     //按钮样式
// input.timeBtnStyle = {width:'150px'};     //倒计时样式
// input.sendFn = async function(phoneNumber){      //通过验证，在函数内调用ajax
	// let back = true;
	// loading.show('loading...');
	// await ajax.send([
	//      api.getSms({phone:phoneNumber})
	//  ]).catch(e=>{
	// 	    back = false;
	// 	    alert(e);
	// });
	// loading.hide();
	//
	// return back;         //返回true开始倒计时，返回false不执行
// };



let publishInput = require('./_input-all');

class bInputSms extends publishInput{
	connectedCallback() {
		super.connectedCallback();

		let _this = this;
		setTimeout(function(){
			_this.createInput();
			_this.addEvent();

			_this.value = _this.setValue;
		},0);
	}

	constructor() {
		super();

		this.smsBtn = null;
		this.timeBtn = null;
		this.hasSend = false;
		this.sendFunction = function(){};


	}

	createInput(){
		let textInput = $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		textInput.css({
			display:'block',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			paddingLeft:'4px',
			paddingRight:'10px'
		});
		textInput.css(this.setting.inputSmsStyle);

		let div = $('<div class="hover box_hcc">获取验证码</div>'),
			div1 = $('<div class="hidden box_hcc">倒计时</div>'),
			_this = this;

		div.css({cursor:'pointer'});
		div.one('click',function(){
			_this.smsBtnClickFn(div);
		});

		this.smsBtn = div;
		this.timeBtn = div1;

		this.inputDom = textInput;
		this.inputBodyDom.append(textInput).append(div).append(div1);
		this.unitDom.remove();
	}

	smsBtnClickFn(btn){
		let _this = this;

		if(this.hasSend){
			btn.one('click',function(){
				_this.smsBtnClickFn(btn);
			});
			return;
		}

		if(this.phoneDomId){
			let dom = $('#'+this.phoneDomId).get(0);
			dom.checkPass().then(rs=>{
				this.sendSmsFunction(dom.value);
			}).catch(e=>{
				btn.one('click',function(){
					_this.smsBtnClickFn(btn);
				});
			});
		}else{
			this.sendSmsFunction('');
		}
	}

	async sendSmsFunction(val){
		let _this = this;
		if(await this.sendFunction(val)){
			this.sendOk();
		}else{
			this.smsBtn.one('click',function(){
				_this.smsBtnClickFn(_this.smsBtn);
			});
		}
	}

	set sendFn(fn){
		fn = fn || function(){};
		this.sendFunction = fn;
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
		this.smsBtn.css(style);
	}
	set timeBtnStyle(style) {
		this.timeBtn.css(style);
	}

	sendOk(){
		this.hasSend = true;
		let countdown = parseInt($(this).attr('countdown')) || 60,
			countdownText = this.countdownText || '${x}',
			getText = function(t){
				return countdownText.replace('${x}',t);
			},
			_this = this;

		this.smsBtn.addClass('hidden');
		this.timeBtn.text(getText(countdown)).removeClass('hidden');

		let aa = setInterval(function(){
			countdown--;
			if(countdown<0){
				_this.hasSend = false;
				_this.smsBtn.removeClass('hidden');
				_this.timeBtn.addClass('hidden');
				_this.smsBtn.one('click',function(){
					_this.smsBtnClickFn(_this.smsBtn);
				});
				clearInterval(aa);
			}else{
				_this.timeBtn.text(getText(countdown));
			}
		},1000)
	}

	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('input',function(){
			let val = $.trim($(this).val());
			_this.changeFunction.call(_this,val);
		},false)

		input.addEventListener('focus',function(){
			_this.focusFunction.call(_this);
		});
		input.addEventListener('blur',function(){
			_this.blurFunction.call(_this);
		});
	}

	set value(val){
		this.inputDom.val(val);

		this.changeFunction.call(this,val);
	}
	get value(){
		return this.inputDom.val();
	}
}


if(!customElements.get('b-input-sms')){
	customElements.define('b-input-sms', bInputSms );
}



