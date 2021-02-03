
//input控件类的样式设置、事件设置等

module.exports = {
	input_disabled_style:[
		//控件disabled时的样式
		'.input_disabled{' +
		'   background-color: rgb(230,231,232) !important;' +
		'   border-color: rgb(214,213,207) !important;' +
		'}',
		'.input_disabled div{color:#999 !important;}',
		//placeholder 字体颜色
		'::-webkit-input-placeholder { color:#ccc; }',
		':-moz-placeholder { color:#ccc; }',
		'input::-webkit-input-placeholder { color:#ccc; }',
		'input:-moz-placeholder { color:#ccc; }',
		'.add_placeholder{color:#ccc !important;}',
		//字体 textarea单独设置 不能继承body上的字体。。。
		'textarea{font-family: Helvetica,"微软雅黑","宋体" !important;}',
		//input focus 时的颜色   需要在下面默认函数中加这个class
		'.focus_style{border-color:blue !important;}'
	],
	//标题字段宽度
	nameDomWidth:100,
	//行高
	rowHeight:30,

	//公共样式部分-------------------------------------------------
	//行的样式（最外层包裹层）
	rowDomStyle:{

	},
	//表单名字部分样式
	nameDomStyle:{},
	//输入框包裹层样式
	inputBodyDomStyle:{
		border:'1px solid #ccc',
		padding:'0 10px'
	},
	//输入框后单位显示样式
	unitDomStyle:{
		padding:'0 0 0 10px',
		fontSize:'12px'
	},
	//验证表单提示错误的dom的样式
	errorDomStyle:{
		color:'red',
		fontSize:'12px'
	},




	//单独表单控件样式
	inputTextStyle:{
		background:'none',
		border:'none',
		fontSize:'12px'
	},
	inputPasswordStyle:{
		background:'none',
		border:'none',
		fontSize:'12px',
	},
	inputTextareaStyle:{
		lineHeight:'120%',
		background:'none',
		border:'none',
		fontSize:'12px',
	},
	inputSelectStyle:{
		fontSize:'12px'
	},




	//焦点事件  this指向自定义元素
	focusFunction:function(){
		this.inputBodyDom.addClass('focus_style');
	},
	blurFunction:function(){
		this.inputBodyDom.removeClass('focus_style');
	}


};