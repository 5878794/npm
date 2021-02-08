

//==========================================================
//input控件
// b-input-yzm
//==========================================================

// 添加：
// @param:src               验证码图片地址
// @param:yzmHeight         验证码图片高度，宽度自适应

// 有src参数时不会触发该函数
// yzm.getYzmFn = async function(){};       //获取图片地址的异步函数，
//                                          //需要返回图片地址   return imgSrc;


let publishInput = require('./_input-all');

class bInputYZM extends publishInput{
	constructor() {
		super();

		this.getYzmFunction = async function(){};

		this.createInput();
		this.createYzmDom();
		this.refresh();
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

	//地址添加 时间戳参数
	_urlAddStamp(url){
		let t = new Date().getTime();
		if(url.indexOf('?')>-1){
			url = url+'&t='+t;
		}else{
			url = url+'?t='+t;
		}
		return url;
	}

	createYzmDom(){
		let yzmBody = this.unitDom,
			yzmHeight = $(this).attr('yzmHeight') || 30,
			yzm = $('<img src=""/>');
		yzm.css({
			display:'block',
			width:'auto',
			height:yzmHeight+'px',
			cursor:'pointer'
		});

		yzmBody.html('').css({display:'block'}).append(yzm);
		this.inputBodyDom.css({
			paddingRight:0
		})
		this.yzmDom = yzm;
	}

	refresh(){
		let yzmSrc = $(this).attr('src');
		if(yzmSrc){
			yzmSrc = this._urlAddStamp(yzmSrc);
			this.yzmDom.attr({src:yzmSrc});
		}else{
			this.getYzmFunction().then(rs=>{
				this.yzmDom.attr({src:rs});
			})
		}
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

		this.yzmDom.click(function(){
			_this.refresh();
		});
	}

	set value(val){
		this.inputDom.val(val);

		this.changeFunction.call(this,val);
	}
	get value(){
		return this.inputDom.val();
	}

	set getYzmFn(fn){
		fn = fn || function(){};
		this.getYzmFunction = fn;
		this.refresh();
	}

}


if(!customElements.get('b-input-yzm')){
	customElements.define('b-input-yzm', bInputYZM );
}


