require("../jq/extend");


var css = {
	'*':{
		margin:0,
		padding:0,
		'-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
		'-webkit-touch-callout': 'none'
	},
	'div, p, span, a, ul, li,img':{
		'-webkit-user-select':'none',
		'-ms-user-select':'none',
		'-moz-user-select':'none',
		'-webkit-text-size-adjust': 'none'
	},
	'div, p, span, a, ul, li, input, textarea':{
		'-webkit-box-sizing': 'border-box',
		'-moz-box-sizing': 'border-box',
		'box-sizing': 'border-box'
	},
	'img':{
		border:'none'
	},
	'input,button,select,textarea':{
		outline:'none',
		border:'none'
	},
	'input::-webkit-input-placeholder':{
		color:'#ccc'
	},
	'input:-moz-placeholder':{
		color:'#ccc'
	},
	'body':{
		'font-family': '"微软雅黑", Arial, "宋体"',
		'min-width': '320px'
	},
	'a:link,a:visited':{
		'text-decoration': 'none'
	},
	'a:hover':{
		'text-decoration': 'none'
	},
	'.backhidden':{
		'backface-visibility': 'hidden',
		'-webkit-backface-visibility': 'hidden',
		'-ms-backface-visibility': 'hidden',
		'transform-style': 'preserve-3d',
		'-webkit-transform-style': 'preserve-3d'
	},
	'.border_box':{
		'box-sizing': 'border-box',
		'-webkit-box-sizing': 'border-box',
		'-moz-box-sizing': 'border-box'
	},
	'.radius':{
		'border-radius':'5rem',
		'-webkit-border-radius': '5rem',
		'-moz-border-radius': '5rem',
		'-o-border-radius':'5rem',
		'-ms-border-radius':'5rem'
	},
	'.position_center':{
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		margin: 'auto',
		overflow: 'auto'
	},
	'.diandian':{
		'text-overflow':'ellipsis',
		'white-space':'nowrap',
		'overflow':'hidden'
	},
	'.diandian2':{
		'overflow':'hidden',
		'text-overflow': 'ellipsis',
		'display': '-webkit-box',
		'-webkit-line-clamp': '2',
		'-webkit-box-orient': 'vertical'
	},
	'.diandian3':{
		'overflow': 'hidden',
		'text-overflow': 'ellipsis',
		'display': '-webkit-box',
		'-webkit-line-clamp':'3',
		'-webkit-box-orient':'vertical'
	},
	'.breakall':{
		'word-wrap':'break-word',
		'word-break':'break-all'
	},
	'.notbreak':{
		'white-space':'nowrap'
	},
	'.boxflex1':{
		'-webkit-flex':'1 1 0% !important',
		'flex':'1 1 0% !important'
	},
	'.boxflex2':{
		'-webkit-flex':'2 1 0% !important',
		'flex':'2 1 0% !important'
	},

	'.box_slt':{
		'display':['-webkit-flex','flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'column',
		'align-items':'flex-start',
		'justify-content':'flex-start'
	},
	'.box_slc':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'center',
		'flex-direction':'column',
		'align-items':'flex-start',
		'justify-content':'center'
	},
	'.box_slb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'column',
		'align-items':'flex-start',
		'justify-content':'flex-end'
	},
	'.box_sct':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'column',
		'align-items':'center',
		'justify-content':'flex-start'
	},
	'.box_scc':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'center',
		'flex-direction':'column',
		'align-items':'center',
		'justify-content':'center'
	},
	'.box_scb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'column',
		'align-items':'center',
		'justify-content':'flex-end'
	},
	'.box_srt':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'column',
		'align-items':'flex-end',
		'justify-content':'flex-start'
	},
	'.box_src':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'center',
		'flex-direction':'column',
		'align-items':'flex-end',
		'justify-content':'center'
	},
	'.box_srb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'column',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'column',
		'align-items':'flex-end',
		'justify-content':'flex-end'
	},
	'.box_hlt':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'row',
		'align-items':'flex-start',
		'justify-content':'flex-start'
	},
	'.box_hlc':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'row',
		'align-items':'center',
		'justify-content':'flex-start'
	},
	'.box_hlb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'flex-start',
		'flex-direction':'row',
		'align-items':'flex-end',
		'justify-content':'flex-start'
	},
	'.box_hct':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'center',
		'flex-direction':'row',
		'align-items':'flex-start',
		'justify-content':'center'
	},
	'.box_hcc':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'center',
		'flex-direction':'row',
		'align-items':'center',
		'justify-content':'center'
	},
	'.box_hcb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'center',
		'flex-direction':'row',
		'align-items':'flex-end',
		'justify-content':'center'
	},
	'.box_hrt':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-start',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'row',
		'align-items':'flex-start',
		'justify-content':'flex-end'
	},
	'.box_hrc':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'center',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'row',
		'align-items':'center',
		'justify-content':'flex-end'
	},
	'.box_hrb':{
		display: ['flex','-webkit-flex'],
		'-webkit-flex-direction':'row',
		'-webkit-align-items':'flex-end',
		'-webkit-justify-content':'flex-end',
		'flex-direction':'row',
		'align-items':'flex-end',
		'justify-content':'flex-end'
	},
	'.box_lines':{
		'-webkit-flex-wrap':'wrap',
		'flex-wrap':'wrap'
	},
	'.box_slb > *, .box_sct > *, .box_scc > *, .box_scb > *, .box_srt > *, .box_src > *, .box_srb > *, .box_hlt > *, .box_hlc > *, .box_hlb > *, .box_hct > *, .box_hcc > *, .box_hcb > *, .box_hrt > *, .box_hrc > *, .box_hrb > *':{
		flex:'0 0 auto'
	},


	'.hidden':{
		display: 'none'
	},

	'.gray':{
		'-webkit-filter':'grayscale(100%)',
		'-moz-filter': 'grayscale(100%)',
		'-ms-filter': 'grayscale(100%)',
		'-o-filter': 'grayscale(100%)',
		'filter': ['grayscale(100%)','gray']
	},
	'.clear':{
		'clear': 'both'
	},
	'.hover_animate':{
		'-webkit-transition': 'all .2s linear',
		'-moz-transition': 'all .2s linear',
		'-ms-transition': 'all .2s linear',
		'-o-transition': 'all .2s linear',
		'transition': 'all .2s linear'
	},
	'.hover_animate1':{
		'-webkit-transition': 'all 0.4s ease-out',
		'-moz-transition': 'all 0.4s ease-out',
		'-ms-transition': 'all 0.4s ease-out',
		'-o-transition': 'all 0.4s ease-out',
		'transition': 'all 0.4s ease-out'
	},
	'scroll_x':{
		'overflow-y': 'hidden',
		'overflow-x': 'auto',
		'-webkit-overflow-scrolling': 'touch',
		'padding-bottom': '0.2rem'
	},
	'.scroll_x::-webkit-scrollbar':{
		display: 'none'
	},
	'.scroll_y':{
		'overflow-x': 'hidden',
		'overflow-y': 'auto',
		'-webkit-overflow-scrolling': 'touch',
		'padding-right': '0.2rem'
	},
	'.scroll_y::-webkit-scrollbar':{
		display: 'none'
	},
	'.scroll_xy':{
		overflow: 'auto',
		'-webkit-overflow-scrolling': 'touch',
		'padding-bottom': '0.2rem',
		'padding-right': '0.2rem'
	},
	'.scroll_xy::-webkit-scrollbar':{
		display: 'none'
	}







};








//json对象转 css样式文本
var jsonToCss = function(obj){
	let text = "";
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			let this_obj = obj[key];
			text += key+"{";
			for(var key1 in this_obj){
				if(this_obj.hasOwnProperty(key1)){
					let val = this_obj[key1];
					if($.isArray(val)){
						for(var i=0,l=val.length;i<l;i++){
							text += key1 + ":" + val[i] + ";";
						}
					}else{
						text += key1+":"+this_obj[key1]+";";
					}
				}
			}
			text += "}"
		}
	}
	return text;
};


//json对象转 css样式文本
var cssHtml = jsonToCss(css);


//创建style元素
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = cssHtml;

//style插入到title元素到后面
var title = document.getElementsByTagName('title')[0];
document.head.insertBefore(style,title.nextSibling);


module.exports = null;