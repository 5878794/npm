
//==========================================================
//select选择控件  可以单选、多选
//==========================================================



// html:
// 可设置的属性,也可以在js中设置
// js中设置直接   banner.xxx = xxx;
// @attr:title              str：弹出选择时的标题
// @attr:val                str：当前选中的值。 多选逗号隔开 1,2,3
// @attr:placeholder        str：val为空时显示
// @attr:isRadio            Boolean：是否是单选
// @attr:viewPort           number:设置viewport大小
// 	<b-select style="..."></b-select>

// js:
// 	let data = [                      //@param:array(必填)      select的数据
// 		{key:"1",val:"男"},
// 		{key:"2",val:"女"},
// 		{key:'3',val:'不告诉你'}
// 	];
// 	let dom = $('b-select').get(0);

//  dom.data =data;     //必须在js中设置
//  dom.val = '';
//  dom.isRadio = true;
//  dom.viewport = 750;
//  dom.title = '请选择您的年龄';
//  dom.placeholder = '请选择你的年龄';

//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let $$ = require('../../lib/event/$$'),
	selectFn = require('../../lib/input/select'),
	bodyDom = Symbol('body'),
	init = Symbol('init'),
	createBody = Symbol('createBody'),
	addEvent = Symbol('addEvent'),
	selectData = Symbol('selectData'),
	bindData = Symbol('bindData'),
	showSelect = Symbol('showSelect'),
	showVal = Symbol('showVal');


class bSelect extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		return [
			"val",
			"placeholder"
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {
		// if(name == 'val'){
		// 	setTimeout(()=>{
				this[showVal]();
			// },0);
		// }
	}

	//元素加入页面回调
	connectedCallback() {
		// console.log('connect');
		this[showVal]();
	}

	//元素删除回调
	// disconnectedCallback(){
	// 	console.log('删除咯');
	// }

	constructor(){
		super();

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this[bodyDom] = null;
		this[selectData] = [];
		this[bindData] = [];

		this[init]();
	}


	[init](){
		this[createBody]();
		this[addEvent]();



		this.shadow.appendChild(this[bodyDom].get(0));

	}

	[createBody](){
		let div = $('<div></div>'),
			span = $('<span class="val"></span>'),
			span1 = $('<span class="placeholder"></span>');

		div.css({
			width:'100%',
			height:'100%'
		});
		span.css({
			// color:'#333'
		});
		span1.css({
			color:'#ccc'
		});

		div.append(span).append(span1);
		this[bodyDom] = div;
	}

	[addEvent](){
		let _this = this;

		$$(this[bodyDom]).myclickok(function(){
			$('input').blur();
			setTimeout(function(){
				let top = $("body").scrollTop();
				$("html,body").animate({scrollTop:top+'px'},0);
				_this[showSelect]();
			},100)
		});
	}

	[showSelect](){
		let dom = $(this),
			selected = dom.attr('val') || '',
			data = this[bindData],
			title = dom.attr('title') || '请选择',
			isRadio = (dom.attr('radio') === 'true'),
			viewPort = dom.attr('viewport') || 750;
		viewPort = parseInt(viewPort);

		//处理data 让key全部转换成字符串
		data.map(rs=>{
			rs.key = rs.key.toString();
		});

		//处理选中的数组 初始传入为 1,2,3 要转换成数组
		selected = selected.split(',');
		let newSelected = [];
		selected.map(rs=>{
			newSelected.push(rs.toString());
		});


		new selectFn({
			titleText:title,       //@param:str             标题  默认：请选择
			data:data,
			selected:newSelected,           //@param:array(必填)    选中的key
			radio:isRadio,                  //@param:boolean          单选还是多选   默认true
			viewPort:viewPort,                //@param:number 设置psd的大小，布局需要使用rem 默认：750
			success:function(rs){
				//返回选择的对象
				//json数组，  传入的格式

				let keys = [];
				rs.map(r=>{
					keys.push(r.key)
				});

				dom.attr({
					val:keys.join(',')
				})
			},
			error:function(){
				//取消选择
			}
		});
	}

	[showVal](){
		let val = $(this).attr('val'),
			data = this[bindData],
			placeholder = $(this).attr('placeholder'),
			text = [];

		//没有数据或选值时
		if(!data){return;}

		if(!val){
			$(this.shadow).find('.placeholder').text(placeholder);
			$(this.shadow).find('.val').text('');
			return;
		}

		val = ','+val+',';
		data.map(rs=>{
			let thisKey = rs.key;
			thisKey = ','+thisKey+',';

			if(val.indexOf(thisKey)>-1){
				text.push(rs.val);
			}
		});

		text = text.join('、');

		$(this.shadow).find('.val').text(text);
		$(this.shadow).find('.placeholder').text('');
	}


	get data(){
		return this[bindData];
	}
	set data(val){
		this[bindData] = val;
		this[showVal]();
	}

	get val(){
		return $(this).attr('val');
	}
	//val 单选时候是  eg:1
	//val 多选时候是  eg:1,2,3
	set val(val){
		$(this).attr({val:val});
		// this[showVal]();
	}

	get placeholder(){
		return $(this).attr('placeholder');
	}
	set placeholder(text){
		$(this).attr({'placeholder':text});
		// this[showVal]();
	}

	get isRadio(){
		return ($(this).attr('radio') === 'true');
	}
	set isRadio(state){
		state = (state)? true : false;
		$(this).attr({radio:state});
	}

	get viewPort(){
		return parseInt($(this).attr('viewport'));
	}
	set viewPort(val){
		val = parseInt(val);
		$(this).attr({'viewport':val});
	}

	get title(){
		return $(this).attr('title');
	}
	set title(text){
		$(this).attr({title:text});
	}
}





if(!customElements.get('b-select')){
	customElements.define('b-select', bSelect );
}