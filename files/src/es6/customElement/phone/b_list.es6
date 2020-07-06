

//==========================================================
//列表  单向数据绑定
//==========================================================


//标签上可以加 css属性 加载内部用的css文件 只能1个
//会自动加载css文件夹中的all.css
//需要注意输出的js文件位置，有可能会被提取到公共位置

// <b-list class="box_hcc" id="aa" css="../../css/common.css">
// 	<template>      //必须有这层
// 	    <div class="aavv" id="${rs.id}">
		// 	<div class="dddd box_scc">
			// 	<p>${rs.name}</p>
			// 	<p>${rs.title}</p>
		// 	</div>
	// 	</div>
// 	</template>
// </b-list>


//js。。。。。。。。。。

// let list = $('b-list').get(0);
// 绑定数据 （单向绑定）
// list.data = [
// 	{id:1,name:'aa',title:'aaTitle'},
// 	{id:2,name:'bb',title:'bbTitle'},
// 	{id:3,name:'cc',title:'ccTitle'},
// 	{id:4,name:'dd',title:'ddTitle'}
// ];

//事件 带的$$事件
// list.$$('.dddd').myclickok(function(){
// 	info.show($(this).text());
// });
//
// list.$$('.dddd').unbind(true);
//
//
// list.data = [
// 	{id:1,name:'ee',title:'aaTitle'},
// 	{id:2,name:'ff',title:'bbTitle'},
// 	{id:3,name:'gg',title:'ccTitle'},
// 	{id:4,name:'hh',title:'ddTitle'}
// ];
//
//
//  添加数据，不删除原来的列表 （单向绑定）
// list.addData = [
// 	{id:1,name:'ii',title:'aaTitle'},
// 	{id:2,name:'jj',title:'bbTitle'},
// 	{id:3,name:'kk',title:'ccTitle'},
// 	{id:4,name:'ll',title:'ddTitle'}
// ]


//  list.find('.aaa')  //返回jq对象




let addStyleFile = require('../fn/addStyleFile'),
	$$ = require('../../lib/event/$$');
//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');


let slotDom = Symbol(),
	createMainDom = Symbol('init'),
	createList = Symbol(),
	clearList = Symbol();







class bList extends HTMLElement{
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
		this[createMainDom]();

		this.shadow.appendChild(this[slotDom].get(0));
	}

	[createMainDom](){
		this[slotDom] = $('<slot></slot>');
	}

	set data(data){
		this[clearList]();
		this[createList](data);
	}

	set addData(data){
		this[createList](data);
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

	[createList](data){
		let item = this.shadowRoot.querySelector('slot').assignedElements();
		item = item[0].content.children;
		let html = '';
		for(let i=0,l=item.length;i<l;i++){
			html += item[i].outerHTML;
		}
		item = html;
		item = 'return '+'`'+item+'`';
		let func = new Function('rs',item);

		data.map(rs=>{
			let item_ = func(rs);
			item_ = $(item_).get(0);
			this.shadow.appendChild(item_);
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



if(!customElements.get('b-list')){
	customElements.define('b-list', bList );
}
