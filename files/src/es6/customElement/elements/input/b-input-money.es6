
//同 b-input-text
//添加  @param：accuracy  小数位数


let publishInput = require('./_input-all'),
	numberFormat = require('../../../lib/fn/number');

class bInputMoney extends publishInput{
	connectedCallback() {
		super.connectedCallback();

		let _this = this;
		setTimeout(function(){
			_this.init();
		},0)
	}

	constructor() {
		super();


	}

	init(){
		this.createInput();
		this.addEvent();

		this.value = this.setValue;
	}


	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';

		let input =  $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${placeholder}" data-rule="${rule}"/>`);
		input.css({
			display:'block',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			paddingLeft:'4px'
		});
		input.css(this.setting.inputTextStyle);



		this.inputBodyDom.prepend(input);
		this.inputDom = input;

	}

	//自动添加 money 的正则
	checkIsMoney(val){
		let reg = /^[+-]?\d+(\.\d+)?$/;
		return reg.test(val);
	}

	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('input',function(){
			let val = _this._getRealValue();
			_this.changeFunction.call(_this,val);
		},false)

		input.addEventListener('focus',function(){
			_this.focusFunction.call(_this);
		});
		input.addEventListener('blur',function(){
			_this.blurFunction.call(_this);
			let val = _this._getMoneyValue();
			$(this).val(val);
		});
	}

	//获取格式化后的数据
	_getMoneyValue(val){
		let accuracy = parseInt($(this).attr('accuracy'));
		accuracy = (accuracy || accuracy == 0)? accuracy : 2;

		val = val || this._getRealValue();
		val = numberFormat(val,accuracy);
		return val;
	}
	//获取真实的数据  不带','号
	_getRealValue(){
		let val = this.inputDom.val().toString();
		val = val.replace(/\,/ig,'');

		if(this.checkIsMoney(val)){
			this.errDom.css({display:'none'});
			return val;
		}else{
			this.errDom.css({display:'block'});
			throw 'money test err';
		}
	}

	set value(val){
		val = this._getMoneyValue(val);
		this.inputDom.val(val);

		val = this._getRealValue();
		this.changeFunction.call(this,val);
	}
	get value(){
		return this._getRealValue();
	}

}


if(!customElements.get('b-input-money')){
	customElements.define('b-input-money', bInputMoney );
}



