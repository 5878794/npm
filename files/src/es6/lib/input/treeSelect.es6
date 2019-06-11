// 树形菜单级联    多选
// 数据查看 ../code/temp_TreeCode.js

//eg:
//new treeDom({
// 	    dom:document.body,      //容器
// 		data:treeData,          //数据
//});



let $$ = require('../event/$$'),
	handleData = Symbol(),
	createDom = Symbol(),
	createItem = Symbol(),
	checkParentIsExist = Symbol(),
	clearLastLayerArrow = Symbol(),
	addEvent = Symbol(),
	createCloneDom = Symbol(),
	closeAllTree = Symbol();

let arrowImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABVUlEQVRYR+2Vv0rDUBTGvxMFR1NfwCniU7g4uTioiCAuVoSknXwRlyZBUBcRRNShj+BjNOIrJOLa5iu3mFJK2tykgTjcTBnOPd/v/E7+CBq+pOF8GABjwBgwBoyB/2nA7n1vWzK8pchWHf8KAlGyMbpBe/d3vl+ugVYwuBPIdR3hWQ8Cfuw5XU2ArwMw7YvIeh0QJIck9pPuzqcWgCqyg+hQyPdVISbhIseJ5/Tzhln6EE4ggA8B1qqYIDAicLQoXPUsfAs2/ejEEryUhVDhKXH203HelsEXAqjDfxCvogGs6gkwJU6LwrUMZPQtPzqH4KkIQoWDuIg7zrPO2rQMZI3sMLoU4n4RRNnwUgZmISziYX46FU7BVeI6jzqTZzWlDEzXEUauEMFsUCpolw2vZCAPggIvdp2wzOQrGZiuozfYU/d5XzhdmEor0G2uU2cAjIHGDYwBh8hvIXuOOLoAAAAASUVORK5CYII=';

class treeSelect{
	constructor(opt){
		this.dom = opt.dom || document.body;
		this.data = opt.data || [];

		this.listPaddingLeft = '0.36rem';
		this.fontSize = '0.24rem';
		this.paddingTop = '0.07rem';

		this.codes = {};
		this.listDom = null;

		this[createCloneDom]();
		this[handleData]();
		this[createDom]();
		this[clearLastLayerArrow]();
		this[closeAllTree]();
		this[addEvent]();
	}

	//数据处理排序
	//根据数据
	[handleData](){
		//数据code parent 转字符串  并记录存在的code
		this.data = this.data.map(rs=>{
			rs.parent = (rs.parent)? rs.parent.toString() : '0';
			rs.code = rs.code.toString();
			this.codes[rs.code] = rs;
			return rs;
		});
		//以parent（父级id）属性排序
		// this.data = this.data.sort(function(a,b){
		// 	a.parent = (a.parent)? a.parent : '0';
		// 	b.parent = (b.parent)? b.parent : '0';
		// 	return a.parent.localeCompare(b.parent);
		// })
	}

	[createCloneDom](){
		let main = $('<div></div>'),
			div = $('<a></a>'),
			img = $('<img src="'+arrowImage+'"/>'),
			children = $('<p></p>');

		div.css({
			display:'block',
			position:'relative',
			'padding-left':this.listPaddingLeft,
			'line-height':this.fontSize,
			'font-size':this.fontSize,
			'padding-bottom':this.paddingTop,
			'padding-top':this.paddingTop
		});
		children.css({'padding-left':this.listPaddingLeft,margin:0});
		img.css({
			position:'absolute',
			display:'block',
			left:0,
			top:this.paddingTop,
			width:this.fontSize,
			height:this.fontSize,
			transform:'rotate(-90deg)'
		}).addClass('hover_animate1');

		div.append(img).append('<span></span>');
		main.append(div).append(children);

		this.listDom = main;
	}

	//检查父级id是否存在并可以到跟节点
	[checkParentIsExist](code){
		let _this = this;
		let checkFn = function(parentId){
			if(_this.codes[parentId]){
				if(_this.codes[parentId].parent == '0'){
					return true;
				}else{
					return checkFn(_this.codes[parentId].parent);
				}
			}else{
				return false;
			}
		};

		return checkFn(this.codes[code].parent);
	}


