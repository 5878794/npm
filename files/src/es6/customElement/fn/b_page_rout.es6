

//页面加载
var path = require('path'),
	guid = require('../../lib/fn/guid'),
	device = require('../../lib/device');

require('../phone/b_page');

let bodyId = guid();

let fn = {
	catchId:[],
	//事件监听
	addEvent(){
		let _this = this;
		window.addEventListener("popstate", function() {
			//获取之前的页面id
			let currentState = history.state,
				id = currentState.id;

			_this.handlerEvent(id);
		});
	},
	//处理事件
	handlerEvent(id){
		let ids = this.catchId;
		if(ids.indexOf(id) > -1){
			//返回到打开过的页面
			let nowId = ids.pop();

			// restore:id    destroy:nowId
			this.restorePage(id);
			this.destroyPage(nowId);

		}else{
			//前进 打开新的页面
			let nowId = ids[ids.length-1];
			ids.push(id);

			// hidden:nowId   open:id
			this.hiddenPage(nowId);
			this.loadAndShowPage(window.location.href,id)
		}
	},


	//打开页面
	async openUrl(pageUrl,url){
		let ids = this.catchId,
			id = guid(),
			nowId = ids[ids.length-1];
		ids.push(id);

		let openUrl = this.resolveUrl(pageUrl,url);

		history.pushState({id:id},document.title,openUrl);

		//hidden:nowId     open:id
		this.hiddenPage(nowId);
		this.loadAndShowPage(openUrl,id);
	},
	//初始进入初始化
	async startPage(url){
		let ids = this.catchId,
			id = guid();
		ids.push(id);

		history.replaceState({id:id},document.title,url);

		await this.loadAndShowPage(url,id);
	},


	//解析要跳转的url
	resolveUrl(pageUrl,url){
		let newUrl = pageUrl.substr(0,pageUrl.lastIndexOf('\/')+1);
		newUrl = path.join(newUrl,url);
		//path类处理会把//处理成/
		newUrl = newUrl.replace(':\/',':\/\/');

		return newUrl;
	},
	//加载页面
	loadPage(url,id){
		let fileName = url.substr(url.lastIndexOf('\/')+1);
		fileName = fileName.split('.')[0] || 'index';

		let fileUrl = url.replace('\/#','');

		let page = $('<b-page id="'+id+'" style="display:none;"></b-page>').get(0);
		document.body.appendChild(page);

		return async function(){
			await page.loadHtml(fileUrl);
			await page.loadJs('./js/dist/'+fileName+'.min.js?t='+new Date().getTime());
			// await page.loadCss('./css/all.css');
			// await page.loadCss('./css/common.css');
			// await page.loadCss('./css/'+fileName+'.css');
			console.log('signer page load ok')
		};
	},
	//创建loading元素
	createLoading(){
		let loading = $('<div></div>');
		loading.css({
			width:'0',
			height:'2px',
			position:'fixed',
			left:0,top:0,'z-index':100000,
			background:'#4ea1cd',
			transition: 'all 2s linear'
		});
		$('body').append(loading);

		return loading;
	},
	//加载及动画
	async loadStart(loadFn,loading,pageId){
		loading.css({width:'90%'});

		await loadFn();

		document.getElementById(pageId).style.display = '';

		let url1 = window.location.href;
		url1 = url1.substr(url1.lastIndexOf('\/')+1);
		url1 = url1.split('.')[0];
		url1 = url1 || 'index';
		if(!window.appPage){window.appPage = {}}
		if(window.appPage[url1]){
			window.appPage[url1]();
		}

		loading.css({
			transition: 'all 0.2s linear',
			width:'100%'
		});

		await device.sleep(0.2);

		loading.css({
			transition: 'all 0.2s linear',
			opacity:0
		});

		await device.sleep(0.2);
		loading.remove();
	},



	//移除前一页  放到head中
	hiddenPage(id){
		let head = $('head'),
			body = head.find('#'+bodyId);
		if(body.length == 0){
			body = $('<template id="'+bodyId+'"></template>');
			head.append(body);
		}

		let prePage = $('#'+id);
		body = body.get(0).content;
		body = $(body);
		body.append(prePage);
	},
	//加载并显示页面
	async loadAndShowPage(url,id){
		let loadFn = this.loadPage(url,id);
		let loading = this.createLoading();

		await this.loadStart(loadFn,loading,id);

	},
	//恢复页面显示
	restorePage(id){
		let body = $('#'+bodyId);
		body = body.get(0).content;
		body = $(body).find('#'+id);


		$('body').append(body);



	},
	//卸载页面
	destroyPage(id){
		//TODO
		//js卸载

		$('#'+id).remove();
	}
};


fn.addEvent();

module.exports = fn;

