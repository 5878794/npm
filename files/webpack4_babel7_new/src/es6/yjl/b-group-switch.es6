
//设置中组 开关

//html:
// 	b-group-switch(name='审核' id='group4')

//js:
// 	let group1 = $('#group1').get(0);
// 	group1.data = [
// 		{name:'大发大发',value:'3',selected:true,id:1,key:'a1'},
// 		{name:'大发大发',value:'1',selected:true,id:1,key:'a2'},
// 		{name:'大发大发',value:'3',selected:true,id:1,key:'a3'},
// 		{name:'大发大发',value:'4',selected:true,id:1,key:'a4'},
// 		{name:'大发大发',value:'3',selected:true,id:1,key:'a5'},
// 		{name:'大发大发',value:'3',selected:true,id:1,key:'a6'},
// 		{name:'大发大发',value:'3',selected:true,id:1,key:'a7'}
// 	];
// 	group1.click = function(data){
// 		console.log(data);          //返回出入的数据结构
// 	};



require('../customElement/pc/input_search');
require('../customElement/phone/b_switch');



let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');



class bGroupSwitch extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {

	}

	constructor() {
		super();

		this.body = null;

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

		this.createStyle();
		let style = addStyleText(this.cssText);
		this.shadow.appendChild(style);


		this.name = $(this).attr('name') || '';
		this.userClick = function(){};
		//创建dom
		this.createElement();

		this.shadow.appendChild(this.body.get(0));

		this.bindEvent();
	}

	createElement(){
		let body = $('<div class="body box_sct"></div>'),
			main = $('<div class="main"></div>'),
			title = $('<div class="title box_hlc">'+this.name+'</div>'),
			list = $('<div class="list box_slc"></div>'),
			btn = $('<div class="btn box_hcc gray">提交</div>'),
			item = $('<div class="item box_hlc"></div>');

		main.append(title).append(list);
		body.append(main).append(btn);

		this.listBody = list;
		this.btn = btn;
		this.item = item;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{width:100%; padding:20px; box-sizing:border-box;}',
			'.main{width:100%; font-size:14px; color:#333;border:1px solid #ccc;}',
			'.title{width:100%; height:40px; padding-left:20px;background:#eee;font-weight:bold}',
			'.list{width:100%;}',
			'.item{width:100%; border-top:1px solid #eee; padding:5px 10px;}',
			'.item b-switch{display:block; width:60px; height:24px; padding-left:20px;}',
			'.btn{width:60%;height:34px; background:#5576f0;color:#fff;margin-top:20px;}',
			'.gray{background:#eee;}'
		];

		this.cssText = css.join('');
	}

	bindEvent(){
		let _this = this;

		this.btn.click(async function(){
			let cacheDta = _this.cacheData || {};
			if($(this).hasClass('gray')){return;}

			let item = _this.listBody.find('.item'),
				backData = [];

			for(let i=0,l=item.length;i<l;i++){
				let _item = item.eq(i),
					data = _item.data('data'),
					_input = _item.find('b-input-search').get(0),
					_switch = _item.find('b-switch').get(0);

				let val = await _input.checkPass(),
					checked = _switch.val;

				//只返回修改过的值
				let cacheThisData = cacheDta[data.id];
				if(cacheThisData.value == val && cacheThisData.selected == checked){

				}else{
					data.value = val;
					data.selected = checked;
					backData.push(data);
				}
			}

			_this.userClick(backData);

		});
	}

	set data(data){
		data = data || [];

		let cacheData = {};
		data.map(rs=>{
			rs.value = (!rs.value)? 0 : rs.value;
			cacheData[rs.id] = rs;
		});
		this.cacheData = cacheData;

		let body = this.listBody,
			item = this.item,
			_this = this;

		if(data.length == 0){
			this.btn.css({display:'none'});
		}
		data.map(rs=>{
			let _item = item.clone(),
				_input = $(`<b-input-search rule="must,number" class="boxflex1" name="${rs.name || ' '}" key="${rs.key}" unit="天" err="天数必须为正整数"></b-input-search>`).get(0),
				_switch = $(`<b-switch></b-switch>`).get(0);

			_input.inputBodyStyle = {width:'65px'};
			_input.nameStyle = {fontSize:'12px',width:'auto'};
			_input.inputBodyDom.removeClass('boxflex1');
			_input.body.find('.__input__').attr({maxlength:3});
			_input.nameDom.addClass('boxflex1');
			_input.value = rs.value || 0;
			_switch.val = rs.selected;
			_switch.checkBgColor = '#5576f0';

			_item.data({data:rs});
			_item.append(_input).append(_switch);

			_input.inputFn = function(){
				_this.btn.removeClass('gray').addClass('hover');
			};
			_switch.changeFn = function(val){
				_this.btn.removeClass('gray').addClass('hover');
			};

			body.append(_item);
		})
	}

	set click(fn){
		fn = fn || function(){};
		this.userClick = fn;
	}
}



if(!customElements.get('b-group-switch')){
	customElements.define('b-group-switch', bGroupSwitch );
}

