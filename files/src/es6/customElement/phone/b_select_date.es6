
//==========================================================
//日期选择控件  可以不要日期
//==========================================================



// html:
// 可设置的属性,也可以在js中设置
// js中设置直接   banner.xxx = xxx;
// @attr:title              str：弹出选择时的标题
// @attr:val                str：当前选中的值。 多选逗号隔开 1,2,3
// @attr:placeholder        str：val为空时显示
// @attr:minDate            str: 允许的最小日期 eg:2011-11-11
// @attr:maxDate            str: 允许的最大日期 eg:2011-11-11
// @attr:isShowDay          bool: 是否显示日期
// @attr:viewPort           number:设置viewport大小
// 	<b-select style="..."></b-select>

// js:
// 	let dom = $('b-select-date').get(0);

//  dom.val = '';
//  dom.viewport = 750;
//  dom.title = '请选择您的年龄';
//  dom.placeholder = '请选择你的年龄';

//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let $$ = require('../../lib/event/$$'),
	selectFn = require('../../lib/input/date'),
	bodyDom = Symbol('body'),
	init = Symbol('init'),
	createBody = Symbol('createBody'),
	addEvent = Symbol('addEvent'),
	selectData = Symbol('selectData'),
	bindData = Symbol('bindData'),
	showSelect = Symbol('showSelect'),
	showVal = Symbol('showVal');


class bSelectDate extends HTMLElement{

	//注册要监听的属性
	static get observedAttributes() {
		return [
			"val",
			"placeholder",
			'mindate',
			'maxdate',
			'isshowday'
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
			selected = dom.attr('val'),
			title = dom.attr('title') || '请选择',
			minDate = dom.attr('minDate') || '1950-1-1',
			maxDate = dom.attr('maxDate') || '2050-12-12',
			isShowDay = !($(this).attr('isShowDay')==='false'),
			minDateId = dom.attr('minDateId') || '',
			maxDateId = dom.attr('maxDateId') || '',
			viewPort = dom.attr('viewport') || 750;
		viewPort = parseInt(viewPort);

		if(minDateId){
			minDate = document.getElementById(minDateId).val;
		}
		if(maxDateId){
			maxDate = document.getElementById(maxDateId).val;
		}

		new selectFn({
			titleText:title,       //@param:str             标题  默认：请选择
			selected:selected,     //@param:array(必填)    选中的值
			minDate:minDate,         //@param:str    最小显示时间 默认：1950-1-1
			maxDate:maxDate,       //@param:str    最大显示时间 默认：2050-12-12
			isShowDay:isShowDay,     //@param:bool   是否显示日,默认：true           //@param:boolean          单选还是多选   默认true
			viewPort:viewPort,       //@param:number 设置psd的大小，布局需要使用rem 默认：750
			success:function(rs){
				//返回 yy-mm-dd
				dom.attr({
					val:rs
				})
			},
			error:function(){
				//取消选择
			}
		});
	}

	[showVal](){
		let val = $(this).attr('val'),
			placeholder = $(this).attr('placeholder') || '请选择',
			minDate = $(this).attr('minDate') || '1950-1-1',
			maxDate = $(this).attr('maxDate') || '2050-12-12',
			isShowDay = !($(this).attr('isShowDay')==='false'),
			text = '';

		if(!val){
			$(this.shadow).find('.placeholder').text(placeholder);
			$(this.shadow).find('.val').text('');
			return;
		}


		let nowVal = new Date(val).getTime(),
			minVal = new Date(minDate).getTime(),
			maxVal = new Date(maxDate).getTime();

		if(nowVal < minVal){
			text = minDate;
		}else if(nowVal > maxVal){

			text = maxDate;
		}else{
			text = val;
		}


		if(!isShowDay){
			let t = text.split('-');
			text = t[0]+'-'+t[1];
		}

		$(this.shadow).find('.val').text(text);
		$(this.shadow).find('.placeholder').text('');
	}


	get val(){
		return $(this).attr('val');
	}
	//val eg: 2011-11-11
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

	set minDateId(id){
		$(this).attr({minDateId:id});
	}

	set maxDateId(id){
		$(this).attr({maxDateId:id});
	}

	get minDate(){
		return $(this).attr('minDate');
	}
	set minDate(val){
		$(this).attr({minDate:val});
	}

	get maxDate(){
		return $(this).attr('maxDate');
	}
	set maxDate(val){
		$(this).attr({maxDate:val});
	}

	get isShowDay(){
		return !($(this).attr('isShowDay')==='false');
	}
	set isShowDay(val){
		$(this).attr({isShowDay:val});
	}

}





if(!customElements.get('b-select-date')){
	customElements.define('b-select-date', bSelectDate );
}