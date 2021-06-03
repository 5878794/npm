
//同 b-input-text

//传入的参数都可以用时间戳（value、min、max）
//元素上增加属性（属性上使用时间戳会自动转换为日期格式）
//@stamp   有该属性，获取value属性时输出时间戳
//@min     能选择的最小日期,可以时间戳，
//@max     能选择的最大日期
//@system  使用系统控件(现在只有chrome支持)



let publishInput = require('./_input-all'),
	t2s = require('../../../lib/fn/timeAndStamp'),
	dateClass = require('../../../lib/input/date'),
	device = require('../../../lib/device');




class bInputDate extends publishInput{
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
		this.useSysyem = this.hasAttribute('system');
		this.isShow = false;

		if(this.useSysyem){
			this.createInput(true);
		}else{
			this.createInput(false);
			this.crateInputZZ();
			this.bindJs();
		}

		this.addEvent();
	}


	createInput(useSystem){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';
		this.placeholder = placeholder;

		let inputType = (useSystem)? 'date' : 'text';
		let input = $(`<input autocomplete="off" class="boxflex1 __input__" type="${inputType}" placeholder="${placeholder}" data-rule="${rule}"/>`);

		input.css({
			height:this.userStyle.rowHeight+'px'
		});
		input.css(this.setting.inputDateStyle);

		this.inputBodyDom.prepend(input);
		this.inputDom = input;

		let value = $(this).attr('value');
		value = t2s.getDate1(value);
		input.val(value);


		let min = $(this).attr('min') || '',
			max = $(this).attr('max') || '';

		if(min){
			this.min = min;
		}
		if(max){
			this.max = max;
		}
	}

	crateInputZZ(){
		this.inputBodyDom.css({
			position:'relative'
		});

		let div = $('<div></div>');
		div.css({
			position: 'absolute', left:0,top:0,right:0,bottom:0
		});

		this.inputBodyDom.append(div);

		this.inputZZ = div;
	}

	bindJs(){
		let _this = this;

		this.inputZZ.click(function(){
			_this.showDiv();
			_this.inputDom.focus();
		})
	}

	showDiv(){
		if(this.isShow){
			return;
		}
		this.isShow = true;

		let _this = this,
			input = this.inputDom,
			dom = $(input);

		this.tempNewFn = new dateClass({
			positionDom:_this.inputBodyDom,   //
			titleText:"请选择日期",       //@param:str    标题
			selected:t2s.getDate1($(input).val()),      //@param:str    初始显示的日期， 默认：当前日期
			minDate:t2s.getDate1($(input).attr('min')),         //@param:str    最小显示时间 默认：1950-1-1
			maxDate:t2s.getDate1($(input).attr('max')),       //@param:str    最大显示时间 默认：2050-12-12
			isShowDay:true,               //@param:bool   是否显示日,默认：true
			viewPort:(device.isPhone)? '750' : '1280',                //@param:number 设置psd的大小，布局需要使用rem 默认：750
			success:function(rs){
				//rs返回选择的年月日   yyyy-mm-dd
				rs = t2s.getDate1(rs);
				dom.val(rs);
				_this.changeFunction.call(_this, rs);
				_this.blurFunction.call(_this);
				_this.isShow = false;
				_this.inputDom.blur();
			},
			error:function(){
				//取消选择
				dom.val('');
				_this.blurFunction.call(_this);
				_this.isShow = false;
				_this.inputDom.blur();
			},
			close:function(){
				_this.blurFunction.call(_this);
				_this.isShow = false;
				_this.inputDom.blur();
			}
		});

		_this.focusFunction.call(_this);
	}


	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('focus',function(){
			if(!_this.useSysyem){
				_this.showDiv();
			}else{
				_this.focusFunction.call(_this);
			}
		});
		input.addEventListener('blur',function(){
			if(!_this.useSysyem && _this.tempNewFn){
				_this.tempNewFn.destroy();
				_this.isShow = false;
			}
			_this.blurFunction.call(_this);
		});
	}




	set value(val){
		val = t2s.getDate1(val);
		this.body.find('input').val(val);
	}
	get value(){
		//判断输出格式
		let isStamp = (this.hasAttribute('stamp')),
			val = this.body.find('input').val();

		if(isStamp){
			return (val)? new Date(val).getTime() : '';
		}else{
			return val;
		}
	}

	set min(val){
		let min = t2s.getSetDate(val);
		this.inputDom.attr({min:min});
	}
	set max(val){
		let max = t2s.getSetDate(val);
		this.inputDom.attr({max:max});
	}
}


if(!customElements.get('b-input-date')){
	customElements.define('b-input-date', bInputDate );
}
