



let addStyleFile = require('../../fn/addStyleFile'),
	addStyleStyle = require('../../fn/addStyleText'),
	setting = require('./_input-setting');

require('../../../lib/jq/check_from');

class inputAll extends HTMLElement{
	connectedCallback(){
		let _this = this;
		setTimeout(function(){
			$(_this).css({display:'block'});

			//获取并设置默认参数
			_this.setDefaultParam();

			//创建dom
			_this.createDefaultDom();

			//根据参数处理元素
			_this.paramCheck();

			//公共事件注册
			_this.setDefaultFunction();

			_this.shadow.appendChild(_this.body.get(0));

			if($(_this).css('visibility') == 'hidden'){
				$(_this).css({visibility:'visible'})
			}
		},0)
	}

	constructor() {
		super();

		this.setting = setting;

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

		//增加默认样式
		let styleText = this.getDefaultStyle();
		this.shadow.appendChild(styleText);




	}

	getDefaultStyle(){
		let style = setting.input_disabled_style;
		style = style.join('');
		return addStyleStyle(style);
	}

	setDefaultParam(){
		//设置key
		this.serverKey = $(this).attr('key') || '';
		//
		this.placeholder = $(this).attr('placeholder') || '';
		//验证规则
		this.rule = $(this).attr('rule') || '';
		//出错提示文字
		this.err = $(this).attr('err') || '';
		//要显示的标题  为空不显示
		this.name = $(this).attr('name') || '';
		//input的icon
		this.inputIcon = $(this).attr('icon') || '';
		//icon的宽度
		this.inputIconWidth = parseInt($(this).attr('iconWidth')) || 20;
		this.inputIconHeight = parseInt($(this).attr('iconHeight')) || 20;

		//输入框单位显示
		this.unit = $(this).attr('unit') || '';
		//初始值
		this.setValue = $(this).attr('value') || '';

		//input附加style
		this.userStyle = {
			nameWidth:setting.nameDomWidth,      //标题字段宽度
			rowHeight:setting.rowHeight        //行高
		};

	}

	createDefaultDom(){


		let dom = $('<div class="box_slt"></div>'),
			inputBody = $('<div class="box_hlt"></div>'),
			name = $('<div>'+this.name+'</div>'),
			unit = $('<div>'+this.unit+'</div>'),
			error = $('<div class="__input_error__">'+this.err+'</div>'),
			inputDom = $('<div class="boxflex1 box_hlc"></div>');

		dom.append(inputBody).append(error);
		inputDom.append(unit);
		inputBody.append(name).append(inputDom);


		name.css({
			width:this.userStyle.nameWidth+'px',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px'
		});
		name.css(setting.nameDomStyle);

		inputBody.css({
			width:'100%',
			padding:'0 10px'
		});
		inputBody.css(setting.rowDomStyle);

		error.css({
			paddingLeft:this.userStyle.nameWidth+10+'px',
			display:'none'
		});
		error.css(setting.errorDomStyle);

		inputDom.css(setting.inputBodyDomStyle);

		unit.css(setting.unitDomStyle);

		this.unitDom = unit;
		this.body = dom;
		this.rowDom = inputBody;
		this.nameDom = name;
		this.inputBodyDom = inputDom;
		this.errDom = error;
	}

	paramCheck(){
		//判断是否有标题
		if(!this.name){
			this.nameDom.css({display:'none'});
		}

		//判断是否有图标
		if(this.inputIcon){
			let paddingLeft = this.inputIconWidth+20;
			this.inputBodyDom.css({
				paddingLeft:paddingLeft+'px',
				background:'url('+this.inputIcon+') no-repeat 10px center',
				backgroundSize:this.inputIconWidth+'px '+this.inputIconHeight+'px'
			})
		}

		if(!this.unit){
			this.unitDom.css({display:'none'});
		}
	}

	//需要实现的公共方法
	setDefaultFunction(){
		this.changeFunction = function(){};
		this.focusFunction = setting.focusFunction;
		this.blurFunction = setting.blurFunction;
	}

	//表单检查 返回promise对象
	checkPass(){
		return new Promise((success,error)=>{
			this.errDom.css({display:'none'});

			if(this.body.checkFrom().errorDom.length == 0){
				success(this.value);
			}else{
				this.errDom.css({display:'block'});
				error({
					msg:$(this).attr('err'),
					dom:this
				});
			}
		})

	}

	set changeFn(fn){
		fn = fn || function(){};
		this.changeFunction = fn;
	}
	set focusFn(fn){
		fn = fn || function(){};
		this.focusFunction = fn;
	}
	set blurFn(fn){
		fn = fn || function(){};
		this.blurFunction = fn;
	}

	set disabled(state){
		let placeholder = $(this).attr('placeholder') || $(this).attr('placeholderTemp');
		$(this).attr({placeholderTemp:placeholder});

		if(state){
			this.body.find('.__input__').attr({
				disabled:'disabled'
			}).removeAttr('placeholder');
			this.inputBodyDom.addClass('input_disabled');
		}else{
			this.body.find('.__input__').removeAttr('disabled').attr({
				placeholder:placeholder
			});
			this.inputBodyDom.removeClass('input_disabled');
		}

	}

	set unitText(val){
		let display = (val)? 'block' : 'none';
		this.unitDom.text(val).css({display:display});
	}

	set nameText(val){
		let display = (val)? 'block' : 'none';
		this.nameDom.text(val).css({display:display});
	}

	set styleText(text){
		let style = document.createElement('style');
		style.rel = "stylesheet";
		style.innerHTML = text;

		this.shadow.appendChild(style);
	}

	set rowHeight(height){
		height = (height)? parseInt(height) : 0;
		this.userStyle.rowHeight = height;
		this.nameDom.css({
			height:height+'px',
			lineHeight:height+'px'
		});
		this.body.find('.__input__').css({
			height:height+'px',
			lineHeight:height+'px'
		});
		this.body.find('.__textarea__').css({
			height:height*3+'px',
			minHeight:height*3+'px',
			lineHeight:'120%'
		});
	}

	get key(){
		return this.serverKey;
	}


	set placeholderColor(color){
		let style = [
			'::-webkit-input-placeholder { color:'+color+'; }',
			':-moz-placeholder { color:'+color+'; }',
			'input::-webkit-input-placeholder { color:'+color+'; }',
			'input:-moz-placeholder { color:'+color+'; }',
			'.add_placeholder{color:'+color+' !important;}'
		];

		this.styleText = style.join('');
	}

}
module.exports = inputAll;


