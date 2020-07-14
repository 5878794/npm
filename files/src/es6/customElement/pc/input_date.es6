

//==========================================================
//input控件  继承 input    只有chrome浏览器支持
// b-input-date
//==========================================================

// html
// b-input-date(name='名字:'           //输入框前面的标题。 如空不显示标题。
// key='aa'                  //服务器对应的key
// placeholder='测试。。。'    //提示文字
// rule='must'                //只支持must
// type='date'               //输入框类型
// min='2020-1-1'            //输入框最小时间选择
// max='2020-2-2'             //输入框最大时间选择
// err='错。。。'              //验证错误显示提示信息
// icon='./image/aa.jpg'      //输入框前面图标地址，及大小  如空不显示icon
// iconWidth=20
// iconHeight=20
// )


// js
// 	var input = $('b-input').eq(0).get(0);
// 	input.inputStyle = {color:'red'};   //设置样式
// 	input.nameStyle = {color:'red'};
// 	input.inputBodyStyle = {color:'red'};
// 	input.rowStyle = {color:'red'};
// 	input.errStyle ={color:'red'};

//  input.nameWidth = 100;  //获取或设置标题字段的宽度   get、set
//  input.rowHeight = 30;   //获取或设置行高  get、set
//  input.checkPass();      //input检查 返回 true/false 。 错误时会显示errDom提示
//  input.selectData = [];  //type=select时，设置下拉菜单选项
//  input.value = '';       //获取或设置对象的值   get、set
//  input.key;              //获取设置的key的值。
//  input.min = '2020-11-11'    //获取设置最大、最小选择时间范围
//  input.max = '20202-11-11'
//  input.disabled = true;  //设置input是否可用 true/false

//  input.changeFn = function(){};






let BInput = require('./input'),
	t2s = require('../../lib/fn/timeAndStamp');

let createInput = Symbol.for('createInput'),
	bindChangFn = Symbol();


class BInputDate extends BInput{
	constructor(props) {
		super(props);

		this.userChangeFn = function(){};

		this[bindChangFn]();
	}

	[createInput](type){
		let textInput = $(`<input autocomplete="off" class="boxflex1 __input__" type="${type}" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		textInput.css(this.inputCss);


		let min = $(this).attr('min'),
			max = $(this).attr('max');
		if(min){
			min = t2s.getDate1(min);
			textInput.attr({min:min});
		}
		if(max){
			max = t2s.getDate1(max);
			textInput.attr({max:max});
		}

		this.inputBodyDom.append(textInput);

	}


	[bindChangFn](){
		let input = this.body.find('.__input__').get(0),
			_this = this;
		input.addEventListener('change',function(){
			_this.userChangeFn(_this.value);
		},false)
	}


	get min(){
		return this.inputBodyDom.find('input').attr('min') || '';
	}
	set min(val){
		val = t2s.getDate1(val);
		this.inputBodyDom.find('input').attr({
			min:val
		});
	}

	get max(){
		return this.inputBodyDom.find('input').attr('max') || '';
	}
	set max(val){
		val = t2s.getDate1(val);
		this.inputBodyDom.find('input').attr({
			max:val
		});
	}

	set changeFn(fn){
		fn = fn || function(){};
		this.userChangeFn = fn;
	}

	set value(val){
		val = val || '';
		if(!val){return;}
		val = t2s.getDate1(val);
		this.body.find('.__input__').val(val);
	}

	get value(){
		return this.body.find('.__input__').val();
	}

}


if(!customElements.get('b-input-date')){
	customElements.define('b-input-date', BInputDate );
}