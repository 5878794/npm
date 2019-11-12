//树形菜单
//最后一级是checkbox

//eg:
//  dd = new treeDom({
// 	    dom:document.body,                  //放入的容器
// 		data:treeData,                      //数据
// 		selected:['010101','010103'],       //初始选中的选项的code
// 		notEdit:['010103']                  //不能修改的选项的code
// 	});


//api
// 	dd.getSelectVal();          //获取选中的数据
//                              //返回数组 包含对象 {code:'',name:''}


let treeSelect = require('../lib/input/treeSelect');

let addCheckBox = Symbol();



class treeSelect1 extends treeSelect{
	constructor(opt){
		super(opt);

		this.selected = opt.selected || [];
		this.notEdit = opt.notEdit || [];

		this[addCheckBox]();
	}


	//最后一层添加checkbox
	[addCheckBox](){
		let doms = this.getLastLayer(),
			checkbox = $('<input type="checkbox" name="__treeCheckBox__" />'),
			label = $('<label></label>');
		label.css({
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
			left:0,
			top:'5px',
			padding:0,margin:0
		});
		label.append(checkbox);

		doms.map(dom=>{
			let item = label.clone(),
				code = dom.find('a').attr('code'),
				text = dom.find('a').attr('text');

			//处理是否默认选中和不可修改的属性
			if(this.selected.indexOf(code) > -1){
				item.find('input').get(0).checked = true;
			}
			if(this.notEdit.indexOf(code) > -1){
				item.find('input').attr({disabled:'disabled'})
			}

			item.find('input').attr({
				code:code,
				text:text
			}).val(code);

			dom.find('a').css({
				'padding-left':this.listPaddingLeft
			}).append(item);
		})
	}


	//获取选中的checkbox值
	getSelectVal(){
		let selects = [];
		$(this.dom).find('input[type="checkbox"]').each(function(){
			if(this.checked){
				selects.push({
					code:$(this).attr('code'),
					name:$(this).attr('text')
				});
			}
		});
		return selects;
	}
}



module.exports = treeSelect1;