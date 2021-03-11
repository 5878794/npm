
//同 b-input-text

//增加

//搜索时触发的函数 （只有输入触发）
//@  dom.searchFn = async function(val){       //异步函数
		//search函数返回，显示提示列表
		//异步函数/promise对象
		//需要 return ['str','str'...];
		//数据长度没处理 传入多少是多少
//   }

//输入框输入时触发（输入、点击列表都会触发）
//@  dom.inputFn = function(val){              //同步函数
//
//   }


//删除
//@ unit属性  unit已改为loading




let publishInput = require('./_input-all'),
	addStyleStyle = require('../../fn/addStyleText');

class bInputSearch extends publishInput{
	constructor() {
		super();

		this.unitDom.text('');

		this.createLoadingCss();
		this.showLoadingNumber = 0;

		this.awaitTime = 100;  //ms
		this.awaitFn = null;
		this.userSearchFn = function(){};
		this.userInputFn = function(){};

		this.createInput();
		this.addEvent();

		this.value = this.setValue;
	}

	createLoadingCss(){
		let style = '.load5{\n' +
			'  font-size: 12px;\n' +
			'  width: 1em;\n' +
			'  height: 1em;\n' +
			'  border-radius: 50%;\n' +
			'  position: relative;\n' +
			'  text-indent: -9999em;\n' +
			'  -webkit-animation: load5 1.1s infinite ease;\n' +
			'  animation: load5 1.1s infinite ease;\n' +
			'  -webkit-transform: translateZ(0);\n' +
			'  -ms-transform: translateZ(0);\n' +
			'  transform: translateZ(0);\n' +
			'}\n' +
			'@-webkit-keyframes load5 {\n' +
			'  0%,\n' +
			'  100% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em #000, 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.5), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.7);\n' +
			'  }\n' +
			'  12.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.5);\n' +
			'  }\n' +
			'  25% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.5), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  37.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.5), 2.5em 0em 0 0em rgba(0, 0, 0, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  50% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.5), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  62.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.5), 0em 2.5em 0 0em rgba(0, 0, 0, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  75% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.5), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  87.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.5), -2.6em 0em 0 0em rgba(0, 0, 0, 0.7), -1.8em -1.8em 0 0em #000;\n' +
			'  }\n' +
			'}\n' +
			'@keyframes load5 {\n' +
			'  0%,\n' +
			'  100% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.5), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.7);\n' +
			'  }\n' +
			'  12.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.5);\n' +
			'  }\n' +
			'  25% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.5), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  37.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.5), 2.5em 0em 0 0em rgba(0, 0, 0, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  50% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.5), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.2), -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  62.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.5), 0em 2.5em 0 0em rgba(0, 0, 0, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(0, 0, 0, 0.2), -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  75% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.5), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2);\n' +
			'  }\n' +
			'  87.5% {\n' +
			'    box-shadow: 0em -2.6em 0em 0em rgba(0, 0, 0, 0.2), 1.8em -1.8em 0 0em rgba(0, 0, 0, 0.2), 2.5em 0em 0 0em rgba(0, 0, 0, 0.2), 1.75em 1.75em 0 0em rgba(0, 0, 0, 0.2), 0em 2.5em 0 0em rgba(0, 0, 0, 0.2), -1.8em 1.8em 0 0em rgba(0, 0, 0, 0.5), -2.6em 0em 0 0em rgba(0, 0, 0, 0.7), -1.8em -1.8em 0 0em #ffffff;\n' +
			'  }\n' +
			'}';

		let styleDom = addStyleStyle(style);
		$(this.shadowRoot).prepend(styleDom);
	}

	createInput(){
		let input = $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		input.css({
			display:'block',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			paddingLeft:'4px',
			paddingRight:'10px'
		});
		input.css(this.setting.inputSearchStyle);

		let searchDom = $('<div class="hidden"></div>');
		searchDom.css({
			position:'absolute',
			top:this.userStyle.rowHeight+'px',
			left:0,
			width:'100%',
			zIndex:100,
			borderRadius:'5px',
			boxShadow:'0 0 3px 3px #ccc',
			background:'#fff'
		});
		searchDom.css(this.setting.inputSearch.bodyStyle);

		let searchListDom = $('<div class="diandian"></div>');
		searchListDom.css({
			width:'100%',
			height:'45px',
			lineHeight:'45px',
			borderBottom:'1px solid #ccc',
			padding:'0 10px',
			cursor: 'pointer',
			background:'#fff'
		});
		searchListDom.css(this.setting.inputSearch.listStyle);

		this.inputBodyDom.css({
			position:'relative'
		});

		this.searchBodyDom = searchDom;
		this.searchListDom = searchListDom;

		this.inputBodyDom.prepend(input).append(searchDom);
		this.inputDom = input;

	}

	addEvent(){
		let input = this.inputBodyDom.find('.__input__').get(0),
			_this = this;


		input.addEventListener('input',function(e){
			let val = this.value;
			if(_this.awaitFn){
				clearTimeout(_this.awaitFn);
				_this.awaitFn = null;
			}
			if(val == ''){
				_this.showList([]);
				return;
			}


			_this.awaitFn = setTimeout(async function(){
				_this.showLoading();
				let data = await _this.userSearchFn(val);
				_this.hideLoading();
				_this.showList(data);
				_this.userInputFn(val);
				_this.awaitFn = null;
			},_this.awaitTime)

		},false);

		input.addEventListener('blur',function(){
			_this.searchBodyDom.addClass('hidden');
			_this.blurFunction.call(_this);
		},false);

		input.addEventListener('focus',function(){
			_this.focusFunction.call(_this);
		});


	}

	showLoading() {
		this.showLoadingNumber ++;
		this.unitDom.css({
			display:'block',
			width:'20px',
			height:'20px',
			padding:'0',
			transform:'scale(0.2)'
		}).addClass('load5');
		this.searchBodyDom.css({display:'none'});
	}

	hideLoading(){
		this.showLoadingNumber--;
		if(this.showLoadingNumber <= 0){
			this.unitDom.css({
				display:'none'
			})
			this.searchBodyDom.css({display:'block'});
		}
	}

	//显示结构
	showList(data){
		data = data || [];
		let body = this.searchBodyDom,
			item = this.searchListDom,
			_this = this;

		body.find('div').unbind('mousedown').unbind('hover');
		body.html('');

		if(data.length == 0){
			body.css({display:'none'});
		}else{
			// body.removeClass('hidden');
		}

		data.map(rs=>{
			let _item = item.clone().text(rs);
			body.append(_item);
		});

		body.find('div').mousedown(function(e){
			e.stopPropagation();
			_this.itemClick($(this));
		});
		body.find('div').hover(function(){
			$(this).css(_this.setting.inputSearch.listHoverStyle);
		},function(){
			$(this).css(_this.setting.inputSearch.listNotHoverStyle);
		})
	}

	itemClick(dom){
		let val = dom.text();
		this.inputBodyDom.find('.__input__').val(val);
		this.searchBodyDom.css({display:'none'});
		this.userInputFn(val);
	}


	set searchFn(fn){
		this.userSearchFn = fn || function(){};
	}

	set inputFn(fn){
		this.userInputFn = fn || function(){};
	}

	set value(val){
		this.inputDom.val(val);

		this.changeFunction.call(this,val);
	}
	get value(){
		return this.inputDom.val();
	}
}


if(!customElements.get('b-input-search')){
	customElements.define('b-input-search', bInputSearch );
}



