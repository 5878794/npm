
//==========================================================
//双数字选择
//==========================================================



// html:
// 可设置的属性,也可以在js中设置
// js中设置直接   banner.xxx = xxx;
// @attr:title              str：弹出选择时的标题
// @attr:placeholder        str：val为空时显示
// @attr:viewPort           number:设置viewport大小
// 	<b-select-number style="..."></b-select>

// js:
// let select = $('#du').get(0);
// select.data1 = [33,34,35,36,37,38,39,40,41,42,43,44];
// select.data2 = [0,1,2,3,4,5,6,7,8,9];
// select.val = '';
// select.units = ['。','度'];
// select.viewport = 750;
// select.title = '体温';
// select.placeholder = '请选择';

//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let $$ = require('../../lib/event/$$'),
	numberSelectFn = require('../../lib/input/numberSelect'),
	bodyDom = Symbol('body'),
	init = Symbol('init'),
	createBody = Symbol('createBody'),
	addEvent = Symbol('addEvent'),
	selectData = Symbol('selectData'),
	bindData = Symbol('bindData'),
	bindData1 = Symbol('bindData1'),
	showSelect = Symbol('showSelect'),
	showVal = Symbol('showVal');


class bSelectNumber extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		return [
			"val",
			"placeholder",
			"units"
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
			title = dom.attr('title') || '请选择',
			units = dom.attr('units') || '',
			data1 = this[bindData],
			data2 = this[bindData1],
			viewPort = dom.attr('viewport') || 750;
		viewPort = parseInt(viewPort);
		selected = selected.split(',');
		units = units.split(',');


		new numberSelectFn({
			titleText:title,       //@param:str    标题
			viewPort:viewPort,                //@param:number 设置psd的大小，布局需要使用rem 默认：750
			selected:selected,            //@param:array  选中的值
			units:units,           //@param:array  2列的单位
			unit2Left:'90%',            //@param:str    第2列单位距左边屏幕的位置,默认90%;
			textAlign:['center','center'],         //@param:array    文字对齐方式,同css,默认居中
			values:[                    //@param:array
				data1,             //第一列的值
				data2           //第二列的值
			],
			success:function(rs){
				//rs返回选择的年月日   yyyy-mm-dd
				dom.attr({
					val:rs.join(',')
				})
			},
			error:function(){
				//取消选择
			}
		});

		// new selectFn({
		// 	titleText:title,       //@param:str             标题  默认：请选择
		// 	selected:selected,     //@param:array(必填)    选中的值
		// 	minDate:minDate,         //@param:str    最小显示时间 默认：1950-1-1
		// 	maxDate:maxDate,       //@param:str    最大显示时间 默认：2050-12-12
		// 	isShowDay:isShowDay,     //@param:bool   是否显示日,默认：true           //@param:boolean          单选还是多选   默认true
		// 	viewPort:viewPort,       //@param:number 设置psd的大小，布局需要使用rem 默认：750
		// 	success:function(rs){
		// 		//返回 yy-mm-dd
		// 		dom.attr({
		// 			val:rs
		// 		})
		// 	},
		// 	error:function(){
		// 		//取消选择
		// 	}
		// });
	}

	[showVal](){
		let val = $(this).attr('val'),
			placeholder = $(this).attr('placeholder') || '请选择',
			units = $(this).attr('units') || '',
			// minDate = $(this).attr('minDate') || '1950-1-1',
			// maxDate = $(this).attr('maxDate') || '2050-12-12',
			// isShowDay = !($(this).attr('isShowDay')==='false'),
			text = '';

		if(!val){
			$(this.shadow).find('.placeholder').text(placeholder);
			$(this.shadow).find('.val').text('');
			return;
		}


		val = val.split(',');
		units = units.split(',');
		let val1 = val[0] || '',
			val2 = val[1] || '',
			unit1 = units[0] || '',
			unit2 = units[1] || '';
		if(val1 != ''){
			text += val1 + unit1 + val2 + unit2;
		}


		$(this.shadow).find('.val').text(text);
		$(this.shadow).find('.placeholder').text('');
	}


	get val(){
		return $(this).attr('val');
	}
	//val eg: [10,1]
	set val(val){
		val = val || [];
		val = val.join(',');
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

	get data1(){
		return this[bindData];
	}
	//val  : [1,2,3,4]
	set data1(val){
		this[bindData] = val;
	}

	//val  : [1,2,3,4]
	get data2(){
		return this[bindData1];
	}
	set data2(val){
		this[bindData1] = val;
	}

	get units(){
		return $(this).attr('units');
	}
	set units(val){
		val = val.join(',');
		$(this).attr({'units':val});
	}

}




if(!customElements.get('b-select-number')){
	customElements.define('b-select-number', bSelectNumber );
}
