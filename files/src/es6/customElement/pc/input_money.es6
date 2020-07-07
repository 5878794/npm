

//==========================================================
//input控件  继承 input
// b-input-money
//==========================================================

// html
// b-input(name='名字:'           //输入框前面的标题。 如空不显示标题。
// key='aa'                  //服务器对应的key
// placeholder='测试。。。'    //提示文字
// rule='must'                //只支持must
// err='错。。。'              //验证错误显示提示信息
// icon='./image/aa.jpg'      //输入框前面图标地址，及大小  如空不显示icon
// iconWidth=20
// iconHeight=20
// accuracy=5               //小数位数
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






let BInput = require('./input'),
	numberFormat = require('../../lib/fn/number');

let createInput = Symbol.for('createInput'),
	addEvent = Symbol();


class BInputNumber extends BInput{
	constructor(props) {
		super(props);

		this[addEvent]();
	}

	[createInput](type){
		let textInput = $(`<input autocomplete="off" class="boxflex1 __input__" type="${type}" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		textInput.css(this.inputCss);

		let hideInput = $('<input class="__hidden_input__" type="hidden"/>');

		this.inputBodyDom.append(textInput).append(hideInput);
	}

	[addEvent](){
		let input = this.inputBodyDom.find('.__input__').get(0),
			hidden = this.inputBodyDom.find('.__hidden_input__').get(0),
			accuracy = parseInt($(this).attr('accuracy')) || 2;

		input.addEventListener('blur',function(e){
			let val = this.value.replace(/\,/ig,'');
			val = numberFormat(val,accuracy);
			val = (val=='NaN')? '' : val;
			this.value = val;
			hidden.value = val.replace(/\,/ig,'');
		},false)

	}

	get value(){
		return this.body.find('.__hidden_input__').val();
	}

	set value(val){
		let accuracy = parseInt($(this).attr('accuracy')) || 2;
		val = val.toString();
		val = val.replace(/\,/ig,'');
		val = numberFormat(val,accuracy);
		this.body.find('.__input__').val(val);
		val = val.replace(/\,/ig,'');
		this.body.find('.__hidden_input__').val(val);

	}


}


if(!customElements.get('b-input-money')){
	customElements.define('b-input-money', BInputNumber );
}