	//生成dom
	[createDom](){
		this.dom.style.display = 'none';
		let data = JSON.parse(JSON.stringify(this.data));

		for(let i=0;i<data.length;i++){
			let rs = data[i];
			if(rs.parent == '0'){
				this[createItem](rs,this.dom);
			}else{
				let parentId = 'id'+rs.parent,
					body = document.getElementById(parentId);

				if(body){
					//父级存在直接添加
					this[createItem](rs,body);
				}else{
					//父级不存在 放到数组后面
					//循环用的数组的动态长度

					// 判断是否真的有父级的id存在 避免死循环
					if(this[checkParentIsExist](rs.code)){
						data.push(rs);
					}
				}
			}
		}

		this.dom.style.display = 'block';
		// this.data.map(rs=>{
		// 	if(rs.parent == '0'){
		// 		this[createItem](rs,this.dom);
		// 	}else{
		// 		let parentId = 'id'+rs.parent,
		// 			body = document.getElementById(parentId);
		// 		this[createItem](rs,body);
		// 	}
		// });
	}

	//生成列表元素
	[createItem](data,body){
		body = $(body);
		let bodyText = (body.attr('text'))? body.attr('text') : '';
		bodyText = (bodyText)? bodyText+'$$$$'+data.name : data.name;

		let thisDom = this.listDom.clone();
		thisDom.find('a').attr({
			code:data.code,
			text:data.name,
			desc:data.desc
		}).find('span').text(data.name);
		thisDom.find('p').attr({
			text:bodyText,
			id:'id'+data.code
		});
		body.append(thisDom);


		// let main = $('<div></div>'),
		// 	div = $('<a code="'+data.code+'" text="'+data.name+'">'+data.name+'</a>'),
		// 	img = $('<img src="'+arrowImage+'"/>'),
		// 	children = $('<p text="'+bodyText+'" id="id'+data.code+'"></p>');
		//
		// div.css({
		// 	display:'block',
		// 	position:'relative',
		// 	'padding-left':this.listPaddingLeft,
		// 	'line-height':this.fontSize,
		// 	'font-size':this.fontSize,
		// 	'padding-bottom':'5px',
		// 	'padding-top':'5px'
		// });
		// children.css({'padding-left':this.listPaddingLeft,margin:0});
		// img.css({
		// 	position:'absolute',
		// 	left:0,
		// 	top:'5px',
		// 	width:this.fontSize,
		// 	height:this.fontSize,
		// 	transform:'rotate(-90deg)'
		// }).addClass('hover_animate1');
		//
		// div.append(img);
		// main.append(div).append(children);
		// body.append(main);
	}

	//清除最后一层多箭头
	[clearLastLayerArrow](){
		let lastDom = this.getLastLayer();
		lastDom.map(dom=>{
			$(dom).find('a').css({'padding-left':'0'}).find('img').remove();
		})
	}

	//获取最后一层的dom
	getLastLayer(){
		let doms = [];
		$(this.dom).find('p').each(function(){
			if($(this).children().length == 0){
				doms.push($(this).parent());
			}
		});

		return doms;
	}

	//关闭所有菜单的折叠
	[closeAllTree](){
		$(this.dom).find('p').css({
			display:'none'
		}).attr({
			state:'close'
		})
	}

	//添加事件
	[addEvent](){
		$(this.dom).find('a').each(function(){
			let hasChildren = $(this).parent().find('p').children();
			if(hasChildren.length != 0){
				$$(this).myclickok(function(){
					let dom = $(this).parent().children('p'),
						isOpen = (dom.attr('state') == 'open');

					if(isOpen){
						//关闭
						dom.css({display:'none'}).attr({state:'close'});
						$(this).find('img').css({transform:'rotate(-90deg)'});
					}else{
						//打开
						dom.css({display:'block'}).attr({state:'open'});
						$(this).find('img').css({transform:'rotate(0)'});
					}
				});
			}
		})
	}

	//注销
	destroy(){
		let list = $(this.dom).find('a');
		$$(list).unbind(true);
		$(this.dom).html('');
	}
}



module.exports = treeSelect;