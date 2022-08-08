

//test123
let loading = require('./lib/ui/loading_css'),
	page = require('./lib/page');




let fn = {
	showLoadingRun(obj,fn,notNeedLoading,param){
		if(!notNeedLoading){
			loading.show();
		}
		obj[fn].call(obj,param).then(()=>{
			if(!notNeedLoading){
				loading.hide();
			}
		}).catch(e=>{
			if(!notNeedLoading){
				loading.hide();
			}
			page.alert(e);
		})
	},
	//所有公共需要执行的
	publishRun(){
		this.navScrollEventHandler();
		this.showSmallAppQRCodeEventHandler();
		this.rightBtnsEventHandler();
	},
	//滚动条滚动 顶部变色
	navScrollEventHandler(){
		let fn = function(){
			let scrollTop = $(window).scrollTop();
			if(scrollTop>0){
				$('header').css({
					background:'rgba(0,0,0,1)'
				})
			}else{
				$('header').css({
					background:'rgba(0,0,0,0)'
				})
			}
		};
		$(window).scroll(function(e){
			fn();
		})
		fn();
	},
	//显示小程序二维码
	showSmallAppQRCodeEventHandler(){
		let btm = $('header').find('.ma2'),
			qrCode = $('#top_min_program_img');

		btm.hover(function(){
			qrCode.css({display:'block'});
		},function(){
			qrCode.css({display:'none'});
		})
	},
	//右侧按钮事件
	rightBtnsEventHandler(){
		let btn1 = $('#goTopBtn1');
		btn1.click(function(){
			console.log(123)
			window.location.href = $(this).data('url');
		});

		let topBtn = $('#goTopBtn3');
		topBtn.click(function(){
			$("html,body").animate({
				scrollTop: 0
			}, 500);
		})
	}


};




module.exports = fn;
