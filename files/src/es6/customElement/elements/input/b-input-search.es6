
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




let publishInput = require('./_input-all');

class bInputSearch extends publishInput{
	constructor() {
		super();

		this.awaitTime = 100;  //ms
		this.awaitFn = null;
		this.userSearchFn = function(){};
		this.userInputFn = function(){};

		this.createInput();
		this.addEvent();

		this.value = this.setValue;
	}


	createInput(){
		let input = $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${this.placeholder}" data-rule="${this.rule}" />`);
		input.css({
			display:'block',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			paddingLeft:'4px'
		});
		input.css(this.setting.inputTextStyle);

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
				let data = await _this.userSearchFn(val);
				_this.showList(data);
				_this.userInputFn(val);
				_this.awaitFn = null;
			},_this.awaitTime)

		},false);

		input.addEventListener('blur',function(){
			_this.searchBodyDom.addClass('hidden');
		},false);

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
		this.searchBodyDom.addClass('hidden');
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



