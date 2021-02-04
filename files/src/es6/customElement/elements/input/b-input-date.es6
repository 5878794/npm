
//同 b-input-text



//元素上增加属性（属性上使用时间戳会自动转换为日期格式）
//@stamp   有该属性，获取value属性时输出时间戳
//@min     能选择的最小日期
//@max     能选择的最大日期
//@system  使用系统控件(现在只有chrome支持)



let publishInput = require('./_input-all'),
	t2s = require('../../../lib/fn/timeAndStamp'),
	addStyleStyle = require('../../fn/addStyleText');
require('./_calendar');




class bInputDate extends publishInput{
	constructor() {
		super();

		if(this.hasAttribute('system')){
			this.createInput(true);
		}else{
			this.createInput(false);

			this.loadingCss();
			this.loadingJs();
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
		this.inputDom.myDatePicker({
			'startDate':'2014-01-01 18:45:20',
			'endDate':(new Date()).Format("yyyy-mm-dd hh:ii:ss"),
			//指定父元素，不指定默认为body
			parent:this.inputDom.parent(),
			//定位方式是否用fixed
			positionFixed:false,
		});
	}
	loadingCss(){
		let css = '.my-date-picker-bg *{\n' +
			'    box-sizing: border-box;\n' +
			'}\n' +
			'.my-date-picker-bg *::-webkit-scrollbar{\n' +
			'    width: 2px;\n' +
			'    height: 3px !important;\n' +
			'}\n' +
			'.my-date-picker-bg *::-webkit-scrollbar-thumb{\n' +
			'    background: #ccc;\n' +
			'}\n' +
			'.my-date-picker-bg *::-webkit-scrollbar-thumb:hover{\n' +
			'    background: #777;\n' +
			'}\n' +
			'input.date-time-picker:focus,input.date-time-picker:focus+i.input-icon,\n' +
			'input.date-time-picker.date-picker-focus,input.date-time-picker.date-picker-focus+i.input-icon{\n' +
			'    z-index: 10000;\n' +
			'}\n' +
			'.my-date-picker-bg{\n' +
			'    top: 0;\n' +
			'    position: absolute;\n' +
			'    left: 0;\n' +
			'    z-index: 9999;\n' +
			'    font-family: Hiragino Sans, "ヒラギノ角ゴシック", Hiragino Kaku Gothic ProN, "ヒラギノ角ゴ ProN W3", Roboto, "Droid Sans", YuGothic, "游ゴシック", Meiryo, "メイリオ", Verdana, "ＭＳ Ｐゴシック", sans-serif;\n' +
			'}\n' +
			'.my-date-picker-bg *:focus{\n' +
			'    outline: none !important;\n' +
			'}\n' +
			'\n' +
			'.my-date-picker-container{\n' +
			'    /* max-width: 100%; */\n' +
			'    position: absolute;\n' +
			'    background: white;\n' +
			'    border: 1px solid #ddd;\n' +
			'    /* box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2),0px 0px 0px 1px white inset,0px 0px 0px 2px #78c2ce inset;    */\n' +
			'    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);\n' +
			'    cursor: default;\n' +
			'    z-index: 9999;\n' +
			'    /* overflow: hidden; */\n' +
			'    user-select: none;\n' +
			'    animation: date-to-top 0.5s cubic-bezier(0.37, 0.07, 0.29, 1.85);\n' +
			'    font-weight: bold;\n' +
			'    font-size: 14px;\n' +
			'    border-radius: 1em;\n' +
			'    overflow-x: hidden;\n' +
			'}\n' +
			'\n' +
			'/* mobile fixed */\n' +
			'.my-date-picker-bg.date-picker-fixed{\n' +
			'    position: fixed;\n' +
			'    width: 100vw;\n' +
			'    height: 100vh;\n' +
			'    display: flex;\n' +
			'    align-items: center;\n' +
			'    justify-content: center;\n' +
			'    z-index: 99999\n' +
			'}\n' +
			'.my-date-picker-bg.date-picker-fixed .my-date-picker-container{\n' +
			'    top: auto !important;\n' +
			'    left: auto !important;\n' +
			'    position: fixed;\n' +
			'    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.4);\n' +
			'}\n' +
			'.my-date-picker-bg.date-picker-fixed .my-date-picker-container .my-date-picker-content{\n' +
			'min-width: 250px;\n' +
			'    max-width: calc(100vw - 30px) !important;\n' +
			'    width: auto !important;\n' +
			'}\n' +
			'.my-date-picker-bg.date-picker-fixed::before{\n' +
			'    content: "";\n' +
			'    display: block;\n' +
			'    position: fixed;\n' +
			'    width: 100vw;\n' +
			'    height: 100vh;\n' +
			'    top: 0;\n' +
			'    left: 0;\n' +
			'    background: rgba(0, 0, 0, 0.4);\n' +
			'    animation: fadeIn 0.3s;\n' +
			'}\n' +
			'/* mobile fixed */\n' +
			'\n' +
			'.my-date-picker-content{\n' +
			'    width: 100%;;\n' +
			'    display: flex;\n' +
			'    max-width: 100vw;\n' +
			'    padding: 10px 0px 15px 0px;\n' +
			'}\n' +
			'\n' +
			'.my-date-picker-container:focus{\n' +
			'    outline: none;\n' +
			'}\n' +
			'/* (15n + 5)px + 4nem */\n' +
			'/* 月 */\n' +
			'.my-date-picker-container.date-view-1,.my-date-picker-container.date-view-4 .my-date-picker-content{\n' +
			'    min-width: calc(9em + 35px);\n' +
			'}\n' +
			'/* 日 */\n' +
			'.my-date-picker-container.date-view-2,.my-date-picker-container.date-view-3 .my-date-picker-content{\n' +
			'    min-width: calc(13em + 50px);\n' +
			'}\n' +
			'/* 时分秒 */\n' +
			'.my-date-picker-container.date-view-5 .my-date-picker-content,\n' +
			'.my-date-picker-container.date-view-7 .my-date-picker-content,\n' +
			'.my-date-picker-container.date-view-6 .my-date-picker-content{\n' +
			'    min-width: calc(15em + 60px);\n' +
			'    overflow-x: auto;\n' +
			'}\n' +
			'@keyframes date-to-top{\n' +
			'    0%{\n' +
			'        transform: translateY(10px);\n' +
			'        opacity: 0;\n' +
			'    }\n' +
			'    100%{\n' +
			'        transform: translateY(0px);\n' +
			'        opacity: 1;\n' +
			'    }\n' +
			'\n' +
			'}\n' +
			'\n' +
			'.my-date-picker-panel{\n' +
			'    width: 100%;\n' +
			'    height: 200px;\n' +
			'    /* overflow: hidden; */\n' +
			'    padding: 0px 5px;\n' +
			'    display: flex;\n' +
			'    justify-content: center;\n' +
			'    position: relative;\n' +
			'}\n' +
			'.my-date-picker-panel:nth-of-type(1){\n' +
			'    padding:0px 5px 0px calc(1em + 5px);\n' +
			'}\n' +
			'.my-date-picker-panel-header{\n' +
			'    height: 100%;\n' +
			'    display: flex;\n' +
			'    align-items: center;\n' +
			'    justify-content: center;\n' +
			'    padding:0px  0px;\n' +
			'    margin:0px;\n' +
			'}\n' +
			'.my-date-picker-panel-body{\n' +
			'    width: 3em !important;\n' +
			'    /* background: rgba(0,0,0,0.05); */\n' +
			'    /* box-shadow: 0px 0px 0px 1px #eee; */\n' +
			'    cursor: grab;\n' +
			'    transition: background-color    0.3s;\n' +
			'}\n' +
			'.my-date-picker-panel-body ul{\n' +
			'    list-style: none;\n' +
			'    padding-left: 0;\n' +
			'    margin: 0;;\n' +
			'}\n' +
			'.my-date-picker-panel-body ul li,.my-date-picker-panel .date-title{\n' +
			'    display: flex;\n' +
			'    align-items: center;\n' +
			'    justify-content: center;\n' +
			'    height: 30px;\n' +
			'    /* background: #ccc; */\n' +
			'    padding-left: 2.5px ;\n' +
			'    padding-right: 2.5px;\n' +
			'}\n' +
			'.my-date-picker-panel-body:hover{\n' +
			'    background: #eee;\n' +
			'}\n' +
			'.date-title{\n' +
			'    color: #17a2b8;\n' +
			'}\n' +
			'.my-date-picker-panel:not(:last-of-type) .date-title{\n' +
			'    /* padding: 10px; */\n' +
			'}\n' +
			'.my-date-picker-panel-body .swiper-btn{\n' +
			'    display: none;\n' +
			'}\n' +
			'\n' +
			'.my-date-picker-panel::before,\n' +
			'.my-date-picker-panel::after{\n' +
			'    content: "";;\n' +
			'    display: block;\n' +
			'    position: absolute;\n' +
			'    width:calc(100% - 0px);\n' +
			'    left: 0;\n' +
			'    z-index: 999;\n' +
			'    pointer-events: none;\n' +
			'    border-style: solid;;\n' +
			'    border-color: transparent;;\n' +
			'}\n' +
			'.my-date-picker-panel::before{\n' +
			'    height: calc(50% - 14px);\n' +
			'    top: 0;\n' +
			'    border-width:0px 0px  1px 0px ;\n' +
			'    border-bottom-color: rgba(23, 164, 186, 0.6);;\n' +
			'    background: linear-gradient(to top,rgba(255,255,255,0.5),rgba(255,255,255,0.7));\n' +
			'    background: linear-gradient(to top,rgba(255,255,255,0.5) 10px,rgba(255,255,255,1));\n' +
			'}\n' +
			'\n' +
			'\n' +
			'.my-date-picker-panel::after{\n' +
			'    height: calc(50% - 15px);\n' +
			'    bottom: 0;\n' +
			'    border-width: 1px 0px 0px 0px ;\n' +
			'    border-top-color: rgba(23, 164, 186, 0.6);;\n' +
			'    background: linear-gradient(to bottom,rgba(255,255,255,0.5),rgba(255,255,255,0.7));\n' +
			'    background: linear-gradient(to bottom,rgba(255,255,255,0.5) 15px,rgba(255,255,255,1));\n' +
			'\n' +
			'}\n' +
			'\n' +
			'.date-picker-btn{\n' +
			'    color: #17a2b8;;\n' +
			'    box-shadow: none !important;\n' +
			'    background: transparent;;\n' +
			'    border: none;\n' +
			'    cursor: pointer;\n' +
			'    z-index: 9999;\n' +
			'    display: inline-flex;\n' +
			'    align-items: center;\n' +
			'    justify-content: center;\n' +
			'}\n' +
			'.my-date-picker-panel .date-picker-btn{\n' +
			'    position: absolute;\n' +
			'    left:calc(50% - 2.5em - 2.5px);\n' +
			'    width: 4em;\n' +
			'    line-height: 0;\n' +
			'}\n' +
			'.my-date-picker-panel:nth-of-type(1) .date-picker-btn{\n' +
			'    left:calc(50% - 2em - 2.5px);\n' +
			'}\n' +
			'\n' +
			'.date-picker-btn.increase-btn{\n' +
			'    bottom: -10px;\n' +
			'}\n' +
			'.date-picker-btn.decrease-btn{\n' +
			'    top:-10px;\n' +
			'}\n' +
			'\n' +
			'.date-picker-btn.increase-btn::before{\n' +
			'    content: "";\n' +
			'    border: 5px solid transparent;\n' +
			'    border-top-color: #17a2b8;\n' +
			'}\n' +
			'.date-picker-btn.decrease-btn::before{\n' +
			'    content: "";\n' +
			'    border: 5px solid transparent;\n' +
			'    border-bottom-color: #17a2b8;\n' +
			'}\n' +
			'.date-picker-btn:focus{\n' +
			'    box-shadow: none !important;\n' +
			'}\n' +
			'.my-date-picker-panel .date-picker-btn{\n' +
			'    opacity: 0;\n' +
			'    transition: all 0.3s;\n' +
			'}\n' +
			'.my-date-picker-panel:hover .date-picker-btn{\n' +
			'    opacity: 1;\n' +
			'}\n' +
			'.my-date-picker-container .operator-container{\n' +
			'    width: 100%;\n' +
			'    display: flex;\n' +
			'    justify-content: center;\n' +
			'    align-items: center;\n' +
			'    z-index: 9999;\n' +
			'    border-bottom: 1px solid #ddd;\n' +
			'    background: #eee;\n' +
			'    min-height: 16px;\n' +
			'}\n' +
			'.my-date-picker-container .operator-container span{\n' +
			'    text-align: center;;\n' +
			'    animation: fadeIn 0.3s;\n' +
			'}\n' +
			'.my-date-picker-container .operator-container span::before,\n' +
			'.my-date-picker-container .operator-container span::after{\n' +
			'    /* content: "\\ea55"; */\n' +
			'    content: "·";\n' +
			'    font-family: "ic";\n' +
			'    font-weight: 500;;\n' +
			'    color: inherit;\n' +
			'    margin:0px  1em;\n' +
			'}\n' +
			'\n' +
			'\n' +
			'\n' +
			'@keyframes fadeIn{\n' +
			'    0%{\n' +
			'        opacity: 0;\n' +
			'    }\n' +
			'    100%{\n' +
			'        opacity: 1;\n' +
			'    }\n' +
			'}\n' +
			'.date-picker-btn.cancel-btn{\n' +
			'    color: inherit !important;\n' +
			'}\n' +
			'\n' +
			'\n' +
			'@media screen and (max-width:768px){\n' +
			'    .my-date-picker-panel .my-date-picker-panel-body{\n' +
			'        background:rgba(0, 0, 0, 0.05);\n' +
			'    }\n' +
			'    /* .my-date-picker-bg::before{\n' +
			'        content: "";\n' +
			'        display: block;\n' +
			'        position: fixed;\n' +
			'        width: 100vw;\n' +
			'        height: 100vh;\n' +
			'        top: 0;\n' +
			'        left: 0;\n' +
			'        background: rgba(0, 0, 0, 0.4);\n' +
			'        animation: fadeIn 0.3s;\n' +
			'    }\n' +
			'    .my-date-picker-container{\n' +
			'        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.4);\n' +
			'    } */\n' +
			'    @keyframes fadeIn {\n' +
			'        0%{\n' +
			'            opacity: 0;\n' +
			'        }\n' +
			'        100%{\n' +
			'            opacity: 1;\n' +
			'        }\n' +
			'    }\n' +
			'\n' +
			'\n' +
			'}\n';
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
