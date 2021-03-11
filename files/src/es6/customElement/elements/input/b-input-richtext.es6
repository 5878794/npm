
// npm i wangeditor --save
// 文档 https://doc.wangeditor.com/

//同 b-input-text
// 插入的代码样式高亮关键字  需要单独在引入插件  见：https://doc.wangeditor.com/pages/03-%E9%85%8D%E7%BD%AE%E8%8F%9C%E5%8D%95/07-%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.html

//添加  @attr：height    富文本的高度
//      @attr:imageUpload  图片是否上传，没有属性上传图片会转换成base64
//                                     有该属性需要配置上传函数
//      @param set:dom.uploadFn = async function(files){
//          //传入file对象
//          //上传完后需要返回图片路径
//          return ['',''];
//      }

//添加  @param get: dom.text;  //获取存文本内容
//     @param get: dom.value   //获取富文本内容
//     @param set:  dom.value  //设置富文本内容

//      @param:fn:  dom.clear() //清空富文本内容


let publishInput = require('./_input-all'),
	guid = require('../../../lib/fn/guid'),
	wangeditor = require('wangeditor');

let menu = [
	'head',             //标题
	'bold',             //字体粗细
	'fontSize',         //字号
	'fontName',         //字体
	'italic',           //斜体
	'underline',        //下划线
	'strikeThrough',    //删除线
	'indent',           //字体缩进
	'lineHeight',       //字体行高
	'foreColor',        //字体颜色
	'backColor',        //背景颜色
	'link',             //链接
	'list',             //列表
	'todo',             //单选框
	'justify',          //对齐方式
	'quote',            //引用
	// 'emoticon',         //表情
	'image',            //图片
	// 'video',            //视频   在线的
	'table',            //表格
	// 'code',             //代码
	'splitLine',        //分割线
	'undo',             //撤销
	'redo'              //重做
];


class bInputRichText extends publishInput{
	constructor() {
		super();

		this.useUploadImage = this.hasAttribute('imageUpload');
		this.uploadFunction = function(){};
		this.editor = null;
		this.unitDom.remove();
		this.createSlot();
		this.createInput();
		this.initRichText();
		this.addEvent();

		this.value = this.setValue;
	}

	//由于插件需要使用id  所以需要使用slot包裹
	createSlot(){
		let slot = $('<slot></slot>');
		this.slot = slot;
		this.inputBodyDom.append(slot);
		this.inputBodyDom.css({
			padding:0,
			background:0
		})
	}

	//创建textarea
	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '',
			id = 'bens'+guid();
		this.guid = id;

		let input =  $(`<div id="${id}"  class="__input__" data-rule="${rule}"></div>`);
		input.css({
			width:'100%'
		})



		$(this).append(input);
		this.inputDom = input;

	}

	//应用插件
	initRichText(){
		let height = $(this).attr('height') || this.userStyle.rowHeight*5,
			_this = this;

		this.editor = new wangeditor('#'+this.guid);
		//设置高度
		this.editor.config.height = height;
		//placeholder
		this.editor.config.placeholder = this.placeholder;
		//配置编辑器菜单
		this.editor.config.menus = menu;

		//图片上传大小
		this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
		//图片上传类型
		this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

		//不上传图片 使用base64
		if(this.useUploadImage){
			this.editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
				// resultFiles 是 input 中选中的文件列表
				// insertImgFn 是获取图片 url 后，插入到编辑器的方法
				let backData = await _this.uploadFunction(resultFiles);
				// 上传图片，返回结果，将图片插入到编辑器中
				// insertImgFn(imgUrl)
				backData.map(rs=>{
					insertImgFn(rs);
				});
			}
		}else{
			this.editor.config.uploadImgShowBase64 = true;
		}

		this.editor.create();

		//去除富文本自带的边框
		$('#'+this.guid).children().each(function(i){
			if(i==0){
				$(this).css({
					border:'none',
					borderBottom:'1px solid #ccc',
					zIndex:100
				})
			}else{
				$(this).css({
					border:'none',
					zIndex:99
				})
			}
		});
	}

	addEvent(){
		let _this = this;
		this.editor.config.onchange = function (newHtml) {
			_this.changeFunction.call(_this,newHtml);
		}

		this.editor.config.onblur = function (newHtml) {
			_this.blurFunction.call(_this,newHtml);
		}

		this.editor.config.onfocus = function (newHtml) {
			_this.focusFunction.call(_this,newHtml);
		}

	}

	set value(val){
		this.editor.txt.html(val);
	}
	get value(){
		return this.editor.txt.html();
	}

	get text(){
		return this.editor.txt.text()
	}

	clear(){
		this.editor.txt.clear()
	}

	set disabled(state){
		if(state){
			this.editor.disable();
			$('#'+this.guid).children().eq(0).addClass('hidden');
		}else{
			this.editor.enable();
			$('#'+this.guid).children().eq(0).removeClass('hidden');
		}
	}

	//自定义上传函数  async函数
	set uploadFn(fn){
		fn = fn || function(){};
		this.uploadFunction = fn;
	}

}


if(!customElements.get('b-input-rich-text')){
	customElements.define('b-input-rich-text', bInputRichText );
}



