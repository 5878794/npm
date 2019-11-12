//树形菜单
//最后一级是checkbox
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


let treeSelect = require('./treeSelect1');




class treeSelect3 extends treeSelect{
	constructor(opt){
		super(opt);

	}





	//获取选中的checkbox值
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
}



module.exports = treeSelect3;