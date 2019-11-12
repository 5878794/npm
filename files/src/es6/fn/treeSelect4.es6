//树形菜单
//倒数第二级是checkbox

//eg:
//  dd = new treeDom({
// 	    dom:document.body,                  //放入的容器
// 		data:treeData,                      //数据
// 		selected:['010101','010103'],       //初始选中的选项的code
// 		notEdit:['010103']                  //不能修改的选项的code
// 	});


//api
// 	dd.getSelectVal();          //获取选中的数据
//                              //返回数组 包含对象 {name:'',code:'',childrem:[{name:'',code:''}]}


let treeSelect = require('../lib/input/treeSelect'),
	$$ = require('../lib/event/$$');

let addCheckBox = Symbol();



class treeSelect4 extends treeSelect{
	constructor(opt){
		super(opt);

		this.selected = opt.selected || [];
		this.notEdit = opt.notEdit || [];

		this[addCheckBox]();
		this.preventCheckboxEvent();
	}


	//倒数第二层添加checkbox
	[addCheckBox](){
		let doms = this.getLastLayer(),
			checkbox = $('<input type="checkbox" name="__treeCheckBox__" />'),
			label = $('<label></label>');

		doms = this.getLast2Layer(doms);

		label.css({
			position:'absolute',
			left:0,
			top:0,
			right:'auto',
			bottom:0
		});
		checkbox.css({
			width:this.fontSize,
			height:this.fontSize,
			display:'block',
			position:'absolute',
			left:this.listPaddingLeft,
			top:'5px',
			padding:0,margin:0
		});
		label.append(checkbox);

		doms.map(dom=>{
			let item = label.clone(),
				code = dom.children('a').attr('code'),
				text = dom.children('a').attr('text');

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

			dom.children('a').css({
				'padding-left':parseInt(this.listPaddingLeft)*2+'px'
			}).append(item);
		});



	}

	//阻止checkbox事件穿透
	preventCheckboxEvent(){
		let checkbox = $(this.dom).find('input');
		$$(checkbox).myclickok(function(e){e.stopPop()});
	}

	//获取倒数第二层dom
	getLast2Layer(doms){
		let findDom = {};
		doms.map(rs=>{
			let id = rs.parent().attr('id');
			findDom[id] = rs.parent().parent();
		});
		let backData = [];
		for(let val of Object.values(findDom)){
			backData.push(val);
		}


		return backData;
	}


	//获取选中的checkbox值
	getSelectVal(){
		let selects = [];
		$(this.dom).find('input[type="checkbox"]').each(function(){
			if(this.checked){
				let children = $(this).parent().parent().parent().find('p').find('a'),
					childrenData = [];

				children.each(function(){
					childrenData.push({
						name:$(this).attr('text'),
						code:$(this).attr('code')
					})
				});

				selects.push({
					code:$(this).attr('code'),
					name:$(this).attr('text'),
					children:childrenData
				});
			}
		});
		return selects;
	}
}



module.exports = treeSelect4;