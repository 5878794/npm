

let lib = require('../lib');


let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');



class bWinTop extends HTMLElement{
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

		this.shadow.appendChild(this.body.get(0));
	}



	createElement(){
		let body = $('<div class="top box_hlc" style="display: none;"></div>'),
			info1 = $('<div class="boxflex1 box_slc"><div><span>成都分公司</span><a>-</a><span>林妹妹</span><a>, 您好！</a></div></div>'),
			state = $('<div class="state">业务员、权限专员</div>'),
			info2 = $('<div class="top_btn"></div>'),
			btn1 = $('<span class="hover" id="mdf_pass">修改密码</span>'),
			btn2 = $('<span class="hover" id="my_2ma">我的二维码</span>'),
			btn3 = $('<span class="hover" id="logout">退出登录</span>');

		info1.append(state);
		info2.append(btn1).append(btn2).append(btn3);
		body.append(info1).append(info2);

		this.body = body;
	}
	createStyle(){
		let css = [
			'.top{width: 100%; height: 80px; overflow: hidden;padding-left: 30px; font-size: 16px;font-weight: bold;color:#000;}',
			'.top a{padding:0 5px;}',
			'.top_btn{padding:0 20px;}',
			'.top_btn span{padding:0 10px;border-right:1px solid #ccc;color:#333;font-size:14px;font-weight: normal;}',
			'.top_btn span:last-child{border:none;}',
			'.state{font-size:12px;color:#aaa;font-weight:normal;}'
		];


		this.cssText = css.join('');
	}



}



if(!customElements.get('b-win-top')){
	customElements.define('b-win-top', bWinTop );
}


