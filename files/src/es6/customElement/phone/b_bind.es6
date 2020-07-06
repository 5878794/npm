

//==========================================================
//容器  单向数据绑定
//==========================================================


//标签上可以加 css属性 加载内部用的css文件 只能1个
//会自动加载css文件夹中的all.css
//需要注意输出的js文件位置，有可能会被提取到公共位置

// html-------------------------

// <b-bind id="a2" css="../../css/common.css">
// 	<template>      //必须有该元素
	// 	<div class="box_hcc">
		// 	<p>${rs.title1}</p>
		// 	<p>${rs.time1}</p>
	// 	</div>
	// 	<div class="box_scc">
		// 	<p>${rs.title1}</p>
		// 	<p>${rs.time1}</p>
	// 	</div>
// 	</template>
// </b-bind>



// js-------------------------
// let bd1 = $('#a1').get(0);
// bd1.data = {
// 	title:'testTitle',
// 	time:'2011-11-11'
// };
// bd1.$$('p').myclickok(function(){
// 	console.log($(this).text())
// });
//  bd1.find('p')  //返回jq对象






let addStyleFile = require('../fn/addStyleFile'),
	$$ = require('../../lib/event/$$');
//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let bindData = Symbol(),
	clearList = Symbol(),
	slotDom = Symbol();







class bBind extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {
		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

		let cssFilePath = $(this).attr('css'),
			cssFile = addStyleFile(cssFilePath);

		this.shadow.appendChild(cssFile);

	}

	constructor(){
		super();

		this[slotDom] = null;

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});
		this[slotDom] = $('<slot></slot>');
		this.shadow.appendChild(this[slotDom].get(0));

	}

	set data(data){
		this[clearList]();
		this[bindData](data);
	}


	[clearList](){
		// this[listDom].html('');

		let child = this.shadow.childNodes,
			l = child.length,
			del = [];

		for(let i=0;i<l;i++){
			let thisItem = child[i];

			if(
				thisItem.nodeName.toLowerCase() == 'link' ||
				thisItem.nodeName.toLowerCase() == 'slot' ||
				thisItem.nodeName.toLowerCase() == 'template'
			){

			}else{
				del.push(thisItem);
			}
		}

		del.map(rs=>{
			this.shadow.removeChild(rs);
		});
	}

	[bindData](data){
		let item = this.shadowRoot.querySelector('slot').assignedElements();
			item = item[0].content.children;
		let html = '';

		for(let i=0,l=item.length;i<l;i++){
			html += item[i].outerHTML;
		}

		let fun = new Function('rs','return `'+html+'`');
		html = fun(data);

		let dom = $(html),
			_this = this;
		dom.each(function(){
			_this.shadow.appendChild(this);
		});
	}

	$$(str){
		let dom = this.shadow.querySelectorAll(str);
		dom = $(dom);
		return $$(dom);
	}

	find(str){
		let dom = this.shadow.querySelectorAll(str);
		return $(dom);
	}




}



if(!customElements.get('b-bind')){
	customElements.define('b-bind', bBind );
}


