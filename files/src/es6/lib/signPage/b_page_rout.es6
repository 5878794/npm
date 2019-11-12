

//页面加载
var path = require('path'),
	guid = require('../fn/guid'),
	device = require('../device'),
	tempKey = require('../../customElement/phone/b_page');

//jquery 可以选择shadow-root里面的元素
window.$ = require('./shadowJquery');



let bodyId = guid();

let fn = {
	catchId:[],
	catchPageObj:{},
	//事件监听
	addEvent(){
		let _this = this;
		window.addEventListener("popstate", function() {
			//获取之前的页面id
			let currentState = history.state || {},
				id = currentState.id;

			if(!id){return;}

			_this.handlerEvent(id);
		});
	},
	//处理事件
	handlerEvent(id){
		let ids = this.catchId;
		if(ids.indexOf(id) > -1){
			//返回到打开过的页面
			let delId = ids.pop();

			// restore:id    destroy:nowId
			this.destroyPage(delId);
			this.restorePage(id);


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

	//获取运行的页面名字
	getHtmlName(){
		let url1 = window.location.href;
		url1 = url1.substr(url1.lastIndexOf('\/')+1);
		url1 = url1.split('.')[0];
		url1 = url1 || 'index';
		return url1;
	},
	//保存页面js对象
	savePageObj(obj){
		let url1 = this.getHtmlName();
		this.catchPageObj[url1] = obj;

	},
	//获取及运行js
	getPageObj(){
		let url1 = this.getHtmlName();

		return this.catchPageObj[url1];

	},
	//将方法加载到<b-page>上
	setBPageFn(pageObj,dom){
		dom.pageInit = function(){
			if(pageObj.init){
				pageObj.init();
			}
		};
		dom.pageDestroy = function(){
			if(pageObj.pageDestroy){
				pageObj.pageDestroy();
			}
		};
		dom.pageShow = function(){
			if(pageObj.pageShow){
				pageObj.pageShow();
			}
		};
		dom.pageHide = function(){
			if(pageObj.pageHide){
				pageObj.pageHide();
			}
		};
		dom.pageRefresh = function(){
			if(pageObj.pageRefresh){
				pageObj.pageRefresh();
			}
		}
	},


	//加载及动画
	async loadStart(loadFn,loading,pageId){
		loading.css({width:'90%'});

		await loadFn();

		let dom = document.getElementById(pageId);
		dom.style.display = '';


		let page_obj = this.getPageObj();
		if(page_obj){
			this.setBPageFn(page_obj,dom);
			dom.pageRefresh();
			dom.pageInit();
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
		if(prePage.get(0).pageHide){
			prePage.get(0).pageHide();
		}

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

		if(body.get(0).pageShow){
			body.get(0).pageShow();
		}
	},
	//卸载页面
	destroyPage(id){
		//js卸载
		let dom = $('#'+id);
		if(dom.get(0).pageDestroy){
			dom.get(0).pageDestroy();
		}
		dom.remove();
	},

	//增加历史记录页面
	//初始进入不是首页的时候可以用这个增加历史记录，使其能后退到首页
	addHistory(id,url){
		let nowUrl = window.location.href,
			nowId = history.state.id;
		window.history.replaceState({id:id},'',url);
		window.history.pushState({id:nowId},'',nowUrl);
	}


};


fn.addEvent();




module.exports = {
	startPage:function(url){
		fn.startPage(url);
	},
	openUrl:function(pageUrl,url){
		fn.openUrl(pageUrl,url);
	},
	registerFn:function(obj){
		let dom = window[tempKey];
		if(dom) {
			fn.savePageObj(obj);
			fn.setBPageFn(obj, dom);
			window[tempKey] = null;
		}
	}
};

