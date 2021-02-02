
//同 b-input-text


//添加  set  select.list = [{id:'',val:''}];
//     get  select.list;
//     set  select.listFn = async function(){
//              return [{id:'',val:''}]
//          }



let publishInput = require('./_input-all');



class bInputSelect extends publishInput{
	constructor() {
		super();

		this.createInput();
		this.addEvent();
	}

	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';
		this.placeholder = placeholder;

		let input = $(`<select class="boxflex1 __input__" data-rule="${rule}"></select>`);
		if(placeholder){
			input.append($('<option value="">'+placeholder+'</option>'));
		}

		input.css({
			height:this.userStyle.rowHeight+'px',
			fontSize:'12px'
		});

		let loading = $('<div class="boxflex1"></div>');
		loading.css({
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			fontSize:'12px',
			paddingLeft:'4px',
			display:'none'
		})

		this.inputBodyDom.prepend(input).prepend(loading);
		this.inputDom = input;
		this.loadingDom = loading;
	}


	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('change',function(){
			let val = $(this).val(),
				text = $(this).find('option:selected').text();
			_this.changeFunction.call(_this, {id:val,val:text});
		},false)

		input.addEventListener('focus',function(){
			_this.focusFunction.call(_this);
		});
		input.addEventListener('blur',function(){
			_this.blurFunction.call(_this);
		});
	}


	set listFn(fn){
		let _this = this;

		this.inputDom.css({display:'none'});
		this.loadingDom.text('加载中，请稍后！').css({display:'block'});

		fn().then(rs=>{
			this.inputDom.css({display:'block'});
			this.loadingDom.css({display:'none'});
			this.createList(rs);
		}).catch(e=>{
			this.loadingDom.text('获取数据失败，点击重试！');
			this.loadingDom.one('click',function(){
				_this.listFn = fn;
			});
		});
	}
	set list(data){
		this.createList(data);
	}
	get list(){
		return this.listData;
	}
	createList(data=[],noPlaceholder){
		this.listData = data;
		this.inputDom.find('option').remove();
		if(this.placeholder && !noPlaceholder){
			this.inputDom.append($('<option value="">'+this.placeholder+'</option>'));
		}
		data.map(rs=>{
			let option = $(`<option value="${rs.id}">${rs.val}</option>`);
			option.data({data:rs});
			this.inputDom.append(option);
		})

		this.value = this.setValue;
	}


	set value(val){
		this.setValue = val;
		this.inputDom.val(val);
	}
	get value(){
		return this.inputDom.val();
	}
}


if(!customElements.get('b-input-select')){
	customElements.define('b-input-select', bInputSelect );
}
