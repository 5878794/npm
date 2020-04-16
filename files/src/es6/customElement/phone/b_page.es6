
// var doms = $('body').children();
// var body1 = $('<template></template>');
// $('head').append(body1);
// body1.append(doms);
//
// let page111 = $('<b-page></b-page>');
// $('body').append(page111);
//
// page111 = page111.get(0)
//
// var a = async function(){
//  //会自动加载css和非公用js
//  //公共js在setting.js文件中定义
// 	await page111.loadHtml('./login.html');

// 	await page111.loadCss('./css/login.css')
// 	await page111.loadJs('./js/dist/login.min.js')
// 	await page111.loadCss('./css/all.css')
// 	await page111.loadCss('./css/common.css')
//
// }
//
//
// a();







//polyfill 需要
// require('@webcomponents/custom-elements');
// require('@webcomponents/shadydom');

let mFetch = require('../../lib/resLoader/myFetch'),
	tempKey = Symbol('b-page-to-window');

class bPage extends HTMLElement{

	//元素加入页面回调
	connectedCallback() {


	}

	//元素删除回调
	// disconnectedCallback(){
		// if(this.destroy){
		// 	this.destroy();
		// }
	// }

	constructor(){
		super();

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		window[tempKey] = this;

	}


	async loadHtml(src){
		//获取body，head
		let {body,head} = await mFetch.getBodyHtml(src);
		this.shadow.innerHTML = body;

		//解析头部head文件
		head = $(head);
		let scripts = [],
			style = [];

		//获取头部包含的script和style标签
		head.each(function(){
			if(this.nodeName == 'SCRIPT'){
				scripts.push(this.src);
			}else if(this.nodeName == 'LINK'){
				style.push(this.href);
			}
		});

		//加载非公用js
		scripts.map(async rs=>{
			let file_name = rs.substr(rs.lastIndexOf('\/')+1);
			file_name = file_name.split('?')[0];
			if(file_name){
				if(SETTING.publishJS.indexOf(file_name) == -1){
					await this.loadJs(rs);
				}
			}

		});

		//加载所有css
		style.map(async rs=>{
			await this.loadCss(rs);
		});

	}

	async loadJs(src){
		let jsSrc = await mFetch.catchFile(src);
		let script = document.createElement('script');
		script.src = jsSrc;
		this.shadow.appendChild(script);


	}

	async loadCss(src){
		let cssFile = await mFetch.catchFile(src);
		let style = document.createElement('link');
		style.href = cssFile;
		style.type = 'text/css';
		style.rel = 'stylesheet';
		this.shadow.appendChild(style);
	}


	page(str){
		let dom = this.shadow.querySelectorAll(str);
		return $(dom);
	}
}


if(!customElements.get('b-page')){
	customElements.define('b-page', bPage );
}


module.exports = tempKey;
