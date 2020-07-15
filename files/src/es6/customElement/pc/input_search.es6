

//==========================================================
//input控件  继承 input
// b-input-search
//==========================================================

// html
// b-input-search(name='名字:'           //输入框前面的标题。 如空不显示标题。
// key='aa'                  //服务器对应的key
// placeholder='测试。。。'    //提示文字
// rule='must'                //只支持must
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
//  input.disabled = true;  //设置input是否可用 true/false
//  input.searchFn = function   //search函数返回，显示提示列表
								//异步函数/promise对象
								//需要 return ['str','str'...];
								//数据长度没处理 传入多少是多少

// input.inputFn = function   //输入时的函数 一般不用，主要是输入和点提示列表会触发
								//同步函数
								//带入当前input的value






let BInput = require('./input');

let createInput = Symbol.for('createInput'),
	addEvent = Symbol(),
	showList = Symbol(),
	itemClick = Symbol();


class BInputSearch extends BInput{
	constructor(props) {
		super(props);

		this.awaitTime = 100;  //ms
		this.awaitFn = null;
		this.userSearchFn = function(){};
		this.userInputFn = function(){};

		this[addEvent]();
	}

	[createInput](type){
		let textInput = $(`<input autocomplete="off" class="boxflex1 __input__" type="${type}" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		textInput.css(this.inputCss);

		let searchDom = $('<div class="hidden"></div>');
		searchDom.css({
			position:'absolute',
			top:this.rowHeight+'px',
			left:0,
			width:'100%',
			zIndex:100,
			// padding:'0 10px',
			// boxSizing:'border-box',
			borderRadius:'5px',
			// borderTop:'1px solid rgb(80, 111, 226)',
			boxShadow:'0 0 3px 3px #ccc',
			background:'#fff'
		});
		let searchListDom = $('<div class="box_hlc diandian"></div>');
		searchListDom.css({
			width:'100%',
			height:'45px',
			lineHeight:'45px',
			borderBottom:'1px solid #ccc',
			textIndent:'1em',
			cursor: 'pointer',
			background:'#fff'
		});

		this.inputBodyDom.css({
			position:'relative'
		});

		this.searchBodyDom = searchDom;
		this.searchListDom = searchListDom;

		this.inputBodyDom.append(textInput).append(searchDom);
	}

	[addEvent](){
		let input = this.inputBodyDom.find('.__input__').get(0),
			_this = this;


		input.addEventListener('input',function(e){
			let val = this.value;
			if(_this.awaitFn){
				clearTimeout(_this.awaitFn);
				_this.awaitFn = null;
			}
			if(val == ''){
				_this[showList]([]);
				return;
			}


			_this.awaitFn = setTimeout(async function(){
				let data = await _this.userSearchFn(val);
				_this[showList](data);
				_this.userInputFn(val);
				_this.awaitFn = null;
			},_this.awaitTime)

		},false);

		input.addEventListener('blur',function(){
			_this.searchBodyDom.addClass('hidden');
		},false);

	}

	//显示结构
	[showList](data){
		data = data || [];
		let body = this.searchBodyDom,
			item = this.searchListDom,
			_this = this;

		body.find('div').unbind('mousedown').unbind('hover');
		body.html('');

		if(data.length == 0){
			body.addClass('hidden');
		}else{
			body.removeClass('hidden');
		}

		data.map(rs=>{
			let _item = item.clone().text(rs);
			body.append(_item);
		});

		body.find('div').mousedown(function(e){
			e.stopPropagation();
			_this[itemClick]($(this));
		});
		body.find('div').hover(function(){
			$(this).css({background:'#fbd6d8'});
		},function(){
			$(this).css({background:'#fff'});
		})
	}

	[itemClick](dom){
		let val = dom.text();
		this.inputBodyDom.find('.__input__').val(val);
		this.searchBodyDom.addClass('hidden');
		this.userInputFn(val);
	}


	set searchFn(fn){
		this.userSearchFn = fn || function(){};
	}

	set inputFn(fn){
		this.userInputFn = fn || function(){};
	}




}


if(!customElements.get('b-input-search')){
	customElements.define('b-input-search', BInputSearch );
}