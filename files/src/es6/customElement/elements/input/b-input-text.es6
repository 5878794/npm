

//==========================================================
//input控件
// b-input-text
//==========================================================

// html
// b-input-text(name='名字:'           //输入框前面的标题。 如空不显示标题。
// key='aa'                  //服务器对应的key
// placeholder='测试。。。'    //提示文字
// rule='must,min:6'         //验证规则
// err='错。。。'              //验证错误显示提示信息
// icon='./image/aa.jpg'      //输入框前面图标地址，及大小  如空不显示icon
// unit='m'					// 输入框后面显示单位
// iconWidth=20
// iconHeight=20
// disabled=disabled          //是否可编辑
// value=123                    //初始值
// )


// js
// 	var input = $('b-input').eq(0).get(0);
// 	input.inputStyle = {color:'red'};   //设置样式
// 	input.nameStyle = {color:'red'};
// 	input.inputBodyStyle = {color:'red'};
// 	input.rowStyle = {color:'red'};
// 	input.errStyle ={color:'red'};
//	input.unitStyle={color:'red'};

//  input.value = '';       //获取或设置对象的值   get、set
//  input.key;              //获取设置的key的值。
//  input.disabled = true;  //设置input是否可用 true/false
//  input.nameText = '';    //设置标题
//  input.unitText = '';    //设置单位
//  input.styleText = '.a{color:red;}';  //添加style文本进入内部
//  input.rowHeight = 30;   //设置高度


//  input.checkPass();      //input检查 返回 promise对象 。 错误时会显示errDom提示
//通过返回该控件的value
//失败返回  {msg:'err',dom:this}

//事件  function中this指向对象本身
// input.changeFn = function(val){};       值变化时， 返回当前的value
// input.focusFn = function(){};
// input.blurFn = function(){};


let publishInput = require('./_input-all');

class bInputText extends publishInput{
	constructor() {
		super();

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
			width:'100%',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			background:'none',
			border:'none',
			fontSize:'12px'
		});

		this.inputBodyDom.prepend(input);
		this.inputDom = input;
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
		input.addEventListener('blue',function(){
			_this.blurFunction.call(_this);
		});
	}

	set value(val){
		this.inputDom.val(val);
	}
	get value(){
		return this.inputDom.val();
	}

}


if(!customElements.get('b-input-text')){
	customElements.define('b-input-text', bInputText );
}



module.exports = bInputText;