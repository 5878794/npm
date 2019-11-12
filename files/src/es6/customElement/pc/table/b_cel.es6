

//==========================================================
//b_cel
//==========================================================





let refreshParam = Symbol(),
	param = Symbol(),
	dom = Symbol();

//polyfill 需要
require('@webcomponents/custom-elements');
require('@webcomponents/shadydom');



class bCel extends HTMLElement{
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'width'
		];
	}

	//元素属性改变回调
	attributeChangedCallback(name, oldValue, newValue) {

		this[param].width = newValue;
		this[refreshParam]();

		// this[name] = newValue;
	}

	//元素加入页面回调
	connectedCallback() {
		let style = document.createElement('link');
		style.rel = "stylesheet";
		style.href = '../../src/css/all_pc.css';
		this[dom].append($(style));


	}

	//元素删除回调
	// disconnectedCallback(){
	// 	console.log('删除咯');
	// }


	constructor(){
		super();

		this[param] = {
			width:0
		};
		this[dom] = null;

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		let dom1 = $('<div>1</div>'),
			slot = $('<slot></slot>');

		this[dom] = dom1;
		dom1.append(slot);

		this.shadow.appendChild(dom1.get(0));
	}

	[refreshParam](){
		let param1 = this[param];

		this[dom].css({
			width:param1.width
		})

	}


	set width(val){
		$(this).attr({width:val});
	}

	get width(){
		return this.param.width;
	}

}


customElements.define('b-cel', bCel );