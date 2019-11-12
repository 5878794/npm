
//单独的一个入口 需要挂载到html上


let loadPage = require('./b_page_rout');

let signPage = {
	init(){
		let url = window.location.href,
			isSignPage = (url.indexOf('\/#\/') > -1);

		//判断是否是单页面请求方式
		if(isSignPage){
			this.hidePage();
			// this.addWebpackInitFn();
			this.clearCss();
			this.clearBodyHtml();
			this.showPage();
			this.loadPage();
		}else{
			this.reWriteFn();
		}

	},
	//隐藏html元素
	hidePage(){
		var page = document.getElementsByTagName('html')[0];
		page.style.visibility = 'hidden';
	},
	//
	addWebpackInitFn(){
		// let src = './js/dist/sign_page_run.min.js?t='+new Date().getTime();
		// $.getScript(src);
	},
	//清除除all.css外的所有css
	clearCss(){
		let links = $('link');
		links.each(function(){
			if($(this).attr('href').indexOf('all.css') == -1 ){
				$(this).remove();
			}
		});
	},
	//清除body内的html
	clearBodyHtml(){
		document.body.innerHTML = '';
		// document.body.style.display = '';
	},
	//显示html元素
	showPage(){
		let page = document.getElementsByTagName('html')[0];
		page.style.visibility = 'visible';
	},
	//加载页面
	loadPage(){
		loadPage.startPage(window.location.href);
	},
	//多页面模式 加载本身的js
	reWriteFn(){
		$('script').each(function(){
			var src = $(this).data('src');
			if(src){
				$.getScript(src);
			}
		});
	}
};








$(document).ready(function(){
	signPage.init();
});