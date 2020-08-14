
//首页 通知 滚动条

// html:
// 	b-index-notice(id='notice' class='notice')

//js:
// 	let notice = $('#notice').get(0);
// 	notice.showData = [{text:'123',...}];       //text属性必须
// 	notice.clickFn = function(rs){
// 		console.log(rs)             //传入的对象
// 	}


let lib = require('../lib');
require('../lib/jq/extend');


let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');



class bIndexNotice extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {
		let _this = this;
		setTimeout(function(){
			_this.body.css({display:'flex'});
		},0)

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


		//创建dom
		this.createElement();

		this.userClickFn = function(){};

		this.shadow.appendChild(this.body.get(0));

		this.addEvent();
	}



	createElement(){
		let body = $('<div class="notice box_hlc" style="display: none;"></div>'),
			img = $('<img src="./image/notice.png"/>'),
			p = $('<p>信息播报：</p>'),
			scrollBody = $('<div class="boxflex1 notice_main"></div>'),
			scrollDiv = $('<div class="notice_scroller box_hlc"></div>'),
			list = $('<span class="hover"></span>');

		body.append(img).append(p).append(scrollBody);
		scrollBody.append(scrollDiv);

		this.scrollDiv = scrollDiv;
		this.item = list;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.notice{padding:0 20px;height: 50px;background: #fff;}',
			'.notice img{display: block;width: 24px;height: 20px;margin-right: 10px;}',
			'.notice p{font-size: 14px; color: #000000; font-weight: bold;}',
			'.notice_main{position: relative;overflow: hidden;height: 50px;}',
			'.notice_scroller{position: absolute;left:0; top:0;height: 50px;}',
			'.notice_scroller span{padding:0 20px;font-size: 12px;}'
		];


		this.cssText = css.join('');
	}

	createList(data){
		let body = this.scrollDiv,
			item = this.item,
			_this = this;

		body.find('span').unbind('click');
		body.html('').addClass('hidden');
		data.map(rs=>{
			let _item = item.clone();
			_item.data({data:rs});
			_item.text(rs.text);

			_item.click(function(){
				let data = $(this).data('data');
				_this.userClickFn(data);
			});
			body.append(_item);
		});
	}

	set showData(data){
		if(!data || data.length == 0){
			return;
		}

		this.stopAnimate();
		this.createList(data);
		setTimeout(()=>{
			this.startAnimate();
		},300)
	}
	set clickFn(fn){
		fn = fn || function(){};
		this.userClickFn = fn;
	}

	stopAnimate(){
		if(this.intervalFn){
			clearInterval(this.intervalFn);
			this.intervalFn = null;
		}

		this.scrollDiv.css({
			'transition-property': '',
			'transition-duration': '',
			'transition-timing-function': '',
			'will-change': 'auto',
			'transform-style': '',
			'backface-visibility': ''
		});
	}

	startAnimate(){
		let width = parseInt(this.scrollDiv.parent().width()),
			width1 = parseInt(this.scrollDiv.width()),
			time = (width+width1)*15,
			_this = this;

		this.scrollDiv.css({
			transform:'translateX('+width+'px)'
		}).removeClass('hidden');

		let animateFn = function(){
			_this.scrollDiv.cssAnimate({
				transform:'translateX('+-width1+'px)'
			},time,()=>{
				_this.scrollDiv.css({
					transform:'translateX('+width+'px)'
				});
			},true,'linear')
		};

		setTimeout(function(){
			animateFn();
			_this.intervalFn = setInterval(()=>{
				animateFn();
			},time+3000)
		},10)

	}

	addEvent(){
		let _this = this;
		document.addEventListener('visibilitychange',function(){ //浏览器切换事件
			if(document.visibilityState=='hidden') { //状态判断
				_this.stopAnimate();
			}else {
				_this.startAnimate();
			}
		});
		window.addEventListener("focus",()=>{
			_this.startAnimate();
		});
		window.addEventListener("blur",()=>{
			_this.stopAnimate();
		});
	}

}



if(!customElements.get('b-index-notice')){
	customElements.define('b-index-notice', bIndexNotice );
}


