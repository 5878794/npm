
var isIe = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/);
var loading = {
	isIe:(isIe)? true : false,
	id:null,
	dom:null,
	isShow:false,
	show:function(){
		if(this.isShow){return;}

		var t = new Date().getTime();
		this.id = 'load'+t;

		var div = $('<div></div>'),
			main = $('<div></div>'),
			text = $('<div>加载中</div>'),
			doms = {
				span1:$('<span></span>'),
				span2:$('<span></span>'),
				span3:$('<span></span>'),
				span4:$('<span></span>'),
				span5:$('<span></span>')
			};

		div.css({
			width:'120px',
			height:'120px',
			paddingTop:'40px',
			position:'absolute',
			background:'#000',
			'border-radius':'10px',
			left: 0,
			top: 0,
			bottom: 0,
			right: 0,
			margin: 'auto'
			// overflow: 'auto'
		});
		text.css({
			textAlign:'center',
			color:'#fff',
			fontSize:'14px',
			paddingTop:'40px'
		})
		main.css({
			width:'50px',
			height:'40px',
			margin:'0 auto'
		})
		var spanCss = {
			display:'inline-block',
			width:'8px',
			height:'100%',
			'border-radius':'4px',
			margin:'0 1px',
			background: '#1d48ff',
			'-webkit-animation':'load'+t+' 1s ease infinite'
		};

		for(var i=1,l=5;i<=l;i++){
			var dom = doms['span'+i],
				delay = (i-1)*0.2;
			dom.css(spanCss).css({
				'-webkit-animation-delay':delay+'s'
			})
		}

		var zz = $('<div></div>');
		zz.css({
			width:'100%',height:'100%',
			position:'fixed',left:0,top:0,
			background:'rgba(0,0,0,0.5)',
			'z-index':'99999'
		});


		if(this.isIe){
			div.append(main).append(text);
			zz.append(div);
		}else{
			this.addStyle();

			main.append(doms.span1)
				.append(doms.span2)
				.append(doms.span3)
				.append(doms.span4)
				.append(doms.span5);
			div.append(main).append(text);
			zz.append(div);
		}


		this.isShow = true;
		this.dom = zz;

		$('body').append(zz);

	},
	addStyle:function(){
		var style = document.createElement('style');
		style.id = this.id;
		style.innerHTML = '@-webkit-keyframes '+this.id+'{' +
			'0%,100%{height: 40px;background: #1d48ff;}' +
			'50%{height: 70px;margin: -15px 1px;background: #ccc;}' +
			'}';
		$('head').append(style);
	},
	hide:function(){
		if(!this.isShow){return;}
		this.isShow = false;
		$('#'+this.id).remove();
		this.dom.remove();

	}
};




export default loading;
