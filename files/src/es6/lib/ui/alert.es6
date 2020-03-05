//alert 和  confirm 效果


let device = require('../device'),
	$$ = require('../event/$$'),
	r2p = function(val){
		return device.rem2Px(750,val/100);
	};
require('../jq/extend');
require('../jq/cssAnimate');


module.exports = function(isAlert,msg,titleMsg='系统提示',iconSrc,width=0,height=0){
	return new Promise(success=>{
		let mainDom,bodyDom,btnDom,cancelDom;
		let createDiv = function(){
			let main = $('<div class="box_scc"></div>'),
				body = $('<div class="box_sct"></div>'),
				icon = $('<div></div>'),
				title = $('<div>'+titleMsg+'</div>'),
				text = $('<div>'+msg+'</div>'),
				btns = $('<div class="box_hct"></div>'),
				cancel = $('<div>取消</div>'),
				btn = $('<div>确定</div>');

			main.css({
				position:'fixed',
				left:0,top:0,width:'100%',height:'100%',
				background:'rgba(0,0,0,0)',
				'z-index':'199999'
			});
			body.css({
				width:r2p(580)+'px',
				'min-height':r2p(380)+'px',
				background:'#fff',
				'border-radius':r2p(20)+'px',
				padding:0 +' '+r2p(50)+'px'
			});
			icon.css({
				'margin-top':'0.3rem',
				width:r2p(width)+'px',
				height:r2p(height)+'px',
				background:'url('+iconSrc+') no-repeat center center',
				'background-size':r2p(width)+'px '+r2p(height)+'px'
			});
			title.css({
				'font-size':'0.36rem',
				width:'100%',
				padding:'0.2rem 0',
				'font-weight':'bold',
				'text-align':'center',
				'border-bottom':'0.01rem dashed #ccc'
			});
			text.css({
				'margin-top':r2p(45)+'px',
				'margin-bottom':r2p(50)+'px',
				'min-height':r2p(100)+'px',
				'font-size':r2p(36)+'px',
				color:'#000'
			});
			btns.css({
				width:'100%',
				height:r2p(130)+'px'
			});
			btn.css({
				width:r2p(140)+'px',
				height:r2p(65)+'px',
				'line-height':r2p(65)+'px',
				color:'#fff',
				'font-size':r2p(32)+'px',
				'text-align':'center',
				'border-radius':r2p(65)+'px',
				// 'margin-bottom':r2p(66)+'px',
				'margin':'0 '+r2p(30)+'px',
				// background: 'linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))',
				// background: '-webkit-linear-gradient(0deg,rgb(0,206,153),rgb(0,182,158))'
				background:'#4854ef'
			});
			cancel.css({
				width:r2p(140)+'px',
				height:r2p(65)+'px',
				'margin':'0 '+r2p(30)+'px',
				'line-height':r2p(65)+'px',
				color:'#4854ef',
				'font-size':r2p(32)+'px',
				'text-align':'center',
				'border-radius':r2p(65)+'px',
				border:'0.01rem solid #4854ef',
				'box-sizing':'border-box',
				background:'#fff'
			});


			if(!iconSrc){
				icon.css({display:'none',background:'none'});
			}
			if(isAlert){
				cancel.css({display:'none'});
			}

			btns.append(cancel).append(btn);
			body.append(icon).append(title).append(text).append(btns);
			main.append(body);

			mainDom = main;
			bodyDom = body;
			btnDom = btn;
			cancelDom = cancel;
		};
		let addEvent = function(){
			$$(btnDom).myclickok(function(){
				destroy(true);
			});
			$$(cancelDom).myclickok(function(){
				destroy(false);
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
		let destroy = async function(state){
			await device.sleep(0.2);
			$$(btnDom).unbind(true);
			mainDom.remove();
			success(state);
		};

		createDiv();
		addEvent();
		show();
	});
};