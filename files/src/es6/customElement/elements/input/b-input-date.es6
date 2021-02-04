
//同 b-input-text



//元素上增加属性（属性上使用时间戳会自动转换为日期格式）
//@stamp   有该属性，获取value属性时输出时间戳
//@min     能选择的最小日期
//@max     能选择的最大日期
//@system  使用系统控件(现在只有chrome支持)



let publishInput = require('./_input-all'),
	t2s = require('../../../lib/fn/timeAndStamp'),
	addStyleStyle = require('../../fn/addStyleText');





class bInputDate extends publishInput{
	constructor() {
		super();

		if(this.hasAttribute('system')){
			this.createInput(true);
		}else{
			//TODO
			// this.createInput(false);
			//
			// this.loadingCss();
			// this.loadingJs();
		}

		this.addEvent();
	}


	createInput(useSystem){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';
		this.placeholder = placeholder;

		let inputType = (useSystem)? 'date' : 'text';
		let input = $(`<input autocomplete="off" class="boxflex1 __input__" type="${inputType}" placeholder="${placeholder}" data-rule="${rule}"/>`);

		input.css({
			height:this.userStyle.rowHeight+'px'
		});
		input.css(this.setting.inputDateStyle);

		this.inputBodyDom.prepend(input);
		this.inputDom = input;

		let value = $(this).attr('value');
		value = t2s.getDate1(value);
		input.val(value);


		let min = $(this).attr('min') || '',
			max = $(this).attr('max') || '';

		if(min){
			this.min = min;
		}
		if(max){
			this.max = max;
		}
	}

	//加载模拟的控件js css
	loadingJs(){
		xvDate({
			'targetId':this.inputDom.get(0),//时间写入对象的dom
			// 'triggerId':['date1','dateBtn1'],//触发事件的对象dom
			'alignId':this.inputDom.get(0),//日历对齐对象
			'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
			'min':'2014-09-20 10:00:00',//最大时间
			'max':'2014-10-30 10:00:00'//最小时间
		});
	}
	loadingCss(){
		let css = 'body,html,li,table,td,th,tr,ul{margin:0;padding:0}body{font-size:12px;font-family:arial,"Microsoft Yahei","Hiragino Sans GB",sans-serif}.dates_box{position:absolute;width:250px;border:1px solid #ccc;-webkit-box-shadow:1px 1px 2px 0 rgba(0,0,0,.1);-moz-box-shadow:1px 1px 2px 0 rgba(0,0,0,.1);box-shadow:1px 1px 2px 0 rgba(0,0,0,.1);background:#fff}.choose_btn,.dates_choose{float:left;position:relative}.dates_box_top{height:26px;padding:5px}.dates_choose{width:116px;border:1px solid #ccc}.choose_btn{width:20px;height:24px;text-align:center;cursor:pointer;background:#eee}.dates_choose .sign{display:inline-block;height:0;line-height:0;width:0;border:4px dashed transparent;vertical-align:middle;cursor:pointer}.prev_choose{border-right:1px solid #ccc}.next_choose{float:right;border-left:1px solid #ccc}.choose_btn .sign{margin-top:7px}.prev_choose .sign{border-left-width:0;border-right-color:#333}.next_choose .sign{border-right-width:0;border-left-color:#333}.ipt_wrap{float:left;width:74px;height:24px;line-height:24px;background:#fff;overflow:hidden}.ipt_wrap input{vertical-align:-1px}.ipt_wrap .dlt_status{border:none}.ipt_wrap .sign{border-bottom-width:0;border-top-color:#333;margin-right:4px}.dates_btn,.dates_hms,.dates_table{border:1px solid #ccc}.ipt_wrap small{font-size:12px;margin-right:5px}.dates_mm{float:right}.dates_table{margin:0 auto;width:240px;border-collapse:collapse}.dates_table thead tr th{background:#eee;border-bottom:1px solid #ccc;height:24px}.dates_table tr td{height:24px;text-align:center}.dates_mm_list span:hover,.dates_table tr td:hover,.dates_yy_list span:hover{background:#f2f2f2;cursor:pointer}.other_day{color:#aaa}.disable_day{color:#ddd;background:#f7f7f7}.current_day,.dates_mm_list span.current,.dates_yy_list span.current{background:#ebebeb}.dates_btn a,.dates_click,.time_tag{background:#eee}.dates_bottom{padding:5px;height:26px;overflow:hidden}.time_tag{padding:0 4px;margin-right:4px}.dates_hms{float:left;width:114px}.dates_hms li{float:left;height:24px;line-height:24px;vertical-align:middle}.dates_hms li input{width:14px;height:14px;line-height:14px;text-align:center;vertical-align:middle}.dates_hms li input.dlt_status{width:18px;border:none}.dates_btn{float:right;width:117px;border-right:none}.dates_btn a{float:left;cursor:pointer;height:24px;line-height:24px;padding:0 7px;border-right:1px solid #ccc}.choose_btn:hover,.dates_btn a:hover{background:#fefefe}.dates_mm_list,.dates_yy_list{width:116px;height:175px;overflow-y:auto;position:absolute;left:-1px;top:24px;background:#fff;border:1px solid #ccc}.dates_mm_list span{float:left;line-height:24px;margin:5px 0 0 8px;text-align:center;width:45px}.dates_yy_list span{display:block;line-height:24px;text-align:center;font-size:14px}';
		let style = addStyleStyle(css);
		this.body.append(style);
	}


	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('change',function(){
			let val = $(this).val();
			_this.changeFunction.call(_this, val);
		},false)

		input.addEventListener('focus',function(){
			_this.focusFunction.call(_this);
		});
		input.addEventListener('blur',function(){
			_this.blurFunction.call(_this);
		});
	}




	set value(val){
		val = t2s.getDate1(val);
		this.body.find('input').val(val);
	}
	get value(){
		//判断输出格式
		let isStamp = (this.hasAttribute('stamp')),
			val = this.body.find('input').val();

		if(isStamp){
			return (val)? new Date(val).getTime() : '';
		}else{
			return val;
		}
	}

	set min(val){
		let min = t2s.getDate1(val);
		this.inputDom.attr({min:min});
	}
	set max(val){
		let max = t2s.getDate1(val);
		this.inputDom.attr({max:max});
	}
}


if(!customElements.get('b-input-date')){
	customElements.define('b-input-date', bInputDate );
}
