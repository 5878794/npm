//ios alert效果


let device = require('../device'),
	$$ = require('../event/$$'),
	r2p = function(val){
		return device.rem2Px(750,val/100);
	};
require('../jq/extend');
require('../jq/cssAnimate');


module.exports = function(msg,callback,cancel,viewPort=750){
	callback = callback || function(){};
	cancel = cancel || function(){};

	let mainDom,bodyDom,btnDom,btnCancel;
	let createDiv = function(){
		let main = $('<div class="box_scc"></div>'),
			body = $('<div class="box_sct"></div>'),
			text = $('<div>'+msg+'</div>'),
			btnDiv = $('<div class="box_hcc"></div>'),
			btn = $('<div>确定</div>'),
			btn1 = $('<div>取消</div>');

		main.css({
			position:'fixed',
			left:0,top:0,width:'100%',height:'100%',
			background:'rgba(0,0,0,0)',
			'z-index':'99999'
		});
		body.css({
			width:r2p(580)+'px',
			'min-height':r2p(380)+'px',
			background:'#fff',
			'border-radius':r2p(20)+'px',
			padding:0 +' '+r2p(50)+'px'
		});
		text.css({
			'margin-top':r2p(90)+'px',
			'margin-bottom':r2p(50)+'px',
			'min-height':r2p(100)+'px',
			'font-size':r2p(36)+'px',
			color:'#000'
		});
		btnDiv.css({
			width:'100%',
			height:r2p(130)+'px',
			'padding-bottom':r2p(45)+'px'
		});
		btn.css({
			width:r2p(200)+'px',
			height:r2p(80)+'px',
			'line-height':r2p(80)+'px',
			color:'#fff',
			'font-size':r2p(32)+'px',
			'text-align':'center',
			'border-radius':r2p(80)+'px',
			'margin':'0 '+r2p(20)+'px',
			// background: 'linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))',
			background: '-webkit-linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))'
		});
		btn1.css({
			width:r2p(200)+'px',
			height:r2p(80)+'px',
			'line-height':r2p(80)+'px',
			color:'#fff',
			'font-size':r2p(32)+'px',
			'text-align':'center',
			'border-radius':r2p(80)+'px',
			'margin':'0 '+r2p(20)+'px',
			// background: 'linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))',
			background: '-webkit-linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))'
		});

		btnDiv.append(btn1).append(btn);
		body.append(text).append(btnDiv);
		main.append(body);

		mainDom = main;
		bodyDom = body;
		btnDom = btn;
		btnCancel = btn1;
	};
	let addEvent = function(){
		$$(btnDom).myclickok(function(){
			destroy();
			callback();
		});

		$$(btnCancel).myclickok(function(){
			destroy();
			cancel();
		});
	};
	let show = function(){
		bodyDom.css({
			transform:'scale(0.2)'
		});
		$('body').append(mainDom);
		mainDom.cssAnimate({
			background:'rgba(0,0,0,0.5)'
		},300);
		bodyDom.cssAnimate({
			transform:'scale(1.1)'
		},300,function(){
			bodyDom.cssAnimate({
				transform:'scale(1)'
			},100);
		})

	};
	let destroy = function(){
		$$(btnDom).unbind(true);
		mainDom.remove();
	};

	createDiv();
	addEvent();
	show();
};