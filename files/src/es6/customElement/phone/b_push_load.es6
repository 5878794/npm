
//==========================================================
//上拉加载更多
//==========================================================

//html:
//  可设置的属性,也可以在js中设置
//  注意：设置 getData 属性的函数后会自动执行并载入第一页数据，
//       之后在设置参数无效咯
//  js中设置直接   bPushLoad.xxx = xxx;
//  @attr:viewport                  number 布局参数 默认：750
//  @attr:bottomFixedDivHeight      number 固定fixed的dom距离底部距离
// 										   单位rem 默认：0
// 	<b-push-load></b-push-load>

//js：
//  let dom = $('b-push-load').get(0);
//  dom.pageSizes = 10;
//  dom.viewport = 750;

//  数据筛选后重新计算分页
//  dom.reload();

//  注意是异步函数，并会加载第一页数据
//  第一页要加的loading 需要判断pageIndex参数

// dom.getData = async function(pageIndex,pageSize){
// 	if(pageIndex == 1){
// 		loading.show();
// 	}
//
// 	let data = await ajax.getData('...');
// 	$('body').append('...');
//
// 	if(pageIndex == 1){
// 		loading.hide();
// 	}
//
// 	//设置组件的状态 需要放到逻辑的最后面
// 	//根据pageSize和返回的数据长度 ，分情况调用下面的一个方法
// 	this.loadOk();      //加载完成还有后面的页 调用该方法
// 	this.loadError();   //加载错误 调用
// 	this.loadEnd();     //没有更多数据  调用
// };


//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let pushLoadingFn = require('../../lib/ui/pushLoading'),
	$$ = require('../../lib/event/$$');


let createDom = Symbol(),
	bodyDom = Symbol(),
	addFn = Symbol(),
	fn = Symbol(),
	getDataFn = Symbol();



class bPushLoad extends HTMLElement{
	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'viewport',
			'pageSizes',
			'bottomfixeddivheight'
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {
		let viewport = $(this).attr('viewport') || 750,
			bottomfixeddivheight = $(this).attr('bottomfixeddivheight') || 0,
			pagesize = $(this).attr('pagesizes') || 20;

		this.param.viewPort = 750;
		this.param.bottomFixedDivHeight = 0;
		this.pageSize = pagesize;

	}

	//元素加入页面回调
	connectedCallback() {
		// console.log('connect');
		// this[setParam]();
	}

	//元素移除执行
	disconnectedCallback(){
		// this[fn].destroy();
		// return function(){};
	}

	constructor(){
		super();
		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this.pageSize = 20;
		this.pageIndex = 1;
		this.param = {
			viewport:750,
			bottomFixedDivHeight:0
		};
		this[bodyDom] = null;
		this[fn] = null;
		this[getDataFn] = function(){};


		this[createDom]();
		this[addFn]();
		// $(this).css({display:'none'});
	}

	[createDom](){
		let div = $('<div>上拉加载</div>');
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
		this[fn] = new pushLoadingFn({
			loadingDom:_this[bodyDom],
			canLoadingFn:function(){            //拖动到能下载加载时触发到函数
				if(_this.pageIndex == 1){
					$(this).addClass('hidden');
				}else{
					$(this).removeClass('hidden');
				}
				_this[bodyDom].text("释放加载");
			},
			notCanLoadingFn:function(){         //拖动到不能下载加载时触发到函数
				if(_this.pageIndex == 1){
					$(this).addClass('hidden');
				}else{
					$(this).removeClass('hidden');
				}
				_this[bodyDom].text("上拉加载");
			},
			loadingFn:function(){               //加载函数
				_this[bodyDom].text("正在加载");

				if(_this.pageIndex == 1){
					$(this).addClass('hidden');
				}else{
					$(this).removeClass('hidden');
				}

				_this[getDataFn].call(_this,_this.pageIndex,_this.pageSize);
			},
			viewport:this.param.viewport,                       //psd大小   使用rem布局
			bottomFixedDivHeight:this.param.bottomFixedDivHeight              //底部如果有fixed定位的dom的高度  单位rem
		});
	}

	reload(){
		this[fn].destroy();
		this[addFn]();
		this.pageIndex = 1;
		this[fn].firstLoad();
	}

	get getData(){
		return this[getDataFn];
	}
	set getData(f){
		this[getDataFn] = f;
		this[fn].firstLoad();

	}

	loadError(){
		let _this = this;
		this[bodyDom].text("加载失败，点击重试！");
		$$(this[bodyDom]).myclickok(function(){
			_this[bodyDom].text("正在加载");
			$$(this[bodyDom]).unbind(true);
			_this[getDataFn].call(_this,_this.pageIndex,_this.pageSize);
		});
	}

	loadOk(){
		this.pageIndex++;
		this[fn].loadingEnd();
		return function(){};
	}

	loadEnd(){
		this[fn].destroy();
		return function(){};
	}


	get viewPort(){
		return this.param.viewport;
	}
	set viewPort(val){
		this.param.viewport = val;
		$(this).attr({viewport:val});
	}

	//单位rem
	get bottomFixedDivHeight(){
		return this.param.bottomFixedDivHeight;
	}
	set bottomFixedDivHeight(val){
		this.param.bottomFixedDivHeight = val;
		$(this).attr({bottomFixedDivHeight:val});
	}

	//
	get pageSizes(){
		return this.pageSize;
	}
	set pageSizes(val){
		this.pageSize = val;
		$(this).attr({pageSizes:val});
	}

	get index(){
		return this.pageIndex;
	}
	set index(val){
		this.pageIndex = val;
	}

	pause(){
		this[fn].pause();
	}

	restore(){
		this[fn].restore();
	}

	destroy(){
		this[fn].destroy();
	}
}


if(!customElements.get('b-push-load')){
	customElements.define('b-push-load', bPushLoad );
}
