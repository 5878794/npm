

//==========================================================
//b_table
//==========================================================







//polyfill 需要
require('@webcomponents/custom-elements');
require('@webcomponents/shadydom');

let addStyleFile = require('../../fn/addStyleFile'),
	getTagFromSlot = require('../../fn/getTagFromSlot');

let bodyDom = Symbol(),
	createList = Symbol(),
	mainDom = Symbol(),
	createSlot = Symbol(),
	createMain = Symbol(),
	createDom = Symbol();


class bTable extends HTMLElement{
	//元素加入时
	connectedCallback() {

		//设置标签类型 b-row 的
		$(this).css({display:'block'});

	}

	constructor(){
		super();

		this.listData = [];
		this[mainDom] = null;
		this[bodyDom] = null;


		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});
		this[createDom]();
		this[createMain]();
		this[createSlot]();
		this.shadow.appendChild(this[bodyDom].get(0));


	}

	//创建元素
	[createDom](){
		let dom = $('<div></div>');
		dom.css({width:'100%'});
		this[bodyDom] = dom;
	}

	//创建列表插入容器
	[createMain](){
		let dom = $('<div></div>');
		dom.css({width:'100%'});
		this[mainDom] = dom;
		this[bodyDom].append(dom);
	}

	//创建存放模版的容器
	[createSlot](){
		//添加子元素
		let template = $('<template></template>'),
			slot = $('<slot></slot>');

		template.append(slot);
		this[bodyDom].append(template);
	}


	[createList](){

		let body = this[mainDom],
			list = $(this).find('b-row');

		this[mainDom].html('');


		this.listData.map(rs=>{
			let thisList = list.clone();
			thisList.get(0).data = rs;
			body.append(thisList);
		});
	}


	createTitleRow(dom){
		console.log(dom)
		// this.shadowRoot.append(dom);
		// this[mainDom].append(dom)
		// dom.insertBefore(this[mainDom]);
	}

	set data(val){
		this.listData = val;
		this[createList]();
	}
}


customElements.define('b-table', bTable);
