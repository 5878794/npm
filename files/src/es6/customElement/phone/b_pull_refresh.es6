

//==========================================================
//下拉刷新页面
//==========================================================

//html:
//  注意：参数只能写到dom上
//  @attr:viewport                  number 布局参数 默认：750
// 										   单位rem 默认：0
// 	<b-push-load viewport='750'></b-push-load>


//js：
//  refreshFn：默认是刷新当前页面
//  window.location.reload();
//  可以自己更改

//  let dom = $('b-push-load').get(0);
//  dom.refreshFn = function(){
//      。。。
// };



//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let pullRefreshFn = require('../lib/ui/pullRefresh');

let bodyDom = Symbol(),
	createDom = Symbol(),
	addFn = Symbol(),
	refreshFn = Symbol(),
	fn = Symbol();


class bPullRefresh extends HTMLElement{
	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'viewport'
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {
		let viewport = $(this).attr('viewport') || 750;
		this.param.viewport = viewport;
	}

	//元素加入页面回调
	connectedCallback() {
		// console.log('connect');
		// this[setParam]();
	}

	constructor(){
		super();
		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this.param = {
			viewport:750
		};
		this[bodyDom] = null;
		this[fn] = null;
		this[refreshFn] = function(){
			window.location.reload();
		};


		this[createDom]();
		this[addFn]();
	}

	[createDom](){
		let div = $('<div><span>下拉刷新</span></div>');
		div.css({
			width:'100%',
			height:'40px',
			'text-align':'center',
			'line-height':'40px',
			'font-size':'14px',
			color:'#333'
		});

		this[bodyDom] = div;
		this.shadow.appendChild(this[bodyDom].get(0));
	}

	[addFn](){
		let _this = this;

		this[fn] = new pullRefreshFn({
			refreshDom:this[bodyDom],
			canRefreshFn:function(){
				//函数自己生成的div需要这样设置修改文字
				_this[bodyDom].find('span').text("释放刷新");
			},
			notCanRefreshFn:function(){
				_this[bodyDom].find('span').text("下拉刷新");
			},
			refreshFn:function(){
				_this[refreshFn]();
			},
			viewport:this.param.viewport  //psd效果图大小。前提使用rem布局
		});
	}


	get refreshFn(){
		return this[refreshFn];
	}
	set refreshFn(f){
		this[refreshFn] = f;
	}

	get viewport(){
		return this.param.viewport;
	}
	set viewport(val){
		this.param.viewport = val;
		$(this).attr({viewport:val});
	}

}




if(!customElements.get('b-pull-refresh')){
	customElements.define('b-pull-refresh', bPullRefresh );
}