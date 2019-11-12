//树形菜单
//每级都是checkbox
//最终输出带层级的文本
//eg:
//  dd = new treeDom({
// 	    dom:document.body,                  //放入的容器
// 		data:treeData,                      //数据
// 		selected:['010101','010103'],       //初始选中的选项的code
// 		notEdit:['010103']                  //不能修改的选项的code
// 	});


//api
// 	dd.getSelectVal();          //获取选中的数据
//                              //返回数组 文本





let treeSelect = require('../lib/input/treeSelect'),
	$$ = require('../lib/event/$$'),
	checkboxClickNotShowChildren = Symbol(),
	addCheckBox = Symbol();


class treeSelect2 extends treeSelect{
	constructor(opt){
		super(opt);

		this.selected = opt.selected || [];
		this.notEdit = opt.notEdit || [];

		this[addCheckBox]();
		this[checkboxClickNotShowChildren]();
	}


	//每层添加checkbox
	[addCheckBox](){
		let doms = $(this.dom).find('a'),
			checkbox = $('<input type="checkbox" name="__treeCheckBox__" />'),
			label = $('<label></label>'),
			_this = this;

		label.css({
			display:'block',
			position:'absolute',
			left:0,
			top:0,
			right:0,
			bottom:0
		});
		checkbox.css({
			width:this.fontSize,
			height:this.fontSize,
			display:'block',
			position:'absolute',
			left:_this.listPaddingLeft,
			top:'5px',
			padding:0,margin:0
		});
		label.append(checkbox);

		doms.each(function(){
			let item = label.clone(),
				code = $(this).attr('code'),
				text = $(this).attr('text');

			//处理是否默认选中和不可修改的属性
			if(_this.selected.indexOf(code) > -1){
				item.find('input').get(0).checked = true;
			}
			if(_this.notEdit.indexOf(code) > -1){
				item.find('input').attr({disabled:'disabled'})
			}

			item.find('input').attr({
				code:code,
				text:text
			}).val(code);

			$(this).css({
				'padding-left':parseInt(_this.listPaddingLeft)*2+"px"
			}).append(item);
		});
	}


	//点击checkbox不展开下一层
	//点击列表不选中checkbox
	[checkboxClickNotShowChildren](){
		//阻止checkbox事件穿透到下面列表上
		let checkbox = $(this.dom).find('input');
		$$(checkbox).myclickok(function(e){e.stopPop()});



		//缩短非最后一层的label
		let label = $(this.dom).find('label'),
			_this = this;

		label.each(function(){
			let childDom = $(this).parent().parent().find('p').children();

			//非最后一层
			if(childDom.length != 0){
				$(this).css({
					right:'auto'
				})
			}
		});

	}


	//获取选中的checkbox值
	// getSelectVal(){
	// 	let selects = [];
	// 	$(this.dom).find('input[type="checkbox"]').each(function(){
	// 		if(this.checked){
	// 			selects.push({
	// 				code:$(this).attr('code'),
	// 				name:$(this).attr('text')
	// 			});
	// 		}
	// 	});
	// 	return selects;
	// }

	//获取选中的checkbox值  带层级
	getSelectVal(){
		let doms = this.getLastLayer(),
			parentDoms = {},    //有值的最后一层的父级元素
			backData = [];

		doms.map(dom=>{
			if(dom.find('input').get(0).checked){
				let parentId = dom.parent().attr('id');
				parentDoms[parentId] = true;
			}
		});

		// 循环选中的父级dom元素，在拼接之下子元素的text
		for(let key of Object.keys(parentDoms)){
			let dom = $('#'+key),
				text = dom.attr('text')+'@@@@';

			dom.find('input').each(function(){
				if(this.checked){
					text += $(this).parent().parent().attr('text') + '$$$$';
				}
			});

			text = text.substr(0,text.length-4);

			backData.push(text);
		}

		return backData;
	}

	destroy(){
		let checkbox = $(this.dom).find('input');
		$$(checkbox).unbind(true);

		super.destroy();
	}
}



module.exports = treeSelect2;
